import { ChatOpenAI } from '@langchain/openai'


export function buildllm(chatArgs: any) {
  return new ChatOpenAI();
}
