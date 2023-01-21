import SocketUserDTO from './SocketUserDTO'

export default class RoomDTO {
  public name: string
  public connectedUsers: Array<SocketUserDTO>

  constructor(name: string, connectedUsers: Array<SocketUserDTO>) {
    this.name = name
    this.connectedUsers = connectedUsers
  }
}
