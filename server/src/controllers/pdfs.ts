import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client";
import { createDownloadUrl } from "../files"

const prisma = new PrismaClient();

const app = new Hono()

app.post('/', async (c) => {
  const user = c.get('user');
  const newPdf = await prisma.pdf.create({
    data: {
      name: 'test',
      content: 'testcontent',
      userId: user.id
    }
  });
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
  return c.json({ pdf, download_url: downloadUrl})
});

export default app
