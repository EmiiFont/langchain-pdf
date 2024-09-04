import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono'
import path from 'node:path';
import fs from 'node:fs';

const app = new Hono()

const prisma = new PrismaClient();
// score routes
app.get('/catchAll', async (c) => {
    let { path: filePath } = c.req.param('filePath')

    if (!filePath) {
        filePath = 'index.html'
    }

    const staticPath = '/' //Helpers.publicPath()

    if (filePath !== '' && (await fileExists(staticPath, filePath))) {
        return c.html(path.join(staticPath, filePath))
    }
    return c.html(path.join(staticPath, 'index.html'))
});

async function fileExists(basePath: string, filePath: string) {
    try {
        await fs.promises.access(path.join(basePath, filePath))
        return true
    } catch (error) {
        return false
    }
}
export default app
