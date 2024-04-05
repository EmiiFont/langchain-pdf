import Conversation from '#models/conversation'
import type { HttpContext } from '@adonisjs/core/http'

export default class ScoresController {
  async update({ request, params }: HttpContext) {
    const { conversation_id: conversationId } = params
    const conversation = await Conversation.findOrFail(conversationId)

    const { score } = request.only(['score'])

    if (Number.isNaN(score) || score < -1 || score > 1) {
      throw new Error('Score must be a float between -1 and 1')
    }

    console.log('conversation', conversation)
    // await scoreConversation({
    //   conversationId: conversation.id,
    //   score,
    //   llm: conversation.llm,
    //   retriever: conversation.retriever,
    //   memory: conversation.memory,
    // })
    //
    return { message: 'Score updated' }
  }

  async index({ response }: HttpContext) {
    // const scores = await getScores()

    return response.json({})
  }
}

