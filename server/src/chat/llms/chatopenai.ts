import { ChatOpenAI } from '@langchain/openai'


export function buildllm(chatArgs: any) {
  return new ChatOpenAI({ streaming: chatArgs.streaming, callbacks: [chatArgs.callbacks] });
}
