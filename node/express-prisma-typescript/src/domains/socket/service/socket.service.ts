import { Socket } from 'socket.io'

export interface SocketService {
  initialize: () => void
  onConnection: (socket: Socket) => void
}
