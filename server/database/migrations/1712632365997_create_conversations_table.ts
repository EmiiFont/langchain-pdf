import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conversations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('retriever').notNullable()
      table.string('memory').notNullable()
      table.string('llm').notNullable()
      table.integer('pdfId').notNullable()
      table.integer('userId').notNullable()
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

