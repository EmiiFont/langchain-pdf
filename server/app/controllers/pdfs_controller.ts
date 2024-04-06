import Pdf from '#models/pdf'
import type { HttpContext } from '@adonisjs/core/http'

import { createDownloadUrl, upload } from '../files.ts'

export default class PdfsController {
  async list({ auth }: HttpContext) {
    const pdfs = await Pdf.query().where('user_id', auth.user!.id).orderBy('created_at', 'desc')

    return pdfs.map((pdf) => pdf.toJSON())
  }

  async uploadFile({ auth, request, response }: HttpContext) {
    const file = request.file('file')
    const { id: fileId, file_path: filePath, file_name: fileName } = request.body()
    console.log(file)
    const { message: res, statusCode } = await upload(filePath)
    if (statusCode >= 400) {
      return response.status(statusCode).json(res)
    }

    const pdf = await Pdf.create({
      id: fileId,
      name: fileName,
      userId: auth.user!.id,
    })

    // // TODO: Defer this to be processed by the worker
    // processDocument(pdf.id)
    //
    return pdf.toJSON()
  }

  async show({ params }: HttpContext) {
    const { pdf_id: pdfId } = params
    const pdf = await Pdf.findOrFail(pdfId)

    return {
      pdf: pdf.toJSON(),
      download_url: createDownloadUrl(pdf.id.toString()),
    }
  }
}

