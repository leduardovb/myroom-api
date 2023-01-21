import { PrismaClient } from '@prisma/client'
import ChatDTO from '../classes/dtos/ChatDTO'

export default class NotificationsService {
  constructor(private database: PrismaClient) {}

  public async listUserChats(userId: number) {
    const chatDTOs = new Array<ChatDTO>()
    const userChats = await this.database.userChats.findMany({
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
      const username =
        userChat.senderId === userId
          ? userChat.userChatRecipient.name
          : userChat.userChatSender.name
      chatDTOs.push(new ChatDTO(username, userChat.lastMessage))
    })
    return chatDTOs
  }
}
