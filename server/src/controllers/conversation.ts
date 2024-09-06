import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono'

const app = new Hono()

const prisma = new PrismaClient();
// conversations routes
app.get('/', (c) => {
  return c.json({ conversations: [] })
});

app.post('/', async (c) => {
  const body = await c.req.parseBody();

  const pdfId = parseInt(body['pdf_id'] as string);
  return c.json({ conversations: [] })
});

app.get('/:pdf_id', async (c) => {
  const id = c.req.param('pdf_id')
  const pdfWithConversations = await prisma.pdf.findUnique({
    where: { id: parseInt(id) },
    include: {
      conversations: true
    }
  });

  return c.json({
    conversations
      : pdfWithConversations?.conversations || []
  });
});

export default app
