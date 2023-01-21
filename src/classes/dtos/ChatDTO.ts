export default class ChatDTO {
  username?: string
  lastMessage?: string

  constructor(username: string, lastMessage: string) {
    if (username !== undefined) this.username = username
    if (lastMessage !== undefined) this.lastMessage = lastMessage
  }
}
