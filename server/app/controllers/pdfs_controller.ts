import Pdf from '#models/pdf'
import type { HttpContext } from '@adonisjs/core/http'

export default class PdfsController {
  async index({ auth }: HttpContext) {
    const pdfs = await Pdf.query().where('user_id', auth.user!.id).orderBy('created_at', 'desc')

    return pdfs.map((pdf) => pdf.toJSON())
  }

  async uploadFile({ auth, request, response }: HttpContext) {
    // const file = request.file('file')
    // const { id: fileId, file_path: filePath, file_name: fileName } = file
    //
    // const { res, status_code } = await files.upload(filePath)
    // if (status_code >= 400) {
    //   return response.status(status_code).json(res)
    // }
    //
    // const pdf = await Pdf.create({
    //   id: fileId,
    //   name: fileName,
    //   user_id: auth.user.id,
    // })
    //
    // // TODO: Defer this to be processed by the worker
    // processDocument(pdf.id)
    //
    // return pdf.toJSON()
    return response.json({})
  }

  async show({ params, response }: HttpContext) {
    const { pdf_id: pdfId } = params
    const pdf = await Pdf.findOrFail(pdfId)

    return {
      pdf: pdf.toJSON(),
      // download_url: files.createDownloadUrl(pdf.id),
    }
  }
}

