import { StatusCodes } from 'http-status-codes'

export default class AuthenticationException extends Error {
  public statusCode: StatusCodes

  constructor(statusCode: StatusCodes, message: string) {
    super()
    this.statusCode = statusCode
    this.message = message
  }

  static tokenNotProvided() {
    return new AuthenticationException(
      StatusCodes.UNAUTHORIZED,
      'Token não informado'
    )
  }

  static invalidToken() {
    return new AuthenticationException(
      StatusCodes.UNAUTHORIZED,
      'Token inválido'
    )
  }

  static invalidTokenFormat() {
    return new AuthenticationException(
      StatusCodes.UNAUTHORIZED,
      'Formato do token inválido'
    )
  }

  static headersNotProvided() {
    return new AuthenticationException(
      StatusCodes.UNAUTHORIZED,
      'Cabeçalho não informado'
    )
  }
}
