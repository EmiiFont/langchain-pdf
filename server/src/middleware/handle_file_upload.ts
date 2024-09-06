import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

import { v4 as uuidv4 } from 'uuid'
import { createMiddleware } from 'hono/factory'

const logger = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  const body = await c.req.parseBody()
  console.log(body['file']) // File | string
  const file = body['file']
  if (!file) {
    return ctx.response.status(400).json({ error: 'File upload is required' })
  }
  
  // generate a unique file id
  const fileId = uuidv4()
  const fileName = file.clientName
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uploads-'))

  const filePath = path.join(tempDir, fileId)
  await file.move(tempDir, {
      name: fileId,
      overwrite: true,
  })

    // if (!file.move()) {
    //   return file.errors()
    // }
    //
    // add to the body instead
    console.log('file saved to', filePath)
    const req: any = c.req
    req.body = req.body || {}
    req.body.file_id = fileId
    req.body.file_path = filePath
    req.body.file_name = fileName

    ctx.request.updateBody(req.body)
    const output = await next()
    return output

  await next()
})

export default class HandleFileUploadMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const file = ctx.request.file('file')
    if (!file) {
      return ctx.response.status(400).json({ error: 'File upload is required' })
    }

    // generate a unique file id
    const fileId = uuidv4()
    const fileName = file.clientName
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uploads-'))

    const filePath = path.join(tempDir, fileId)
    await file.move(tempDir, {
      name: fileId,
      overwrite: true,
    })

    // if (!file.move()) {
    //   return file.errors()
    // }
    //
    // add to the body instead
    console.log('file saved to', filePath)
    const req: any = ctx.request
    req.body = req.body || {}
    req.body.file_id = fileId
    req.body.file_path = filePath
    req.body.file_name = fileName

    ctx.request.updateBody(req.body)
    const output = await next()
    return output
  }
}
