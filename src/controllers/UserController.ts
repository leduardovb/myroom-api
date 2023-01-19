import {
  ClassErrorMiddleware,
  Controller,
  Middleware,
  Post,
} from '@overnightjs/core'
import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { RequestBody } from '../interfaces/RequestBody'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import { CreateUserSchema } from '../joi/schemas/CreateUserSchema'
import apiErrorValidator from '../middlewares/apiErrorValidator'
import joiMiddleware from '../middlewares/joiMiddleware'
import UserService from '../services/UserService'
import { ResponseDTO } from '../classes/dtos/ResponseDTO'
import { StatusCodes } from 'http-status-codes'

@Controller('users')
@ClassErrorMiddleware(apiErrorValidator)
export default class UserController {
  constructor(database: PrismaClient, private userService: UserService) {
    this.userService = new UserService(database)
  }

  @Post('')
  @Middleware(joiMiddleware(CreateUserSchema.schema))
  public async create(
    request: RequestBody<CreateUserDTO>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const user = await this.userService.create(request.body.data)
      response
        .status(200)
        .json(
          new ResponseDTO(StatusCodes.OK, 'Usuário criado com sucesso', user)
        )
    } catch (error) {
      next(error)
    }
  }
}
