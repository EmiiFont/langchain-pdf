import type { HttpContext } from '@adonisjs/core/http'
import path from 'node:path'
import fs from 'node:fs'

export default class ClientsController {
  async catchAll({ params, response }: HttpContext) {
    let { path: filePath } = params

    if (!filePath) {
      filePath = 'index.html'
    }

    const staticPath = '/' //Helpers.publicPath()

    if (filePath !== '' && (await this.fileExists(staticPath, filePath))) {
      return response.download(path.join(staticPath, filePath))
    }

    return response.download(path.join(staticPath, 'index.html'))
  }

  async fileExists(basePath: string, filePath: string) {
    try {
      await fs.promises.access(path.join(basePath, filePath))
      return true
    } catch (error) {
      return false
    }
  }
}

