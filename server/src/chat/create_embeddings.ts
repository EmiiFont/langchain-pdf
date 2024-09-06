import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { createVectorStore } from './vector_stores/pinecone.ts'

export async function createEmbeddingsForPdf(pdfId: string, pdfPath: string) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  })
  console.log(`Loading and splitting PDF ${pdfId} from ${pdfPath}`);
  const pdfLoader = new PDFLoader(pdfPath);
  const docs = await pdfLoader.loadAndSplit(textSplitter);
  const vector_stores = await createVectorStore();
  await vector_stores.addDocuments(docs);
}
