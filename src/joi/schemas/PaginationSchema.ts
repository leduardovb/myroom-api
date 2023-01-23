import Joi from 'joi'

export default class PaginationSchema {
  static schema = Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
  })
}
