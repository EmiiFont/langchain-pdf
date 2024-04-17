import Pdf from '#models/pdf'
import fs from 'node:fs'
import type { HttpContext } from '@adonisjs/core/http'

import { createDownloadUrl, upload } from '../files.ts'

export default class PdfsController {
  async list({ auth }: HttpContext) {
    console.log('pdfs list')
    const pdfs = await Pdf.query().where('userid', auth.user!.id).orderBy('createdAt', 'desc')

    if (pdfs === null) {
      return {}
    }
    return pdfs.map((pdf) => pdf.toJSON())
  }

  async uploadFile({ auth, request, response }: HttpContext) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { file_id, file_path, file_name } = request.body()
    const { message: res, statusCode } = await upload(file_path)
    if (statusCode >= 400) {
      return response.status(statusCode).json(res)
    }

    const pdf = await Pdf.create({
      id: file_id,
      name: file_name,
      userid: auth.user!.id,
    })

    console.log(request.body())
    // // TODO: Defer this to be processed by the worker
    // processDocument(pdf.id)
    //
    return pdf.toJSON()
  }

  async show({ params, response }: HttpContext) {
    const { pdf_id: pdfId } = params
    const pdf = await Pdf.findOrFail(pdfId)
    return response.json({
      pdf: pdf.toJSON(),
      download_url: createDownloadUrl(pdf.id.toString()),
    })
  }
}
