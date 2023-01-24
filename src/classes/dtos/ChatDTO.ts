export default class ChatDTO {
  userId?: number
  username?: string
  lastMessage?: string

  constructor(userId: number, username: string, lastMessage: string) {
    if (userId !== undefined) this.userId = userId
    if (username !== undefined) this.username = username
    if (lastMessage !== undefined) this.lastMessage = lastMessage
  }
}
