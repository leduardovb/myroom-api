import { Server } from '@overnightjs/core'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import http from 'http'
import { PrismaClient } from '@prisma/client'
import UserController from './controllers/UserController'
import AuthenticationController from './controllers/AuthenticationController'
import NotificationsController from './controllers/NotificationsController'
import FirebaseService from './services/FirebaseService'
import RentPlaceController from './controllers/RentPlaceController'
import RentPlaceService from './services/RentPlaceService'
import ViaCepService from './services/ViaCepService'
import NotificationsService from './services/NotificationsService'
import AuthenticationService from './services/AuthenticationService'
import UserService from './services/UserService'
import { SocketIo } from './socket/SocketIo'

export default class SetupServer extends Server {
  public httpServer!: http.Server
  private firebaseService!: FirebaseService
  private socket!: SocketIo

  constructor(private port = 3000, public database = new PrismaClient()) {
    super()
  }

  public async init(): Promise<void> {
    this.startServer()
    this.setupExpress()
    this.setupSocket()
    this.setupFirebase()
    this.setupControllers()
    await this.setupDatabase()
  }

  private setupExpress(): void {
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(
      cors({
        origin: '*',
      })
    )
  }

  private setupControllers(): void {
    this.addControllers([
      new UserController(new UserService(this.database)),
      new AuthenticationController(new AuthenticationService(this.database)),
      new NotificationsController(
        new NotificationsService(this.database, this.socket)
      ),
      new RentPlaceController(
        new RentPlaceService(
          this.database,
          this.firebaseService,
          new ViaCepService()
        )
      ),
    ])
  }

  private setupFirebase(): void {
    this.firebaseService = new FirebaseService().init()
  }

  private setupSocket(): void {
    this.socket = new SocketIo(this.httpServer).init()
  }

  private async setupDatabase(): Promise<void> {
    await this.database.$connect()
  }

  private startServer() {
    this.httpServer = this.app.listen(this.port, () => {
      console.log(`Server listening on: http://localhost:${this.port}`)
    })
  }
}
