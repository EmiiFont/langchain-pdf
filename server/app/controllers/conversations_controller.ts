import Conversation from '#models/conversation'
import Pdf from '#models/pdf'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConversationsController {
  async index({ request, response }: HttpContext) {
    const pdfId = request.input('pdf_id')
    const pdf = await Pdf.find(pdfId)
    if (!pdf) {
      return response.status(404).json({ error: 'Pdf not found' })
    }

    // await pdf.load();
    return pdf.toJSON().conversations
  }

  async createConversation({ auth, request, response }: HttpContext) {
    const pdfId = request.input('pdf_id')
    const pdf = await Pdf.find(pdfId)
    if (!pdf) {
      return response.status(404).json({ error: 'Pdf not found' })
    }

    const user = auth.user
    const conversation = await Conversation.create({ userId: user?.id, pdfId: pdf.id })

    return conversation.toJSON()
  }

  async createMessage({ request, response, params }: HttpContext) {
    const conversationId = params.conversation_id
    const conversation = await Conversation.find(conversationId)
    if (!conversation) {
      return response.status(404).json({ error: 'Conversation not found' })
    }

    const { input } = request.input('input')
    const streaming = request.input('stream', false)

    const pdf = await Pdf.find(conversation.pdfId)
    console.log('pdf', pdf)
    console.log('input', input)

    // const chatArgs = new ChatArgs()
    // chatArgs.conversation_id = conversation.id
    // chatArgs.pdf_id = pdf.id
    // chatArgs.streaming = streaming
    // chatArgs.metadata = {
    //   conversation_id: conversation.id,
    //   user_id: auth.user.id,
    //   pdf_id: pdf.id
    // }
    //
    // const chat = buildChat(chatArgs)
    //
    // if (!chat) {
    //   return 'Chat not yet implemented!'
    // }
    //
    if (streaming) {
      response.header('Content-Type', 'text/event-stream')
      // response.implicitEnd = false
      // chat.stream(input, (data) => {
      //   response.write(`data: ${data}\n\n`)
      // })
      return
    } else {
      // const content = await chat.run(input)
      // return { role: 'assistant', content }
    }
  }
}

