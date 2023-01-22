export default class UserMessageDTO {
  public senderId: number
  public recipientId: number
  public message: string

  constructor(senderId: number, recipientId: number, message: string) {
    this.senderId = senderId
    this.recipientId = recipientId
    this.message = message
  }
}
