import { Server, Socket } from 'socket.io'
import { Logger } from '@utils'
import { SocketEvents, SocketMessages } from '../constants'
import { SocketService } from '@domains/socket/service/socket.service'

export class SocketServiceImpl implements SocketService {
  private readonly io: Server

  constructor (io: Server) {
    this.io = io
  }

  initialize (): void {
    this.io.on(SocketEvents.CONNECTION, (socket) => { this.onConnection(socket) })
  }

  onConnection (socket: Socket): void {
    this.connect(socket)

    socket.on(SocketEvents.SET_NICKNAME, (nickname: string) => {
      this.setNickname(socket, nickname)
    })

    socket.on(SocketEvents.JOIN_ROOM, (roomName: string) => {
      this.join(socket, roomName)
    })

    socket.on(SocketEvents.MESSAGE, (roomName: string, message: string) => {
      this.receiveMessage(socket, roomName, message)
    })

    socket.on(SocketEvents.WRITING, (roomName: string) => {
      this.isWriting(socket, roomName)
    })

    socket.on(SocketEvents.LEAVE_ROOM, (roomName: string) => {
      this.leaveRoom(socket, roomName)
    })

    socket.on(SocketEvents.DISCONNECT, () => {
      this.disconnect(socket)
    })
  }

  private connect (socket: Socket): void {
    Logger.info(`${SocketMessages.NEW_CONNECTION}: ${socket.id}`)
    socket.emit(SocketEvents.PARTICIPANTS, [])
  }

  private disconnect (socket: Socket): void {
    Logger.info(`${SocketMessages.CLIENT_DISCONNECTED}: ${socket.id}`)
  }

  private leaveRoom (socket: Socket, roomName: string): void {
    Logger.info(`${socket.id} left room: ${roomName}`)
    void socket.leave(roomName)
  }

  private isWriting (socket: Socket, roomName: string): void {
    const nickname: string = socket.data.nickname !== undefined ? socket.data.nickname : socket.id
    socket.to(roomName).emit(SocketEvents.WRITING, `${nickname} ${SocketMessages.IS_WRITING}`)
    Logger.info(`${nickname} ${nickname} ${SocketMessages.IS_WRITING}`)
  }

  private receiveMessage (socket: Socket, roomName: string, message: string): void {
    const nickname: string = socket.data.nickname !== undefined ? socket.data.nickname : socket.id
    this.io.to(roomName).emit(SocketEvents.REPLY, `${nickname}: ${message}`)
    Logger.info(`${SocketMessages.RECEIVED_MESSAGE}: ${message}`)
  }

  private setNickname (socket: Socket, nickname: string): void {
    socket.data.nickname = nickname
    Logger.info(`${socket.id} set their nickname to ${nickname}`)
  }

  private join (socket: Socket, roomName: string): void {
    Logger.info(`${socket.id} joined room: ${roomName}`)
    void socket.join(roomName)
    const nickname: string = socket.data.nickname !== undefined ? socket.data.nickname : socket.id
    this.io.to(roomName).emit(SocketEvents.STATE, `${nickname} ${SocketMessages.USER_ONLINE}`)
  }
}
