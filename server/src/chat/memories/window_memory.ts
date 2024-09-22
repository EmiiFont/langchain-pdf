import { BufferWindowMemory } from 'langchain/memory';
import { SqlMessageHistory } from './histories/sql_history';

export function builWindowBufferMemory(chatArgs: any) {
  return new BufferWindowMemory({
    chatHistory: new SqlMessageHistory(chatArgs.conversation_id),
    inputKey: "question",
    outputKey: "text",
    memoryKey: "chat_history",
    returnMessages: true,
    k: 2
  })
}
