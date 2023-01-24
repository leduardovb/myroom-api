import { Socket } from 'socket.io'

export default class SocketUserDTO {
  public userId: number
  public socket: Socket

  constructor(userId: number, socket: Socket) {
    this.userId = userId
    this.socket = socket
  }
}
