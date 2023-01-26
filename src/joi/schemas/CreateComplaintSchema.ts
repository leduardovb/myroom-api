import Joi from 'joi'
import { DefaultSchema } from './DefaultSchema'
import { ComplaintType } from '../../helpers/enums'

export default class CreateComplaintSchema extends DefaultSchema {
  static schema = this.dataSchema(
    Joi.object({
      type: Joi.string()
        .required()
        .valid(
          ComplaintType.DUPLICATED,
          ComplaintType.GOLPE,
          ComplaintType.INCORRET,
          ComplaintType.UNTRUE
        ),
      description: Joi.string().trim().required().min(4).max(300),
      rentPlaceId: Joi.number().required().greater(0),
    }).required()
  )
}
