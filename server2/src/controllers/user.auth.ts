import { Hono } from 'hono'
// auth routes
const app = new Hono();

app.get('/user', (c) => {
  return c.json({ users: [] })
});

app.post('/auth', (c) => {
  return c.json({ users: [] })
});

app.post('/signOut', (c) => {
  return c.json({ users: [] })
});

app.post('/signin', (c) => {
  return c.json({ users: [] })
});

export default app
