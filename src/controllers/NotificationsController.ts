import NotificationsService from '../services/NotificationsService'
import {
  ClassErrorMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
} from '@overnightjs/core'
import jwtMiddleware from '../middlewares/jwtMiddleware'
import { NextFunction, Request, Response } from 'express'
import { RequestBody, RequestPayload } from '../interfaces/RequestBody'
import apiErrorValidator from '../middlewares/apiErrorValidator'
import { StatusCodes } from 'http-status-codes'
import { ResponseDTO } from '../classes/dtos/ResponseDTO'
import NewMessageDTO from '../dtos/NewMessageDTO'
import joiMiddleware from '../middlewares/joiMiddleware'
import SaveMessageSchema from '../joi/schemas/SaveMessageSchema'
import DomainException from '../exceptions/DomainException'

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

  @Get('user-messages/:recipientId')
  @Middleware(jwtMiddleware)
  public async listUserMessages(
    request: RequestPayload,
    response: Response,
    next: NextFunction
  ) {
    try {
      if (!request.params.recipientId)
        throw DomainException.invalidState('recipientId não informado')
      if (isNaN(Number(request.params.recipientId)))
        throw DomainException.invalidState('recipientId inválido')
      const userMessageDTOs = await this.notificationsService.listUserMessages(
        request.payload!.userId,
        Number(request.params.recipientId)
      )
      response
        .status(StatusCodes.OK)
        .json(
          new ResponseDTO(
            StatusCodes.OK,
            'Mensagens listadas com sucesso',
            userMessageDTOs
          )
        )
    } catch (error) {
      next(error)
    }
  }

  @Post('save-message')
  @Middleware([jwtMiddleware, joiMiddleware(SaveMessageSchema.schema)])
  public async saveMessage(
    request: RequestBody<NewMessageDTO>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const savedMessage = await this.notificationsService.saveMessage(
        request.body.data
      )
      response
        .status(StatusCodes.OK)
        .json(
          new ResponseDTO(
            StatusCodes.OK,
            'Mensagem salva com sucesso',
            savedMessage
          )
        )
    } catch (error) {
      next(error)
    }
  }
}
