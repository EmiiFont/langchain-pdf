import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { embeddings } from '../embeddings/openai.ts'

const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX_NAME!)

async function buildRetriever(chatArgs: any) {
  const pineconeStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex })
  const search_kwargs: any = { filter: { pdf_id: chatArgs.pdf_id } };
  return pineconeStore.asRetriever({
    searchKwargs: search_kwargs,
  })
}

async function createVectorStore() {
  return await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex })
}

export { createVectorStore, buildRetriever }
