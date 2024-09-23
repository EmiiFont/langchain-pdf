import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

import { v4 as uuidv4 } from 'uuid'
import { createMiddleware } from 'hono/factory'

export const fileUploadMiddleware = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  const body = await c.req.parseBody()
  console.log(body['file']) // File | string
  const file = body['file'] as File
  if (!file) {
    c.status(400)
    return c.json({ error: 'File upload is required' })
  }

  const fileId = uuidv4();
  const fileName = file.name;

  // Create a temporary directory
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uploads-'))
  const filePath = path.join(tempDir, fileId)
  // Write the file to the temporary directory
  await Bun.write(filePath, await file.arrayBuffer());

  c.set('file_id', fileId)
  c.set('file_path', filePath)
  c.set('file_name', fileName)
  await next()
})

