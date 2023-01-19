import { StatusCodes } from 'http-status-codes'

export class ResponseDTO<T> {
  public code: StatusCodes
  public message: string
  public data?: any
  public error?: any

  constructor(code: StatusCodes, message: string, data: T, error: any = null) {
    this.code = code
    this.message = message
    this.data = data
    if (error) this.error = error
  }
}
