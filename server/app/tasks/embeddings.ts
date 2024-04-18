import Pdf from '#models/pdf'
import { createEmbeddingsForPdf } from '../chat/create_embeddings.ts'
import { Download } from '../files.ts'

export async function processDocument(pdfId: string) {
  const pdf = await Pdf.findOrFail(pdfId)

  const downloaded = new Download(pdf.id.toString())
  const filePath = await downloaded.startDownload()
  createEmbeddingsForPdf(pdf.id.toString(), filePath)
  downloaded.cleanup()
}
