import { Hono } from 'hono'

const app = new Hono()

// conversations routes
app.get('/', (c) => {
  return c.json({ conversations: [] })
});

app.post('/', (c) => {
 return c.json({ conversations: [] })
});

app.get('/:conversation_id', (c) => {
  const id = c.req.param('conversation_id');
  return c.json({ conversation_id: id });
});

export default app
