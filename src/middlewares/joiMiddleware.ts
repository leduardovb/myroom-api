import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

export default function joiMiddleware(schema: Schema<any>) {
  return async (request: Request, _: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(request.body)
      next()
    } catch (error) {
      next(error)
    }
  }
}
