import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { BodyValidation } from '@utils'

import { UserService } from '../service'
import { AccountPrivacyDTO } from '@domains/user/dto'
import { userService } from '@domains/user/factory'

export const userRouter = Router()

// Use dependency injection
const service: UserService = userService

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params

  const user = await service.getUser(otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

userRouter.post('/:userId/privacy', BodyValidation(AccountPrivacyDTO), async (req: Request, res: Response) => {
  const { userId } = req.params
  const { privacy } = req.body

  await service.updatePrivacy(userId, privacy)

  return res.status(HttpStatus.OK)
})

userRouter.get('/privacy/all', async (req: Request, res: Response) => {
  const privacyTypes = await service.getAllAccountPrivacy()

  return res.status(HttpStatus.OK).json(privacyTypes)
})
