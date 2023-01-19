import Joi from 'joi';
import { DefaultSchema } from './DefaultSchema';

export class CreateUserSchema extends DefaultSchema {
  static schema = this.dataSchema(
    Joi.object({
      name: this.username.required(),
      phone: this.phone,
      document: this.document.required(),
      email: this.email.required(),
      password: this.password.required(),
    }).required()
  );
}
