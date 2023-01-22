import NotificationsService from '../services/NotificationsService'
import {
  ClassErrorMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core'
import jwtMiddleware from '../middlewares/jwtMiddleware'
import { NextFunction, Request, Response } from 'express'
import { RequestPayload } from '../interfaces/RequestBody'
import apiErrorValidator from '../middlewares/apiErrorValidator'
import { StatusCodes } from 'http-status-codes'
import { ResponseDTO } from '../classes/dtos/ResponseDTO'

@Controller('notifications')
@ClassErrorMiddleware(apiErrorValidator)
export default class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('user-chats')
  @Middleware(jwtMiddleware)
  public async listUserChats(
    request: RequestPayload,
    response: Response,
    next: NextFunction
  ) {
    const chatDTOs = await this.notificationsService.listUserChats(
      request.payload!.userId
    )
    response
      .status(StatusCodes.OK)
      .json(
        new ResponseDTO(
          StatusCodes.OK,
          'Conversas listadas com sucesso',
          chatDTOs
        )
      )
    try {
    } catch (error) {
      next(error)
    }
  }
}
