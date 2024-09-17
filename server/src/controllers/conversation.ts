import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono'
import { streamText } from 'hono/streaming';
import type { ChatArgsSchema } from '../chat/models/metadata';
import type { Context } from '../context';
import { buildChat } from '../chat/chat';
import type { z } from 'zod';
import { buildMemory } from '../chat/memories/sql_memory';

const app = new Hono<Context>()

const prisma = new PrismaClient();
// conversations routes

//create converrsation
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
  //const pdf = await prisma.pdf.findUnique({
  //  where: { id: id },
  //  include: {
  //    conversations: true
  //  }
  //});

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

  console.log(`the real conversation id: --->`, conversationId);

  const queue = [];
  const handleLLMNewToken= (token: string) => {
    queue.push[token];
  }
  const handleLLMEnd = () => {
    queue.push(null);
  }

  type ChatArgs = z.infer<typeof ChatArgsSchema>;
  const chatArgs: ChatArgs = {
    pdf_id: conversations?.pdf.id!,
    streaming: Boolean(stream),
    conversation_id: conversationId,
    callbacks: {
      newToken: newTokenHandler,
      tokenEnd: tokenEndHandler,
    },
    metadata: {
      "conversation_id": conversationId,
      "user_id": user.id,
      "pdf_id": conversations?.pdf.id!
    }
  }
  console.log(`chatArgs: --->`, chatArgs)
  const chat = await buildChat(chatArgs)
  if (!chat) {
    return c.text('chat not implemented');
  }

  if (streaming) {
    return streamText(c, async (stream) => {
      // Write a text with a new line ('\n').
      await chat.stream({ question: input, chat_history: buildMemory(chatArgs) });
      while(true) {
       const tok = queue.shift();
        if (!tok) {
          break;
        }
      await stream.write(tok)
      }
    })
  }
  const res = await chat.invoke({ question: input, chat_history: buildMemory(chatArgs) });
  console.log(res)
  return c.json({ role: 'assistant', content: res.text })
});

export default app
