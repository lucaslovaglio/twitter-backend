import { Server, Socket } from 'socket.io'
import { Logger } from '@utils'
import { SocketEvents, SocketMessages } from '../constants'
import { SocketService } from '@domains/socket/service/socket.service'
import { ChatService } from '@domains/chat/service'
import { UserService } from '@domains/user/service'

export class SocketServiceImpl implements SocketService {
  constructor (
    private readonly io: Server,
    private readonly chatService: ChatService,
    private readonly userService: UserService
  ) {}

  initialize (): void {
    this.io.on(SocketEvents.CONNECTION, async (socket) => {
      await this.onConnection(socket)
    })
  }

  async onConnection (socket: Socket): Promise<void> {
    this.connect(socket)
    await this.joinAll(socket)
    await this.setNickname(socket)

    socket.on(SocketEvents.JOIN_ROOM, (roomName: string) => {
      this.join(socket, roomName)
    })

    socket.on(SocketEvents.MESSAGE, async (roomName: string, message: string) => {
      await this.receiveMessage(socket, roomName, message)
    })

    socket.on(SocketEvents.WRITING, (roomName: string) => {
      this.isWriting(socket, roomName)
    })

    socket.on(SocketEvents.LEAVE_ROOM, async (roomName: string) => {
      await this.leaveRoom(socket, roomName)
    })

    socket.on(SocketEvents.DISCONNECT, () => {
      this.disconnect(socket)
    })
  }

  private async joinAll (socket: Socket): Promise<void> {
    const rooms = await this.chatService.getUserRooms(socket.data.user.userId)
    for (const room of rooms) {
      this.join(socket, room.id)
    }
  }

  private connect (socket: Socket): void {
    Logger.info(`${SocketMessages.NEW_CONNECTION}: ${socket.id}`)
  }

  private disconnect (socket: Socket): void {
    Logger.info(`${SocketMessages.CLIENT_DISCONNECTED}: ${socket.id}`)
  }

  private async leaveRoom (socket: Socket, roomName: string): Promise<void> {
    Logger.info(`${socket.id} left room: ${roomName}`)
    await socket.leave(roomName)
  }

  private isWriting (socket: Socket, roomName: string): void {
    const nickname: string = socket.data.nickname !== undefined ? socket.data.nickname : socket.id
    socket.to(roomName).emit(SocketEvents.WRITING, `${nickname} ${SocketMessages.IS_WRITING}`)
    Logger.info(`${nickname} ${nickname} ${SocketMessages.IS_WRITING}`)
  }

  private async receiveMessage (socket: Socket, roomName: string, message: string): Promise<void> {
    const nickname: string = socket.data.nickname !== undefined ? socket.data.nickname : socket.id
    const userId: string = socket.data.user.userId !== undefined ? socket.data.user.userId : ''
    this.io.to(roomName).emit(SocketEvents.REPLY, `${nickname}: ${message}`)
    Logger.info(`${SocketMessages.RECEIVED_MESSAGE}: ${message}`)
    Logger.info(`${userId}`)
    await this.chatService.sendMessage(userId, roomName, message)
  }

  private async setNickname (socket: Socket): Promise<void> {
    const user = await this.userService.getUser(socket.data.user.userId)
    const name = user.username ? user.username : user.id
    socket.data.nickname = name
    Logger.info(`${socket.id} set their nickname to ${name}`)
  }

  private join (socket: Socket, roomName: string): void {
    Logger.info(`${socket.id} joined room: ${roomName}`)
    void socket.join(roomName)
    const nickname: string = socket.data.nickname !== undefined ? socket.data.nickname : socket.id
    this.io.to(roomName).emit(SocketEvents.STATE, `${nickname} ${SocketMessages.USER_ONLINE}`)
  }
}
