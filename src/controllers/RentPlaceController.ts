import RentPlaceService from '../services/RentPlaceService'
import { NextFunction, Response } from 'express'
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
import FirebaseService from '../services/FirebaseService'
import CreateRentPlaceSchema from '../joi/schemas/CreateRentPlaceSchema'
import { RequestBody, RequestPaginated } from '../interfaces/RequestBody'
import { CreateRentPlaceDTO } from '../dtos/CreateRentPlaceDTO'
import { ResponseDTO } from '../classes/dtos/ResponseDTO'
import { StatusCodes } from 'http-status-codes'
import joiPaginateMiddleware from '../middlewares/joiPaginateMiddleware'
import PaginationSchema from '../joi/schemas/PaginationSchema'

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
}
