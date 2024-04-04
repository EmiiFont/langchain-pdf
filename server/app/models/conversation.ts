import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Pdf from './pdf.js'
import Message from './message.js'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare retriever: string

  @column()
  declare memory: string

  @column()
  declare llm: string

  @column()
  declare pdfId: number

  @belongsTo(() => Pdf)
  declare pdf: BelongsTo<typeof Pdf>

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  asDict() {
    return {
      id: this.id,
      pdf_id: this.pdfId,
      messages: this.messages.map((message) => message.asDict()),
    }
  }
}

