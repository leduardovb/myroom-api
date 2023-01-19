import Joi from 'joi'
import { DefaultSchema } from './DefaultSchema'
import moment from 'moment'

export class CreateUserSchema extends DefaultSchema {
  static maxDate = moment().subtract(16, 'years').toDate()

  static schema = this.dataSchema(
    Joi.object({
      name: this.username.required(),
      phone: this.phone,
      document: this.document.required(),
      birthDate: this.date.less(this.maxDate).required(),
      gender: this.gender.required(),
      email: this.email.required(),
      password: this.password.required(),
    }).required()
  )
}
