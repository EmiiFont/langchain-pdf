import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { embeddings } from '../embeddings/openai.ts'
import type { VectorStoreRetriever } from '@langchain/core/vectorstores'

const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX_NAME!)

async function buildRetriever(chatArgs: any, k: number = 1) {
  const pineconeStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex })
  console.log(`chat args in pinecone: ${JSON.stringify(chatArgs)}`);
  //const search_kwargs: any = { filter: { pdf_id: chatArgs.metadata.pdf_id }, k };
  return pineconeStore.asRetriever({
    filter: { pdfId: chatArgs.metadata.pdf_id },
    k
  })
}

async function createVectorStore() {
  return await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex })
}

type pineconeBuilder = (chatArgs: any) => Promise<VectorStoreRetriever<PineconeStore>>;
export const pineMap = new Map<string, pineconeBuilder>();
pineMap.set('pinecone_1', async (chatArgs: any) => buildRetriever(chatArgs, 1));
pineMap.set('pinecone_2', async (chatArgs: any) => buildRetriever(chatArgs, 2));
pineMap.set('pinecone_3', async (chatArgs: any) => buildRetriever(chatArgs, 3));


export { createVectorStore, buildRetriever }
