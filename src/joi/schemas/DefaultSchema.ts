import Joi from 'joi'
import { isValidCPF, isValidPhone } from '../../helpers/functions'
import moment from 'moment'

export class DefaultSchema {
  static regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  static minDate = moment().subtract(100, 'years').toDate()

  static username = Joi.string().min(5).max(60)
  static phone = Joi.string()
    .length(11)
    .custom(
      (value, helpers) =>
        isValidPhone(value) || helpers.message({ phone: 'Telefone inválido' })
    )
  static date = Joi.date().greater(this.minDate).iso()
  static gender = Joi.string().valid('M', 'F')
  static document = Joi.string()
    .length(11)
    .custom(
      (value, helpers) =>
        isValidCPF(value) || helpers.message({ document: 'Documento inválido' })
    )
  static password = Joi.string().min(8).max(30)
  static email = Joi.string().email()

  public static dataSchema = (object: Joi.ObjectSchema<any>) =>
    Joi.object({
      data: object,
    }).required()
}
