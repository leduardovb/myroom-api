import { UserMessage } from '@prisma/client'
import UserMessageDTO from '../dtos/UserMessageDTO'

export default class UserMessageEntity {
  public id!: number
  public senderId!: number
  public recipientId!: number
  public message!: string
  public createdAt!: Date

  constructor(
    id?: number,
    senderId?: number,
    recipientId?: number,
    message?: string,
    createdAt?: Date
  ) {
    if (id !== undefined) this.id = id
    if (senderId !== undefined) this.senderId = senderId
    if (recipientId !== undefined) this.recipientId = recipientId
    if (message !== undefined) this.message = message
    if (createdAt !== undefined) this.createdAt = createdAt
  }

  public static fromDTO(userMessageDTO: UserMessageDTO) {
    return new UserMessageEntity(
      undefined,
      userMessageDTO.senderId,
      userMessageDTO.recipientId,
      userMessageDTO.message?.trim()
    )
  }

  public static fromEntity(userMessageEntity: UserMessage) {
    return new UserMessageEntity(
      userMessageEntity.id,
      userMessageEntity.senderId,
      userMessageEntity.recipientId,
      userMessageEntity.message,
      userMessageEntity.createdAt
    )
  }
}
