import UserMessageEntity from '../entities/UserMessageEntity'

export default class UserMessageDTO {
  public senderId?: number
  public recipientId?: number
  public message?: string
  public createdAt?: Date
  constructor(
    senderId?: number,
    recipientId?: number,
    message?: string,
    createdAt?: Date
  ) {
    if (senderId !== undefined) this.senderId = senderId
    if (recipientId !== undefined) this.recipientId = recipientId
    if (message !== undefined) this.message = message
    if (createdAt !== undefined) this.createdAt = createdAt
  }

  public static fromEntity(userMessageEntity: UserMessageEntity) {
    return new UserMessageDTO(
      userMessageEntity.senderId,
      userMessageEntity.recipientId,
      userMessageEntity.message,
      userMessageEntity.createdAt
    )
  }
}
