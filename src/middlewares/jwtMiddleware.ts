import { NextFunction, Request, Response } from 'express'
import { decodeToken } from '../helpers/functions'
import AuthenticationException from '../exceptions/AuthenticationException'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

export default function jwtMiddleware(
  request: Request,
  _: Response,
  next: NextFunction
) {
  try {
    if (!request.headers) throw AuthenticationException.headersNotProvided()

    const token = request.headers.authorization
    if (!token) throw AuthenticationException.tokenNotProvided()

    if (!token.startsWith('Bearer '))
      throw AuthenticationException.invalidTokenFormat()

    jwt.decode(token.replace(/^Bearer /, ''))

    const decoded = decodeToken(token.replace(/^Bearer /, ''))

    if (decoded) {
      const newRequest = request as any
      newRequest.payload = {
        id: decoded.userId,
      }
    } else throw AuthenticationException.invalidToken()
    next()
  } catch (error: any) {
    next(error)
  }
}
