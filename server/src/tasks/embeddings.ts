import { PrismaClient } from '@prisma/client'
import { createEmbeddingsForPdf } from '../chat/create_embeddings.ts'
import { Download } from '../files.ts'

export async function processDocument(pdfId: string) {
  const prisma = new PrismaClient()
  const pdf = await prisma.pdf.findUnique({
    where: { id: pdfId }
  })

  const downloaded = new Download(pdf.id.toString())
  const filePath = await downloaded.startDownload()
  createEmbeddingsForPdf(pdf.id.toString(), filePath)
  downloaded.cleanup()
}
