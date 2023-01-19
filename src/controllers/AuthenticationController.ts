import { PrismaClient } from '@prisma/client'
import AuthenticationService from '../services/AuthenticationService'
import {
  ClassErrorMiddleware,
  Controller,
  Middleware,
  Post,
} from '@overnightjs/core'
import { RequestBody } from '../interfaces/RequestBody'
import { LoginDTO } from '../dtos/LoginDTO'
import { NextFunction, Response } from 'express'
import apiErrorValidator from '../middlewares/apiErrorValidator'
import { LoginSchema } from '../joi/schemas/LoginSchema'
import joiMiddleware from '../middlewares/joiMiddleware'
import { ResponseDTO } from '../classes/dtos/ResponseDTO'
import { StatusCodes } from 'http-status-codes'

@Controller('authentication')
@ClassErrorMiddleware(apiErrorValidator)
export default class AuthenticationController {
  private authenticationService: AuthenticationService

  constructor(database: PrismaClient) {
    this.authenticationService = new AuthenticationService(database)
  }

  @Post('login')
  @Middleware(joiMiddleware(LoginSchema.schema))
  public async login(
    request: RequestBody<LoginDTO>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const token = await this.authenticationService.login(request.body.data)
      response
        .status(200)
        .json(
          new ResponseDTO(StatusCodes.OK, 'Usuário logado com sucesso', token)
        )
    } catch (error) {
      next(error)
    }
  }
}
