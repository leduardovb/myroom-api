import { Controller, Get, Post } from '@overnightjs/core';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

@Controller('users')
export default class UserController {
  constructor(database: PrismaClient) {}

  @Post('')
  public async create(request: Request, response: Response) {}

  @Get('')
  public async single(request: Request, response: Response) {
    response.json({ message: 'Hello World' });
  }
}
