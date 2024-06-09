import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { embeddings } from '../embeddings/openai.ts'

const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX_NAME!)
export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex })
