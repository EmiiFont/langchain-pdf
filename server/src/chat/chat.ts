import { ChatArgsSchema } from './models/metadata';
import { pineMap } from './vector_stores/pinecone'
import { llmMap } from './llms/chatopenai'
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { setConversationComponents, getConversationComponents } from '../api';
import { memoryMap } from './memories/memory_map';
import { ChatOpenAI } from '@langchain/openai';
import { randomComponentByScore } from './score';

async function getChainComponents(componentName: string, componentMap: Map<string, Function>, chatArgs: any):
  Promise<{ componentName: string, a: any }> {
  const components = await getConversationComponents(chatArgs.conversation_id);
  if (components[componentName]) {
    const previousComponent = components[componentName];
    const buildComponent = componentMap.get(previousComponent);
    if (!buildComponent) {
      throw new Error(`${componentName} ${components[componentName]} not found in componentMap`);
    }
    return { componentName: previousComponent, a: await buildComponent(chatArgs) }
  } else {
    const keys = Array.from(componentMap.keys());
    const randomKey = await randomComponentByScore(componentName, componentMap); //keys[Math.floor(Math.random() * keys.length)];
    const buildComponent = componentMap.get(randomKey);
    if (!buildComponent) {
      throw new Error(`${componentName} ${randomKey} not found in componentMap`);
    }
    await setConversationComponents(chatArgs.conversation_id, "", randomKey, "");
    return { componentName: randomKey, a: await buildComponent(chatArgs) }
  }
}

export async function buildChat(chatArgs: any) {
  const { componentName: retrieverName, a: buildRetriever } = await getChainComponents('retriever', pineMap, chatArgs);
  const { componentName: llmName, a: llm } = await getChainComponents('llm', llmMap, chatArgs);
  chatArgs.llm = llm;
  const { componentName: memoryName, a: buildMemory } = await getChainComponents('memory', memoryMap, chatArgs);

  console.log(`running chain with llm: ${llmName}, retriever: ${retrieverName}, memory: ${memoryName}`);
  setConversationComponents(chatArgs.conversation_id, llmName, retrieverName, memoryName);

  const chain = ConversationalRetrievalQAChain.fromLLM(
    llm,
    buildRetriever,
    {
      memory: buildMemory,
      returnSourceDocuments: true,
      verbose: true,
      questionGeneratorChainOptions: {
        llm: new ChatOpenAI({})
      }
    },
  );
  return chain
}

