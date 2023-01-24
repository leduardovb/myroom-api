import { PrismaClient } from '@prisma/client'
import ChatDTO from '../classes/dtos/ChatDTO'
import NewMessageDTO from '../dtos/NewMessageDTO'
import UserMessageDTO from '../classes/dtos/UserMessageDTO'
import UserMessageEntity from '../classes/entities/UserMessageEntity'
import { SocketIo } from '../socket/SocketIo'

export default class NotificationsService {
  constructor(private database: PrismaClient, private socket: SocketIo) {}

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

  public async saveMessage(newMessageDTO: NewMessageDTO) {
    const senderExists =
      this.database.user.findFirst({
        where: { id: newMessageDTO.senderId },
      }) !== null
    const recipientExists =
      this.database.user.findFirst({
        where: { id: newMessageDTO.recipientId },
      }) !== null

    if (senderExists && recipientExists) {
      const userMessageEntity = await this.database.userMessage.create({
        data: UserMessageEntity.fromDTO(newMessageDTO),
      })
      console.debug(`Mensagem salva com sucesso`)

      this.socket.sendMessageToRoom(
        UserMessageDTO.fromEntity(userMessageEntity)
      )
      return userMessageEntity
    }
    return null
  }

  public async listUserMessages(userId: number, recipientId: number) {
    console.debug(`Listando mensagens do usuário ${userId}`)
    const userMessages = await this.database.userMessage.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                senderId: userId,
              },
              {
                recipientId: recipientId,
              },
            ],
          },
          {
            AND: [
              {
                senderId: recipientId,
              },
              {
                recipientId: userId,
              },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    return userMessages.map((userMessage) =>
      UserMessageDTO.fromEntity(userMessage)
    )
  }
}
