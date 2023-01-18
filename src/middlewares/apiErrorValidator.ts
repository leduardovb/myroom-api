import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/ApiError';

export default function apiErrorValidator(error: any, _request: Request, response: Response, _next: NextFunction) {
  const errorCode = error.status || 500;
  response.status(errorCode).send(
    ApiError.format({
      code: errorCode,
      message: error.message,
    })
  );
}
