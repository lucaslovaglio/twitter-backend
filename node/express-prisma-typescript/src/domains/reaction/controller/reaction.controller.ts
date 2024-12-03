import { Router } from 'express'
import { ReactionService } from '@domains/reaction/service'
import { reactionService } from '@domains/reaction/factory'
import { BodyValidation } from '@utils'
import { CreateReactionInputDTO } from '@domains/reaction/dto'
import HttpStatus from 'http-status'
import 'express-async-errors'

export const reactionRouter = Router()

const service: ReactionService = reactionService

reactionRouter.post('/:postId', BodyValidation(CreateReactionInputDTO), async (req, res) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const data = req.body

  const reaction = await service.createReaction(userId, postId, data)
  return res.status(HttpStatus.CREATED).json(reaction)
})

reactionRouter.delete('/:reactionId', async (req, res) => {
  const { userId } = res.locals.context
  const { reactionId } = req.params

  await service.deleteReaction(userId, reactionId)

  return res.status(HttpStatus.OK).send(`Deleted reaction ${reactionId}`)
})

reactionRouter.get('/all/:postId/type/:reactionTypeId', async (req, res) => {
  const { userId } = res.locals.context
  const { postId, reactionTypeId } = req.params
  const { limit, before, after } = req.query as Record<string, string>

  const reactions = await service.getReactionsByPostId(userId, postId, reactionTypeId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(reactions)
})

reactionRouter.get('/types', async (req, res) => {
  const reactionTypes = await service.getAllReactionTypes()

  return res.status(HttpStatus.OK).json(reactionTypes)
})

reactionRouter.get('/:reactionTypeId', async (req, res) => {
  const { userId } = res.locals.context
  const { reactionTypeId } = req.params
  const reactions = await service.getReactionsByUserId(userId, reactionTypeId)

  return res.status(HttpStatus.OK).json(reactions)
})

reactionRouter.get('/:postId/type/:reactionTypeId', async (req, res) => {
  const { userId } = res.locals.context
  const { postId, reactionTypeId } = req.params
  const reaction = await service.getReactionByPostIdAndUserId(userId, postId, reactionTypeId)

  return res.status(HttpStatus.OK).json(reaction)
})
