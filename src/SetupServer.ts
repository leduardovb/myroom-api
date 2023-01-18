import { Server } from '@overnightjs/core';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import UserController from './controllers/UserController';
import AuthenticationController from './controllers/AuthenticationController';
import apiErrorValidator from './middlewares/apiErrorValidator';

export default class SetupServer extends Server {
  private server?: http.Server;

  constructor(private port = 3000, private database = new PrismaClient()) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    this.setupErroMiddleware();
    await this.setupDatabase();
  }

  private setupExpress(): void {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private setupControllers(): void {
    this.addControllers([new UserController(this.database), new AuthenticationController(this.database)]);
  }

  private setupErroMiddleware() {
    this.app.use(apiErrorValidator);
  }

  private async setupDatabase(): Promise<void> {
    await this.database.$connect();
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server listening on: http://localhost:${this.port}`);
    });
  }
}
