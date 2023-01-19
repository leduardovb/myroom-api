import { ClassErrorMiddleware, Controller, Get, Post } from '@overnightjs/core';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { RequestBody } from '../interfaces/RequestBody';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { CreateUserSchema } from '../joi/schemas/CreateUserSchema';
import apiErrorValidator from '../middlewares/apiErrorValidator';

@Controller('users')
@ClassErrorMiddleware(apiErrorValidator)
export default class UserController {
  constructor(database: PrismaClient) {}

  @Post('')
  public async create(
    request: RequestBody<CreateUserDTO>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const teste = await CreateUserSchema.schema.validateAsync(request.body);
      console.log(request.body);
      response.json({ message: 'Hello World' });
    } catch (error) {
      next(error);
    }
  }

  @Get('')
  public async single(request: Request, response: Response) {
    response.json({ message: 'Hello World' });
  }
}
