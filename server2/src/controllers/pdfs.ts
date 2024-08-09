import { Hono } from 'hono'

const app = new Hono()

app.post('/', (c) => {
  return c.json({ pdfs: [] })
});

//protect with auth
app.get('/', (c) => {
  return c.json({ pdfs: [] })
});

app.get('/:pdf_id', (c) => {
  const id = c.req.param('pdf_id')
  return c.json({ pdf: id })
});

export default app
