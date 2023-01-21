export default class SocketUserDTO {
  public userId: string
  public socketId: string

  constructor(userId: string, socketId: string) {
    this.userId = userId
    this.socketId = socketId
  }
}
