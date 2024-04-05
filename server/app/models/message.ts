import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Conversation from './conversation.js'
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare role: string

  @column()
  declare content: string

  @column()
  declare conversationId: string

  @belongsTo(() => Conversation)
  declare conversation: BelongsTo<typeof Conversation>

  asDict() {
    return {
      id: this.id,
      role: this.role,
      content: this.content,
    }
  }

  asLCMessage() {
    switch (this.role) {
      case 'human':
        return new HumanMessage(this.content)
      case 'ai':
        return new AIMessage(this.content)
      case 'system':
        return new SystemMessage(this.content)
      default:
        throw new Error('Invalid role')
    }
  }
}
