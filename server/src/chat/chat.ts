
import type { z } from 'zod';
import { ChatArgsSchema } from './models/metadata';
import { buildRetriever } from './vector_stores/pinecone'
import { buildllm } from './llms/chatopenai'
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { buildMemory } from './memories/sql_memory'

export async function buildChat(chatArgs: z.infer<typeof ChatArgsSchema>) {
  const retriever = await buildRetriever(chatArgs);
  const model = buildllm(chatArgs);
  const memory = buildMemory(chatArgs);

  console.log(`all builds done`)

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    retriever,
    {
      memory: memory,
      returnSourceDocuments: true,
    }
  );
  return chain
} 
