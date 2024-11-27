import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import { chatService } from '@domains/chat/factory'
import { ChatService } from '@domains/chat/service'
import { BodyValidation } from '@utils'
import { CreateRoomInputDTO } from '@domains/chat/dto'

export const chatRouter = Router()

const service: ChatService = chatService

chatRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const rooms = await service.getUserRooms(userId)

  return res.status(HttpStatus.OK).json(rooms)
})

chatRouter.get('/:roomId/history', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { roomId } = req.params

  const messages = await service.getMessageHistory(userId, roomId)

  return res.status(HttpStatus.OK).json(messages)
})

chatRouter.post('/', BodyValidation(CreateRoomInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const room = await service.createRoom(userId, data)

  return res.status(HttpStatus.CREATED).json(room)
})

chatRouter.post('/:roomId/join', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { roomId } = req.params

  await service.joinRoom(userId, roomId)

  return res.status(HttpStatus.OK).json({ message: 'User joined the room' })
})

chatRouter.post('/:roomId/joinUser/:targetUserId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { roomId, targetUserId } = req.params

  await service.joinUserToRoom(userId, targetUserId, roomId)

  return res.status(HttpStatus.OK).json({ message: 'User joined the room' })
})

chatRouter.delete('/:roomId/leave', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { roomId } = req.params

  await service.leaveRoom(userId, roomId)

  return res.status(HttpStatus.OK).json({ message: 'User left the room' })
})

chatRouter.delete('/:roomId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { roomId } = req.params

  await service.deleteRoom(userId, roomId)

  return res.status(HttpStatus.OK).json({ message: 'Room deleted' })
})

chatRouter.delete('/:roomId/removeUser/:targetUserId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { roomId, targetUserId } = req.params

  await service.removeUserFromRoom(userId, targetUserId, roomId)

  return res.status(HttpStatus.OK).json({ message: 'User left the room' })
})

chatRouter.delete('/message/:messageId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { messageId } = req.params

  await service.deleteMessage(userId, messageId)

  return res.status(HttpStatus.OK).json({ message: 'Message deleted' })
})
