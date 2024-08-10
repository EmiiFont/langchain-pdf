import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Hono()

app.post('/', async (c) => {
  const newPdf = await prisma.pdf.create({
    data: {
      name: 'test',
      content: 'testcontent',
      userId: 1
    }
  });
  return c.json({ pdf: newPdf })
});

//protect with auth
app.get('/', async (c) => {
  //filter by userid once auth is implemented
  const listPdfs = await prisma.pdf.findMany({ orderBy: { createAt: 'desc' } });
  return c.json({ pdfs: listPdfs })
});

app.get('/:pdf_id', (c) => {
  const id = c.req.param('pdf_id')
  return c.json({ pdf: id })
});

export default app
