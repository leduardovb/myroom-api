import {
  ClassErrorMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
  Put,
} from '@overnightjs/core'
import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { RequestBody, RequestPaylad } from '../interfaces/RequestBody'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import { CreateUserSchema } from '../joi/schemas/CreateUserSchema'
import apiErrorValidator from '../middlewares/apiErrorValidator'
import joiMiddleware from '../middlewares/joiMiddleware'
import UserService from '../services/UserService'
import { ResponseDTO } from '../classes/dtos/ResponseDTO'
import { StatusCodes } from 'http-status-codes'
import { UpdateUserDTO } from '../dtos/UpdateUserDTO'
import UpdateUserSchema from '../joi/schemas/UpdateUserSchema'
import jwtMiddleware from '../middlewares/jwtMiddleware'

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

  @Put()
  @Middleware([jwtMiddleware, joiMiddleware(UpdateUserSchema.schema)])
  public async update(
    request: RequestBody<UpdateUserDTO>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const user = await this.userService.update(
        request.payload!,
        request.body.data
      )
      response
        .status(200)
        .json(
          new ResponseDTO(
            StatusCodes.OK,
            'Usuário atualizado com sucesso',
            user
          )
        )
    } catch (error) {
      next(error)
    }
  }

  @Get('me')
  @Middleware(jwtMiddleware)
  public async me(
    request: RequestPaylad,
    response: Response,
    next: NextFunction
  ) {
    try {
      const user = await this.userService.single(request.payload!.userId)
      response
        .status(200)
        .json(
          new ResponseDTO(
            StatusCodes.OK,
            `Dados do usuário listados com sucesso`,
            user
          )
        )
    } catch (error) {
      next(error)
    }
  }
}
