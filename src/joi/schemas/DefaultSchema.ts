import Joi from 'joi';
import { isValidCPF } from '../../helpers/functions';

export class DefaultSchema {
  static username = Joi.string().min(5).max(60);
  static phone = Joi.string().length(11);
  static document = Joi.string()
    .length(11)
    .custom((value, helpers) =>
      !isValidCPF(value)
        ? helpers.message({ document: 'Documento inválido' })
        : true
    );
  static password = Joi.string().min(8).max(30);
  static email = Joi.string().regex(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  public static dataSchema = (object: Joi.ObjectSchema<any>) =>
    Joi.object({
      data: object,
    }).required();
}
