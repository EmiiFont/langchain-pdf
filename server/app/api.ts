import Conversation from '#models/conversation'
import Message from '#models/message'
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema'

export async function getMessagesByConversationId(
  conversationId: string
): Promise<(AIMessage | HumanMessage | SystemMessage)[]> {
  const messages = await Message.query()
    .where('conversation_id', conversationId)
    .orderBy('created_on', 'desc')

  return messages.map((message) => message.asLCMessage())
}

export async function addMessageToConversation(
  conversationId: string,
  role: string,
  content: string
): Promise<Message> {
  const message = new Message()
  message.conversationId = conversationId
  message.role = role
  message.content = content
  await message.save()

  return message
}

export async function getConversationComponents(
  conversationId: string
): Promise<Record<string, string>> {
  const conversation = await Conversation.find(conversationId)

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
  const conversation = await Conversation.find(conversationId)
  conversation!.merge({ llm, retriever, memory })
  await conversation!.save()
}
