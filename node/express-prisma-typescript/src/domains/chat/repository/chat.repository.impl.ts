import { ChatRepository } from '@domains/chat/repository/chat.repository'
import { CreateRoomInputDTO, MessageDTO, RoomDTO } from '@domains/chat/dto'
import { UserDTO } from '@domains/user/dto'
import { PrismaClient } from '@prisma/client'
import { Logger } from '@utils'

export class ChatRepositoryImpl implements ChatRepository {
  constructor (private readonly db: PrismaClient) {}

  async addUserToRoom (userId: string, roomId: string): Promise<void> {
    await this.db.userRoom.create({
      data: {
        userId,
        roomId
      }
    })
  }

  async createMessage (senderId: string, roomId: string, content: string): Promise<MessageDTO> {
    const message = await this.db.messages.create({
      data: {
        content,
        roomId,
        senderId
      }
    })
    return new MessageDTO(message)
  }

  async createRoom (userId: string, data: CreateRoomInputDTO): Promise<RoomDTO> {
    const room = await this.db.room.create({
      data: {
        ownerId: userId,
        ...data
      }
    })
    return new RoomDTO(room)
  }

  async deleteMessage (messageId: string): Promise<void> {
    await this.db.messages.delete({
      where: {
        id: messageId
      }
    })
  }

  async deleteRoom (roomId: string): Promise<void> {
    await this.db.room.delete({
      where: {
        id: roomId
      }
    })
  }

  async getMessageById (messageId: string): Promise<MessageDTO | null> {
    const message = await this.db.messages.findUnique({
      where: {
        id: messageId
      }
    })
    return message ? new MessageDTO(message) : null
  }

  async getMessageHistory (roomId: string): Promise<MessageDTO[]> {
    const messages = await this.db.messages.findMany({
      where: {
        roomId
      }
    })
    return messages.map(message => new MessageDTO(message))
  }

  async getOwnerIdOfRoom (roomId: string): Promise<string | null> {
    const room = await this.db.room.findUnique({
      where: {
        id: roomId
      }
    })
    return room?.ownerId ?? null
  }

  async getRoom (roomId: string): Promise<RoomDTO | null> {
    const room = await this.db.room.findUnique({
      where: {
        id: roomId
      }
    })
    return room ? new RoomDTO(room) : null
  }

  async getUserFromRoom (userId: string, roomId: string): Promise<UserDTO | null> {
    const userRoom = await this.db.userRoom.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      },
      include: {
        user: true
      }
    })
    return userRoom ? new UserDTO(userRoom.user) : null
  }

  async getUserRooms (userId: string): Promise<RoomDTO[]> {
    const rooms = await this.db.room.findMany({
      where: {
        participants: {
          some: {
            userId
          }
        }
      }
    })
    return rooms.map(room => new RoomDTO(room))
  }

  async isUserInRoom (userId: string, roomId: string): Promise<boolean> {
    const userRoom = await this.db.userRoom.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    })
    return !!userRoom
  }

  async removeUserFromRoom (userId: string, roomId: string): Promise<void> {
    await this.db.userRoom.delete({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    })
  }
}
