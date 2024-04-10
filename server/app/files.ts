import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import fetch from 'node-fetch'
import env from '#start/env'

const uploadUrl = `${env.get('UPLOAD_URL')}/upload`

interface UploadResponse {
  message: string
  file_id: string
  statusCode: number
}

async function upload(localFilePath: string): Promise<UploadResponse> {
  const formData = new FormData()
  const fileStream = fs.createReadStream(localFilePath)
  const fileBlob = new Blob([fileStream as any]) // Use 'any' type for compatibility

  formData.append('file', fileBlob, path.basename(localFilePath)) // Append the file Blob to formData

  try {
    console.log('upload url:', uploadUrl)
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData as any,
    })
    const responseBody = await response.json()
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
