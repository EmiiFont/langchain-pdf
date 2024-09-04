import { PrismaClient } from '@prisma/client'
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema'

const prisma = new PrismaClient();

export async function getMessagesByConversationId(
  conversationId: string
): Promise<(AIMessage | HumanMessage | SystemMessage)[]> {
  const messages = await prisma.message.findMany({
    where: {
      conversation_id: conversationId,
    },
    orderBy: {
      created_on: 'desc',
    },
  })
  /*const messages = await Message.query()
    .where('conversation_id', conversationId)
    .orderBy('created_on', 'desc')*/

  return messages.map((message: any) => message.asLCMessage())
}

export async function addMessageToConversation(
  conversationId: string,
  role: string,
  content: string
): Promise<any> {
  const message = await prisma.message.create({
    data: {
      conversation_id: conversationId,
      role,
      content,
    },
  })
  return message
}

export async function getConversationComponents(
  conversationId: string
): Promise<Record<string, string>> {
  const conversation = await prisma.Conversation.findUnique({
    where: {
      id: conversationId,
    },
  })

  return {
    llm: conversation!.llm,
    retriever: conversation!.retriever,
    memory: conversation!.memory,
  }
}

export async function setConversationComponents(
  conversationId: string,
  llm: string,
  retriever: string,
  memory: string
): Promise<void> {
  await prisma.Conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      llm,
      retriever,
      memory,
    },
  })
}
