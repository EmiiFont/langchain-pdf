import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function getMessagesByConversationId(
  conversationId: string
): Promise<(AIMessage | HumanMessage | SystemMessage)[]> {

  const messages = await prisma.message.findMany({
    where: {
      conversationId: parseInt(conversationId)
    },
    orderBy: {
      createAt: 'asc'
    }
  })
  return messages.map((message: any) => message.asLCMessage())
}

export async function addMessageToConversation(
  conversationId: string,
  role: string,
  content: string
): Promise<any> {
  return prisma.message.create({
    data: {
      conversationId: parseInt(conversationId),
      role,
      content,
    },
  });
}

export async function getConversationComponents(
  conversationId: string
): Promise<Record<string, string>> {
  const conversation = await prisma.conversation.findUnique(
    { where: { id: parseInt(conversationId) } }
  )

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
  //update convesrsation
  await prisma.conversation.update({
    where: { id: parseInt(conversationId) },
    data: { llm, retriever, memory },
  })
}



