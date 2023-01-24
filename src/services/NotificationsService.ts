import { PrismaClient } from '@prisma/client'
import ChatDTO from '../classes/dtos/ChatDTO'
import UserMessageDTO from '../dtos/UserMessageDTO'

export default class NotificationsService {
  constructor(private database: PrismaClient) {}

  public async listUserChats(userId: number) {
    const chatDTOs = new Array<ChatDTO>()
    const userChats = await this.database.userChat.findMany({
      include: {
        userChatSender: true,
        userChatRecipient: true,
      },
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            recipientId: userId,
          },
        ],
      },
    })

    userChats.forEach((userChat) => {
      const user =
        userChat.senderId === userId
          ? userChat.userChatRecipient
          : userChat.userChatSender
      chatDTOs.push(new ChatDTO(user.id, user.name, userChat.lastMessage))
    })
    return chatDTOs
  }

  public async saveMessage(userMessageDTO: UserMessageDTO) {
    const senderExists =
      this.database.user.findFirst({
        where: { id: userMessageDTO.senderId },
      }) !== null
    const recipientExists =
      this.database.user.findFirst({
        where: { id: userMessageDTO.recipientId },
      }) !== null

    if (senderExists && recipientExists) {
      const userMessageEntity = await this.database.userMessage.create({
        data: userMessageDTO,
      })
      console.debug(`Mensagem salva com sucesso`)
      return userMessageEntity
    }
    return null
  }
}
