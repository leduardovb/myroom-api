import { NextFunction, Request, Response } from 'express';
import DomainException from '../exceptions/DomainException';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi'

export default function apiErrorValidator(error: any, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof DomainException) {
    const errorCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    response.status(errorCode).send(
      {
        message: error.message,
        code: errorCode,
      }
    );
  } else if (error instanceof Joi.ValidationError) {
    const firstField = error.details[0].context?.label;
    const message = firstField ? `O campo ${firstField} é inválido` : 'Dados inválidos';
    response.status(400).send(
      {
        message: message,
        code: 400,
      }
    );
  } else {
    response.status(500).send(
      {
        message: error.message,
        code: 500,
      }
    );
  }
}
