import { Hono } from 'hono'
import { hash } from "@node-rs/argon2";
import { PrismaClient } from '@prisma/client';
import { lucia } from '../lib/auth'
import { verify } from "@node-rs/argon2";
// auth routes
const app = new Hono();
const prisma = new PrismaClient();

app.get('/user', (c) => {
  return c.json({ users: [] })
});

app.post('/signup', async (c) => {
  console.log(c.req)
  const body = await c.req.parseBody<{
    username: string;
    password: string;
  }>();
  if (!body.username || !body.password) {
    c.status(400);
    return c.json({ error: 'Invalid username or password' });
  }
  const passwordHash = await hash(body.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
  const user = await prisma.user.create({
    data: {
      email: body.username,
      password: passwordHash,
      fullName: body.username,
    }
  });
  const session = await lucia.createSession(user.id.toString(), {});
  c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
  return c.json(user)
});

app.post('/signOut', (c) => {
  return c.json({ users: [] })
});

app.post('/signin', async (c) => {
  const body = await c.req.parseBody<{
    username: string;
    password: string;
  }>();

  const user = await prisma.user.findUnique({
    where: {
      email: body.username
    }
  });

  if (!user) {
    c.status(401);
    return c.json({ error: 'Invalid username or password' });
  }

  const validPassword = await verify(user.password, body.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  if (!validPassword) {
    c.status(401);
    return c.json({ error: 'Invalid username or password' });
  }

  const session = await lucia.createSession(user.id, {});

  c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
  c.status(200)
  return c.json({ user })
});

export default app
