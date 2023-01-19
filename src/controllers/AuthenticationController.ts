import { PrismaClient } from '@prisma/client';
import AuthenticationService from '../services/AuthenticationService';
import { ClassErrorMiddleware, Controller, Post } from '@overnightjs/core';
import { RequestBody } from '../interfaces/RequestBody';
import { LoginDTO } from '../dtos/LoginDTO';
import { NextFunction, Response } from 'express';
import apiErrorValidator from '../middlewares/apiErrorValidator';
import { LoginSchema } from '../joi/schemas/LoginSchema';

@Controller('authentication')
@ClassErrorMiddleware(apiErrorValidator)
export default class AuthenticationController {
  private authenticationService: AuthenticationService;

  constructor(database: PrismaClient) {
    this.authenticationService = new AuthenticationService(database);
  }

  @Post('login')
  public async login(
    request: RequestBody<LoginDTO>,
    response: Response,
    next: NextFunction
  ) {
    try {
      await LoginSchema.schema.validateAsync(request.body);
      await this.authenticationService.login(request.body.data);
    } catch (error) {
      next(error);
    }
  }
}
