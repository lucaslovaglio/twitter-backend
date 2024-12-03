import { CreateRoomInputDTO, MessageDTO, RoomDTO } from '@domains/chat/dto'
import { UserViewDTO } from '@domains/user/dto';

export interface ChatService {
  createRoom: (userId: string, data: CreateRoomInputDTO) => Promise<RoomDTO>
  deleteRoom: (userId: string, roomId: string) => Promise<void>

  joinUserToRoom: (userId: string, targetUserId: string, roomId: string) => Promise<void>
  removeUserFromRoom: (userId: string, targetUserId: string, roomId: string) => Promise<void>
  joinRoom: (userId: string, roomId: string) => Promise<void>
  leaveRoom: (userId: string, roomId: string) => Promise<void>

  getUserRooms: (userId: string) => Promise<RoomDTO[]>
  getMessageHistory: (userId: string, roomId: string) => Promise<MessageDTO[]>
  getRoomParticipants: (userId: string, roomId: string) => Promise<UserViewDTO[]>

  sendMessage: (userId: string, roomId: string, content: string) => Promise<MessageDTO>
  deleteMessage: (userId: string, messageId: string) => Promise<void>
}
