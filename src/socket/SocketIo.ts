import { Server, Socket } from 'socket.io'
import { IncomingMessage, ServerResponse, Server as HtppServer } from 'http'
import { SocketNamespace } from '../helpers/enums'
import { ExtendedError } from 'socket.io/dist/namespace'
import AuthenticationException from '../exceptions/AuthenticationException'
import { decodeToken } from '../helpers/functions'
import SocketUserDTO from '../dtos/SocketUserDTO'
import { ChatRoom } from '../interfaces/ChatRoom'
import RoomDTO from '../dtos/RoomDTO'
import { Message } from '../interfaces/Message'
import NotificationsService from '../services/NotificationsService'
import { PrismaClient } from '@prisma/client'
import UserMessageDTO from '../dtos/UserMessageDTO'

export class SocketIo extends Server {
  private notificationsService: NotificationsService
  private connectedUserDTOs: Array<SocketUserDTO>
  private rooms: Array<RoomDTO>

  constructor(
    httpServer: HtppServer<typeof IncomingMessage, typeof ServerResponse>,
    database: PrismaClient
  ) {
    super(httpServer, {
      cors: {
        origin: '*',
        allowedHeaders: ['authorization'],
      },
    })
    this.connectedUserDTOs = new Array<SocketUserDTO>()
    this.rooms = new Array<RoomDTO>()
    this.notificationsService = new NotificationsService(database)
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
      this.handleCreateChatRoom(socket)
      this.handleMessageToRoom(socket)
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

  private handleCreateChatRoom(client: Socket) {
    client.on(SocketNamespace.CONNECT_ROOM, (data: ChatRoom) => {
      if (!data?.recipientId) console.debug('Não informado o recipiente')
      else {
        if (data.recipientId !== Number(client.data.userId)) {
          const roomName = this.getRoomName(client, data)
          const isAlreadyCreated = this.rooms.some(
            (room) => room.name === roomName
          )

          if (!isAlreadyCreated) this.rooms.push(new RoomDTO(roomName))

          if (!client.rooms.has(roomName)) {
            console.debug(
              `Usuário ${client.data.userId} conectado na sala: ${roomName}`
            )
            client.join(roomName)
            client.emit(SocketNamespace.CONNECTED_ROOM, roomName)
          }
        }
      }
    })
  }

  private handleMessageToRoom(client: Socket) {
    client.on(SocketNamespace.MESSAGE_TO_ROOM, async (data: Message) => {
      const room = this.rooms.find((room) => room.name === data?.roomName)
      if (room && data?.message?.trim()) {
        const userId = client.data.userId
        const isMemberOfRoom =
          room.name.includes(userId.toString()) && client.rooms.has(room.name)
        if (isMemberOfRoom) {
          const users = room.name.split('-')
          const recipientId = users.find((user) => user !== String(userId))
          const messageEntity = await this.notificationsService.saveMessage(
            new UserMessageDTO(userId, Number(recipientId), data.message)
          )
          if (messageEntity) {
            console.debug(
              `Usuário ${userId} mandando mensagem para sala ${room.name}`
            )
            client.to(room.name).emit(SocketNamespace.MESSAGE_TO_ROOM, {
              senderId: userId,
              message: data.message.trim(),
            })
          }
        }
      }
    })
  }

  private getRoomName(client: Socket, data: ChatRoom) {
    const firstId =
      client.data.userId < data.recipientId
        ? client.data.userId
        : data.recipientId
    const secondId =
      client.data.userId > data.recipientId
        ? client.data.userId
        : data.recipientId
    return `${firstId}-${secondId}`
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
