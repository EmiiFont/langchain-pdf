import { Hono } from 'hono'
import { logger } from 'hono/logger'
import pdfs from './controllers/pdfs'
import converstation from './controllers/conversation'
import user from './controllers/user.auth'

const app = new Hono()

app.use(logger());
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
