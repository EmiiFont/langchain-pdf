import { Hono } from 'hono'
import pdfs from './pdfs'
import converstation from './conversation'
import user from './user.auth'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

app.get('/api', (c) => {
  return c.text('Hello Hono!')
});

app.route('api/users', user);
app.route('api/conversations', converstation);
app.route('/api/pdfs', pdfs)

app.get('/api/:path?', (c) => {
  return c.json({ catchAll: {}});
});

export default app
