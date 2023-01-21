import { Server, Socket } from 'socket.io'
import { IncomingMessage, ServerResponse, Server as HtppServer } from 'http'
import { SocketNamespace } from '../helpers/enums'
import { ExtendedError } from 'socket.io/dist/namespace'
import AuthenticationException from '../exceptions/AuthenticationException'
import { decodeToken } from '../helpers/functions'
import SocketUserDTO from '../dtos/SocketUserDTO'
import { ChatNamespace } from './ChatNamespace'

export class SocketIo extends Server {
  private connectedUserDTOs: Array<SocketUserDTO>

  constructor(
    httpServer: HtppServer<typeof IncomingMessage, typeof ServerResponse>
  ) {
    super(httpServer, {
      cors: {
        origin: '*',
        allowedHeaders: ['authorization'],
      },
    })
    this.connectedUserDTOs = new Array<SocketUserDTO>()
  }

  public init(): void {
    this.startListening()
    this.socketMiddleware()
  }

  private socketMiddleware() {
    this.use(validateJwt)
  }

  private startListening() {
    this.on(SocketNamespace.CONNECTION, (socket) => {
      this.handleConnection(socket)
      this.handleDisconnect(socket)
    })
  }

  private handleConnection(client: Socket) {
    const isAlreadyConnected = this.connectedUserDTOs.some(
      (userDTO) => userDTO.userId === client.data.userId
    )
    if (!isAlreadyConnected) {
      const userDTO = new SocketUserDTO(client.data.userId, client.id)
      this.connectedUserDTOs.push(userDTO)
    } else client.disconnect(true)
  }

  private handleDisconnect(client: Socket) {
    client.on(SocketNamespace.DISCONNECT, () => {
      this.connectedUserDTOs = this.connectedUserDTOs.filter(
        (userDTO) => userDTO.socketId !== client.id
      )
    })
  }
}

const validateJwt = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    if (socket.handshake.headers === undefined)
      throw AuthenticationException.headersNotProvided()

    const token = socket.handshake.headers['authorization']
    if (!token) throw AuthenticationException.tokenNotProvided()

    if (!token.startsWith('Bearer '))
      throw AuthenticationException.invalidTokenFormat()

    const decoded = decodeToken(token.replace(/^Bearer /, ''))
    if (decoded)
      socket.data = { userId: decoded.payload.userId, socketId: socket.id }
    else throw AuthenticationException.invalidToken()
    next()
  } catch (error) {
    next(error as AuthenticationException)
  }
}
