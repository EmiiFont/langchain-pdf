import { BaseModel, CamelCaseNamingStrategy, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Conversation from './conversation.js'

export default class Pdf extends BaseModel {
  static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare userid: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Conversation)
  declare conversation: HasMany<typeof Conversation>

  asDict() {
    return {
      id: this.id,
      name: this.name,
      userId: this.userid,
    }
  }
}
