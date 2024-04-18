import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
export async function createEmbeddingsForPdf(pdfId: string, pdfPath: string) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  })
  const pdfLoader = new PDFLoader(pdfPath)
  const docs = await pdfLoader.loadAndSplit(textSplitter)
  console.log(docs)

  //     Generate and store embeddings for the given pdf
  //
  //     1. Extract text from the specified PDF.
  //     2. Divide the extracted text into manageable chunks.
  //     3. Generate an embedding for each chunk.
  //     4. Persist the generated embeddings.
  //
  //     :param pdf_id: The unique identifier for the PDF.
  //     :param pdf_path: The file path to the PDF.
  //
  //     Example Usage:
  //
  // create_embeddings_for_pdf('123456', '/path/to/pdf')
}
