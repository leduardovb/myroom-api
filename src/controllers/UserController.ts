import {
  ClassErrorMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
  Put,
} from '@overnightjs/core'
import { NextFunction, Response } from 'express'
import { RequestBody, RequestPayload } from '../interfaces/RequestBody'
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
import { UserFavoriteDTO } from '../dtos/UserFavoriteDTO'

@Controller('users')
@ClassErrorMiddleware(apiErrorValidator)
export default class UserController {
  constructor(private userService: UserService) {}

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
    request: RequestPayload,
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

  @Post('favorites')
  @Middleware(jwtMiddleware)
  public async handleFavorite(
    request: RequestBody<UserFavoriteDTO>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const rentPlaceId = request.body?.data?.rentPlaceId
      if (!rentPlaceId) throw new Error('O id do imóvel é obrigatório')
      if (typeof rentPlaceId !== 'number')
        throw new Error('O id do imóvel deve ser um número')

      const responseDTO = await this.userService.handleFavorite(
        request.payload!,
        request.body.data.rentPlaceId
      )
      response.status(StatusCodes.OK).json(responseDTO)
    } catch (error) {
      next(error)
    }
  }

  @Get('favorites')
  @Middleware(jwtMiddleware)
  public async listFavorites(
    request: RequestPayload,
    response: Response,
    next: NextFunction
  ) {
    try {
      const favorites = await this.userService.listFavorites(
        request.payload!.userId
      )
      response
        .status(200)
        .json(
          new ResponseDTO(
            StatusCodes.OK,
            'Imóveis favoritos listados com sucesso',
            favorites
          )
        )
    } catch (error) {
      next(error)
    }
  }
}
