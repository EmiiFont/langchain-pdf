import { Hono } from 'hono'
import { hash } from "@node-rs/argon2";
import { PrismaClient } from '@prisma/client';
import { lucia } from '../lib/auth'
// auth routes
const app = new Hono();
const prisma = new PrismaClient();

app.get('/user', (c) => {
  return c.json({ users: [] })
});

app.post('/signup', async (c) => {
  const body = await c.req.parseBody<{
    username: string;
    password: string;
  }>();
  const passwordHash = await hash(body.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
  const user = await prisma.user.create({
    data: {
      username: body.username,
      password: passwordHash
    }
  });
  const session = await lucia.createSession(user.id, {});
  c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
  return c.json(user)
});

app.post('/signOut', (c) => {
  return c.json({ users: [] })
});

app.post('/signin', (c) => {
  const body = await c.req.parseBody<{
		username: string;
		password: string;
	}>();

  const user = await prisma.user.findUnique({
    where: {
      username: body.username
    }
  });

  if (!user) {
    c.status(401);
    c.json({ error: 'Invalid username or password' });
  }

  const validPassword = await verify(existingUser.password_hash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

  if(!validPassword) {
    c.status(401);
    c.json({ error: 'Invalid username or password' });
  }

  const session = await lucia.createSession(existingUser.id, {});

	c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
  return c.json({ user })
});

export default app
