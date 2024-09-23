import { ChatOpenAI } from '@langchain/openai'


export function buildllm(chatArgs: any, model: string = 'gpt-3.5-turbo') {
  return new ChatOpenAI({ model: model, streaming: chatArgs.streaming, callbacks: [chatArgs.callbacks] });
}

type LLMBuilder = (chatArgs: any) => ChatOpenAI;

export const llmMap = new Map<string, LLMBuilder>();
llmMap.set('gpt-3.5-turbo', (chatArgs: any) => buildllm(chatArgs, 'gpt-3.5-turbo'));
llmMap.set('gpt-4', (chatArgs: any) => buildllm(chatArgs, 'gpt-4'));

