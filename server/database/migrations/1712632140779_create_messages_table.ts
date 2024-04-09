import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('role').notNullable()
      table.string('content').notNullable()
      table.string('conversationId').notNullable()
      table.timestamp('updateAt')
      table.timestamp('createdAt')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

