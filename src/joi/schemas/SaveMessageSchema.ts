import Joi from 'joi'
import { DefaultSchema } from './DefaultSchema'

export default class SaveMessageSchema extends DefaultSchema {
  public static schema = this.dataSchema(
    Joi.object({
      senderId: Joi.number().required(),
      recipientId: Joi.number().required(),
      message: Joi.string().max(255).trim().min(1).required(),
    }).required()
  )
}
