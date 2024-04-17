import { BaseModel, CamelCaseNamingStrategy } from '@adonisjs/lucid/orm'
BaseModel.namingStrategy = new CamelCaseNamingStrategy()
