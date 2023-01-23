import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

export default function joiPaginateMiddleware(schema: Schema<any>) {
  return async (request: Request, _: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(request.query)
      if (!request.query.page) request.query.page = '1'
      if (!request.query.limit) request.query.limit = '10'
      next()
    } catch (error) {
      next(error)
    }
  }
}
