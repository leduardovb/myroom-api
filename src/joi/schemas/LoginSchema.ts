import * as Joi from "joi";
import { DefaultSchema } from "./DefaultSchema";

export class LoginSchema extends DefaultSchema {
  static schema = this.dataSchema(
    Joi.object({
      email: this.email.required(),
      password: this.password.required(),
    })
  );
}
