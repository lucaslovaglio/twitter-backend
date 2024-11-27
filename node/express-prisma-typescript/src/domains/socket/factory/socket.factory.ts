import { Server } from 'socket.io'
import { SocketService, SocketServiceImpl } from '@domains/socket'
import { chatService } from '@domains/chat/factory'
import { userService } from '@domains/user/factory'

export const socketService = (io: Server): SocketService => new SocketServiceImpl(io, chatService, userService)
