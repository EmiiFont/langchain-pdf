import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono'

const app = new Hono()

const prisma = new PrismaClient();
// score routes
app.get('/', (c) => {
    return c.json({ })
});

app.put('/', async (c) => {
    const body = await c.req.parseBody();

    const conversationId = parseInt(body['conversation_id'] as string);
    const score = parseFloat(body['score'] as string);
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
    });
    if (Number.isNaN(score) || score < -1 || score > 1) {
        throw new Error('Score must be a float between -1 and 1')
    }
// await scoreConversation({
    //   conversationId: conversation.id,
    //   score,
    //   llm: conversation.llm,
    //   retriever: conversation.retriever,
    //   memory: conversation.memory,
    // })
    //
    return c.json({ message: 'Score Updated' })
});


export default app
