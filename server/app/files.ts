import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import fetch from 'node-fetch'
import env from '#start/env'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import axios from 'axios'

const uploadUrl = `${env.get('UPLOAD_URL')}/upload`
const FILENAME = fileURLToPath(import.meta.url)
const DIRNAME = dirname(FILENAME)

interface UploadResponse {
  message: string
  statusCode: number
}

async function upload(localFilePath: string): Promise<UploadResponse> {
  const formData = new FormData()
  const blob = new Blob([fs.readFileSync(localFilePath)], { type: 'application/pdf' })

  formData.append('Content-Type', 'application/pdf')
  formData.append('file', blob, path.basename(localFilePath))
  console.log(formData)

  try {
    // save file to server
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const responseBody = await response.data
    return { status: response.status, ...responseBody }
  } catch (error) {
    throw error
  }
}

function createDownloadUrl(fileId: string): string {
  return `${env.get('UPLOAD_URL')}/download/${fileId}`
}

class Download {
  private file_id: string
  private tempDir: string
  private filePath: string

  constructor(fileId: string) {
    this.file_id = fileId
    this.tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'download-'))
    this.filePath = ''
  }

  async download(): Promise<string> {
    this.filePath = path.join(this.tempDir, this.file_id)
    const url = createDownloadUrl(this.file_id)

    const response = await fetch(url)
    const fileStream = fs.createWriteStream(this.filePath)

    return new Promise<string>((resolve, reject) => {
      response.body.pipe(fileStream)
      fileStream.on('finish', () => {
        resolve(this.filePath)
      })
      fileStream.on('error', (error) => {
        reject(error)
      })
    })
  }

  cleanup(): void {
    fs.rmdirSync(this.tempDir, { recursive: true })
  }

  async startDownload(): Promise<string> {
    try {
      const filePath = await this.download()
      return filePath
    } catch (error) {
      throw error
    } finally {
      this.cleanup()
    }
  }
}

export { upload, createDownloadUrl, Download }
