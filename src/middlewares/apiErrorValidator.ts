import { NextFunction, Request, Response } from 'express'
import DomainException from '../exceptions/DomainException'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { JsonWebTokenError } from 'jsonwebtoken'
import AuthenticationException from '../exceptions/AuthenticationException'

export default function apiErrorValidator(
  error: any,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (
    error instanceof DomainException ||
    error instanceof AuthenticationException
  ) {
    const errorCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    response.status(errorCode).json({
      message: error.message,
      code: errorCode,
    })
  } else if (error instanceof Joi.ValidationError) {
    const firstField = error.details[0].context?.label
    const message = firstField
      ? `O campo ${firstField} é inválido`
      : 'Dados inválidos'
    response.status(400).json({
      message: message,
      code: 400,
    })
  } else if (error instanceof JsonWebTokenError) {
    if (error.message === 'jwt malformed') {
      response.status(401).json({
        message: 'O token não está no formato correto',
        code: 401,
      })
    }
  } else {
    response.status(500).json({
      message: error.message,
      code: 500,
    })
  }
}
