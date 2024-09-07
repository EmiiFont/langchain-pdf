import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client";
import { createDownloadUrl, upload } from "../files"
import { fileUploadMiddleware } from '../middleware/handle_file_upload';
import type { StatusCode } from 'hono/utils/http-status';

import { processDocument } from '../tasks/embeddings';
import type { Context } from '../context';

const prisma = new PrismaClient();

const app = new Hono<Context>()

app.post('/', fileUploadMiddleware, async (c) => {
  const fileId = c.get('file_id')
  const fileName = c.get('file_name')
  const filePath = c.get('file_path')
  const user = c.get('user')

  if (!user) {
    c.status(401)
    return c.json({ error: 'Not authorized' })
  }

  console.log(`Uploading file ${fileName} with id ${fileId} and path ${filePath}`)

  const { message: res, statusCode } = await upload(filePath)
  if (statusCode >= 400) {
    c.status(statusCode as StatusCode)
    return c.json(res)
  }
  const newPdf = await prisma.pdf.create({
    data: {
      id: fileId,
      name: fileName,
      userId: parseInt(user.id),
      content: ''
    }
  });

  // // TODO: Defer this to be processed by the worker
  //processDocument(fileId)
  //
  const pdf = { id: newPdf.id, name: newPdf.name, userId: newPdf.userId }
  return c.json({ pdf })
});

//protect with auth
app.get('/', async (c) => {
  //filter by userid once auth is implemented
  const user = c.get('user');
  if (!user) {
    c.status(401);
    return c.json({ error: 'Not authorized' });
  }

  const userPdfs = await prisma.pdf.findMany({ where: { userId: user.id } });

  if (!userPdfs) {
    return c.json({})
  }

  return c.json(userPdfs.map((pdf) => ({ id: pdf.id, name: pdf.name, userId: pdf.userId })))
});

app.get('/:pdf_id', async (c) => {
  const id = c.req.param('pdf_id')
  const pdfDb = await prisma.pdf.findUnique({ where: { id: parseInt(id) } })
  if (!pdfDb) {
    c.status(404);
    return c.json({ error: 'Pdf not found' });
  }
  console.log(pdfDb)
  const downloadUrl = createDownloadUrl(pdfDb.id.toString())
  console.log(downloadUrl)
  const pdf = { id: pdfDb.id, name: pdfDb.name, userId: pdfDb.userId }
  return c.json({ pdf, download_url: downloadUrl })
});

export default app
