import { Hono } from 'hono'
import { logger } from 'hono/logger'
import pdfs from './controllers/pdfs'
import converstation from './controllers/conversation'
import user from './controllers/user.auth'
import { csrf } from "hono/csrf";
import { getCookie } from "hono/cookie";
import type { User, Session } from "lucia";
import { lucia } from "./lib/auth";

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>()

app.use(logger());
app.use(csrf());

//adapter.getUserSessions(useImperativeHandle)

app.use("*", async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    // use `header()` instead of `setCookie()` to avoid TS errors
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true
    });
  }
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true
    });
  }
  c.set("user", user);
  c.set("session", session);
  return next();
});


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
  return c.json({ catchAll: {} });
});

export default app
