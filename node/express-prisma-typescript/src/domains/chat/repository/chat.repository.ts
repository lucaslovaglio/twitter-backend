import { CreateRoomInputDTO, MessageDTO, RoomDTO } from '@domains/chat/dto'
import { UserDTO } from '@domains/user/dto';

export interface ChatRepository {
  createRoom: (userId: string, data: CreateRoomInputDTO) => Promise<RoomDTO>
  getRoom: (roomId: string) => Promise<RoomDTO | null>
  deleteRoom: (roomId: string) => Promise<void>
  getMessageHistory: (roomId: string) => Promise<MessageDTO[]>
  getUserRooms: (userId: string) => Promise<RoomDTO[]>
  getMessageById: (messageId: string) => Promise<MessageDTO | null>
  addUserToRoom: (userId: string, roomId: string) => Promise<void>
  removeUserFromRoom: (userId: string, roomId: string) => Promise<void>
  createMessage: (senderId: string, roomId: string, content: string) => Promise<MessageDTO>
  deleteMessage: (messageId: string) => Promise<void>
  getOwnerIdOfRoom: (roomId: string) => Promise<string | null>
  isUserInRoom: (userId: string, roomId: string) => Promise<boolean>
  getUserFromRoom: (userId: string, roomId: string) => Promise<UserDTO | null>
}
