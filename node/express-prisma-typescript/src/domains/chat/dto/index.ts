import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateRoomInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    name!: string
}

export class RoomDTO {
  constructor (room: RoomDTO) {
    this.id = room.id
    this.name = room.name
    this.ownerId = room.ownerId
  }

  id: string
  name: string
  ownerId: string
}

export class MessageDTO {
  constructor (message: MessageDTO) {
    this.id = message.id
    this.content = message.content
    this.roomId = message.roomId
    this.senderId = message.senderId
    this.createdAt = message.createdAt
  }

  id: string
  content: string
  roomId: string
  senderId: string
  createdAt: Date
}
