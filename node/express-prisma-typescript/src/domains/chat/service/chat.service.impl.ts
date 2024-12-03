import { ChatService } from '@domains/chat/service/chat.service'
import { UserService } from '@domains/user/service'
import { CreateRoomInputDTO, MessageDTO, RoomDTO } from '@domains/chat/dto'
import { validate } from 'class-validator'
import { ChatRepository } from '@domains/chat/repository/chat.repository'
import { ForbiddenException, NotFoundException } from '@utils'
import { FollowerService } from '@domains/follower/service/follower.service'
import { UserViewDTO } from '@domains/user/dto';

export class ChatServiceImpl implements ChatService {
  constructor (
    private readonly repository: ChatRepository,
    private readonly userService: UserService,
    private readonly followerService: FollowerService
  ) {
  }

  async createRoom (userId: string, data: CreateRoomInputDTO): Promise<RoomDTO> {
    await validate(data)
    return await this.repository.createRoom(userId, data)
  }

  async deleteRoom (userId: string, roomId: string): Promise<void> {
    const room = await this.repository.getRoom(roomId)
    if (!room) throw new NotFoundException('post')
    if (room.ownerId !== userId) throw new ForbiddenException()
    await this.repository.deleteRoom(roomId)
  }

  async getMessageHistory (userId: string, roomId: string): Promise<MessageDTO[]> {
    const room = await this.repository.getRoom(roomId)
    if (!room) throw new NotFoundException('post')
    if (!await this.isUserInRoom(userId, roomId)) throw new ForbiddenException()
    return await this.repository.getMessageHistory(roomId)
  }

  async getUserRooms (userId: string): Promise<RoomDTO[]> {
    return await this.repository.getUserRooms(userId)
  }

  async joinUserToRoom (userId: string, targetUserId: string, roomId: string): Promise<void> {
    if (!await this.canChatWith(userId, targetUserId)) throw new ForbiddenException()
    await this.checkIfRoomExists(roomId)
    await this.repository.addUserToRoom(targetUserId, roomId)
  }

  async joinRoom (userId: string, roomId: string): Promise<void> {
    await this.checkIfRoomExists(roomId)
    await this.repository.addUserToRoom(userId, roomId)
  }

  async removeUserFromRoom (userId: string, targetUserId: string, roomId: string): Promise<void> {
    await this.checkIfCanRemoveUserFromRoom(userId, targetUserId, roomId)
    await this.repository.removeUserFromRoom(targetUserId, roomId)
  }

  async leaveRoom (userId: string, roomId: string): Promise<void> {
    await this.repository.removeUserFromRoom(userId, roomId)
  }

  async sendMessage (userId: string, roomId: string, content: string): Promise<MessageDTO> {
    await this.checkIfCanSendMessage(userId, roomId)
    return await this.repository.createMessage(userId, roomId, content)
  }

  async deleteMessage (userId: string, messageId: string): Promise<void> {
    const message = await this.repository.getMessageById(messageId)
    if (!message) throw new NotFoundException('post')
    if (message.senderId !== userId) throw new ForbiddenException()
    await this.repository.deleteMessage(messageId)
  }

  private async isUserInRoom (userId: string, roomId: string): Promise<boolean> {
    return await this.repository.isUserInRoom(userId, roomId)
  }

  private async isOwnerOfRoom (userId: string, roomId: string): Promise<boolean> {
    return await this.repository.getOwnerIdOfRoom(roomId) === userId
  }

  private async canChatWith (userId: string, targetUserId: string): Promise<boolean> {
    return !await this.userService.isPrivate(targetUserId) || await this.followerService.isFollowing(userId, targetUserId)
  }

  private async checkIfCanRemoveUserFromRoom (userId: string, targetUserId: string, roomId: string): Promise<void> {
    const targetUser = await this.repository.getUserFromRoom(targetUserId, roomId)
    if (!targetUser) throw new NotFoundException('user in room')
    if (!await this.isOwnerOfRoom(userId, roomId)) throw new ForbiddenException()
  }

  private async checkIfCanSendMessage (userId: string, roomId: string): Promise<void> {
    if (!await this.isUserInRoom(userId, roomId)) throw new ForbiddenException()
  }

  private async checkIfRoomExists (roomId: string): Promise<void> {
    const room = await this.repository.getRoom(roomId)
    if (!room) throw new NotFoundException('room')
  }

  async getRoomParticipants (userId: string, roomId: string): Promise<UserViewDTO[]> {
    const participants = await this.repository.getRoomParticipants(roomId)
    const isUserInRoom = participants.some(participant => participant.id === userId);
    if (!isUserInRoom) throw new ForbiddenException()
    return participants
  }
}
