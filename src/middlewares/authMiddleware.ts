import { NextFunction, Request, Response } from 'express';
import AuthenticationService from '../services/AuthenticationService';

export default function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const token = request.headers.authorization;
  try {
    if (!token) throw new Error('jwt must be provided');
    const decoded = AuthenticationService.decodeToken(token.replace(/^Bearer /, ''));
    const newRequest = request as any;
    newRequest.payload = {
      id: decoded.id,
    };
    next();
  } catch (err: any) {
    response.status(401).send({ code: 401, error: err.message });
  }
}