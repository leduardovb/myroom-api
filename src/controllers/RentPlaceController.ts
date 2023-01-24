import RentPlaceService from '../services/RentPlaceService'
import { NextFunction, Request, Response } from 'express'
import {
  ClassErrorMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
} from '@overnightjs/core'
import apiErrorValidator from '../middlewares/apiErrorValidator'
import jwtMiddleware from '../middlewares/jwtMiddleware'
import joiMiddleware from '../middlewares/joiMiddleware'
import CreateRentPlaceSchema from '../joi/schemas/CreateRentPlaceSchema'
import {
  RequestBody,
  RequestPaginated,
  RequestPayload,
} from '../interfaces/RequestBody'
import { CreateRentPlaceDTO } from '../dtos/CreateRentPlaceDTO'
import { ResponseDTO } from '../classes/dtos/ResponseDTO'
import { StatusCodes } from 'http-status-codes'
import joiPaginateMiddleware from '../middlewares/joiPaginateMiddleware'
import PaginationSchema from '../joi/schemas/PaginationSchema'
import DomainException from '../exceptions/DomainException'

@Controller('rent-place')
@ClassErrorMiddleware(apiErrorValidator)
export default class RentPlaceController {
  constructor(private rentPlaceService: RentPlaceService) {}

  @Post()
  @Middleware([jwtMiddleware, joiMiddleware(CreateRentPlaceSchema.schema)])
  public async create(
    request: RequestBody<CreateRentPlaceDTO>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const rentPlace = await this.rentPlaceService.create(
        request.payload!,
        request.body.data!
      )
      response
        .status(200)
        .json(
          new ResponseDTO(
            StatusCodes.OK,
            'Apartamento criado com sucesso',
            rentPlace
          )
        )
    } catch (error) {
      next(error)
    }
  }

  @Get('list')
  @Middleware(joiPaginateMiddleware(PaginationSchema.schema))
  public async list(
    request: RequestPaginated,
    response: Response,
    next: NextFunction
  ) {
    try {
      const rentPlaces = await this.rentPlaceService.list(request.query)
      response
        .status(StatusCodes.OK)
        .json(
          new ResponseDTO(StatusCodes.OK, 'Apartamentos listados', rentPlaces)
        )
    } catch (error) {
      next(error)
    }
  }

  @Get('single/:id')
  public async single(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      if (!request.params.id)
        throw DomainException.invalidState('ID do imóvel não informado')

      if (isNaN(Number(request.params.id)))
        throw DomainException.invalidState('ID do imóvel inválido')

      const rentPlace = await this.rentPlaceService.single(
        Number(request.params.id)
      )
      response
        .status(StatusCodes.OK)
        .json(new ResponseDTO(StatusCodes.OK, 'Apartamento listado', rentPlace))
    } catch (error) {
      next(error)
    }
  }

  @Get('is-favorite/:id')
  @Middleware(jwtMiddleware)
  public async isFavorite(
    request: RequestPayload,
    response: Response,
    next: NextFunction
  ) {
    try {
      if (!request.params.id)
        throw DomainException.invalidState('ID do imóvel não informado')

      if (isNaN(Number(request.params.id)))
        throw DomainException.invalidState('ID do imóvel inválido')

      const isFavorite = await this.rentPlaceService.isFavorite(
        Number(request.params.id),
        request.payload!.userId
      )
      response
        .status(StatusCodes.OK)
        .json(new ResponseDTO(StatusCodes.OK, '', isFavorite))
    } catch (error) {
      next(error)
    }
  }
}
