import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono'
import { get_scores, score_conversation } from '../chat/score';

const app = new Hono()

const prisma = new PrismaClient();
app.get('/', async (c) => {
  const scoresAggregates = await get_scores();
  console.log(scoresAggregates);
  return c.json(scoresAggregates)
});

app.post('/', async (c) => {
  const body = await c.req.json();
  const conversationId = parseInt(c.req.query('conversation_id') as string);

  const score = parseFloat(body['score'] as string);
  console.log(body);
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId }
  });
  console.log(score);

  await score_conversation(conversationId, score, conversation!.llm, conversation!.retriever, conversation!.memory);
  return c.json({ message: 'Score Updated' })
});


export default app
