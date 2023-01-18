import { PrismaClient } from '@prisma/client';
import AuthenticationService from '../services/AuthenticationService';
import { Controller, Post } from '@overnightjs/core';
import { RequestBody } from '../interfaces/RequestBody';
import { LoginDTO } from '../dtos/LoginDTO';

@Controller('authentication')
export default class AuthenticationController {
  private authenticationService: AuthenticationService;

  constructor(database: PrismaClient) {
    this.authenticationService = new AuthenticationService(database);
  }

  @Post('login')
  public async login(request: RequestBody<LoginDTO>, response: Response) {
    await this.authenticationService.login(request.body.data);
  }
}
