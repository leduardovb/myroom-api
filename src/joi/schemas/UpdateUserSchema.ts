import { DefaultSchema } from './DefaultSchema'
import Joi from 'joi'

export default class UpdateUserSchema extends DefaultSchema {
  static schema = this.dataSchema(
    Joi.object({
      id: this.id.required(),
      name: this.username,
      document: this.document,
      gender: this.gender,
      phone: this.phone,
    }).required()
  )
}
