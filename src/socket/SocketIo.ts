import { Server, Socket } from 'socket.io'
import { IncomingMessage, ServerResponse, Server as HtppServer } from 'http'
import { SocketNamespace } from '../helpers/enums'
import { ExtendedError } from 'socket.io/dist/namespace'
import AuthenticationException from '../exceptions/AuthenticationException'
import { decodeToken } from '../helpers/functions'
import SocketUserDTO from '../dtos/SocketUserDTO'
import { ChatRoom } from '../interfaces/ChatRoom'
import RoomDTO from '../dtos/RoomDTO'
import UserMessageDTO from '../classes/dtos/UserMessageDTO'

export class SocketIo extends Server {
  private connectedUserDTOs: Array<SocketUserDTO>
  private rooms: Array<RoomDTO>

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
    this.rooms = new Array<RoomDTO>()
  }

  public init() {
    this.startListening()
    this.socketMiddleware()
    return this
  }

  private socketMiddleware() {
    this.use(validateJwt)
  }

  private startListening() {
    this.on(SocketNamespace.CONNECTION, (socket) => {
      this.handleConnection(socket)
      this.handleDisconnect(socket)
      this.handleCreateChatRoom(socket)
    })
  }

  private handleConnection(client: Socket) {
    const isAlreadyConnected = this.connectedUserDTOs.some(
      (userDTO) => userDTO.userId === client.data.userId
    )
    console.debug(`Usuário ${client.data.userId} tentando conectar`)

    if (!isAlreadyConnected) {
      console.debug(`Usuário ${client.data.userId} conectado`)
      const userDTO = new SocketUserDTO(Number(client.data.userId), client)
      this.connectedUserDTOs.push(userDTO)
    } else {
      console.debug(`Usuário ${client.data.userId} já conectado`)
    }
  }

  private handleDisconnect(client: Socket) {
    client.on(SocketNamespace.DISCONNECT, () => {
      this.connectedUserDTOs = this.connectedUserDTOs.filter(
        (userDTO) => userDTO.socket.id !== client.id
      )
    })
  }

  private handleCreateChatRoom(client: Socket) {
    client.on(SocketNamespace.CONNECT_ROOM, (data: ChatRoom) => {
      console.debug('Criando sala de chat')
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
          }
        }
      }
    })
  }

  public sendMessageToRoom(userMessageDTO: UserMessageDTO) {
    const connectedUser = this.connectedUserDTOs.find(
      (userDTO) => userDTO.userId === userMessageDTO.senderId!
    )

    if (!connectedUser) return
    const roomName = this.getRoomName(connectedUser.socket, {
      recipientId: userMessageDTO.recipientId!,
    })
    if (!roomName) return
    if (!connectedUser.socket.rooms.has(roomName)) return

    console.debug(`Usuário ${userMessageDTO.senderId} enviou mensagem`)

    connectedUser.socket.to(roomName).emit(SocketNamespace.MESSAGE_FROM_ROOM, {
      senderId: userMessageDTO.senderId,
      recipientId: userMessageDTO.recipientId,
      message: userMessageDTO.message,
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
