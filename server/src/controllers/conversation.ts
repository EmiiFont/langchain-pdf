import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono'
import { streamText } from 'hono/streaming';
import type { Context } from '../context';
import { buildChat } from '../chat/chat';
import { buildMemory } from '../chat/memories/sql_memory';
import { langfuseLangchainHandler } from '../chat/tracing/langfuse';

const app = new Hono<Context>()

const prisma = new PrismaClient();

const executeChain = async (chain: any, input: string, isInvoke: Boolean, chatArgs: any) => {
  langfuseLangchainHandler.traceId = chatArgs.conversation_id;
  langfuseLangchainHandler.metadata = chatArgs.metadata;
  if (isInvoke) {
    return await chain.invoke({ question: input, chat_history: buildMemory(chatArgs) }, { callbacks: [langfuseLangchainHandler] });
  }
  return await chain.stream({ question: input, chat_history: buildMemory(chatArgs) }, { callbacks: [langfuseLangchainHandler] });
}

app.post('/', async (c) => {
  const pdfId = c.req.query('pdf_id');
  const user = c.get('user');

  const conversation = await prisma.conversation.create({
    data: {
      retriever: '',
      memory: '',
      llm: '',
      pdfId: pdfId!,
      userId: parseInt(user!.id)
    },
    include: {
      messages: true
    }
  });
  return c.json({
    id: conversation.id, pdf_id: conversation.pdfId, messages: conversation.messages.map((message) => {
      return { id: message.id, role: message.role, content: message.content };
    })
  });
});

app.get('/', async (c) => {
  const id = c.req.query('pdf_id')
  const conversation = await prisma.conversation.findMany({
    where: {
      pdfId: id
    },
    include: {
      messages: true
    }
  });

  const conversations = conversation.map((conversation) => {
    return {
      id: conversation.id, pdf_id: conversation.pdfId, messages: conversation.messages.map((message) => {
        return { id: message.id, role: message.role, content: message.content };
      })
    }
  });

  return c.json(conversations);
});

app.post('/:conversation_id/messages', async (c) => {
  const body = await c.req.json();
  const input = body.input;
  const streaming = c.req.query('stream');
  const conversationId = c.req.param('conversation_id')
  const user = c.get('user');

  if (!user) {
    c.status(401);
    return c.json({ error: 'Not authorized' });
  }

  const conversations = await prisma.conversation.findUnique({
    where: {
      id: parseInt(conversationId)
    },
    include: {
      pdf: true
    }
  });

  const queue: Array<string | null> = [];

  const handleLLMNewToken = (token: string) => {
    queue.push(token);
  }
  const handleLLMEnd = () => {
    queue.push(null);
  }

  const chatArgs: any = {
    streaming: Boolean(streaming),
    conversation_id: conversationId,
    callbacks: {
      handleLLMNewToken,
      handleLLMEnd
    },
    metadata: {
      "conversation_id": conversationId,
      "user_id": user.id,
      "pdf_id": conversations?.pdfId!
    }
  }
  const chat = await buildChat(chatArgs)
  if (!chat) {
    return c.text('chat not implemented');
  }

  if (streaming) {
    return streamText(c, async (stream) => {
      await executeChain(chat, input, false, chatArgs);
      while (true) {
        const tok = queue.shift();
        if (tok === null) {
          break;
        }
        await stream.write(String(tok))
      }
    })
  }

  const res = await executeChain(chat, input, true, chatArgs);
  return c.json({ role: 'assistant', content: res.text })
});

export default app
