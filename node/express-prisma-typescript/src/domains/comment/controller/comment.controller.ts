import { Request, Response, Router } from 'express'
import { BodyValidation } from '@utils'
import { CreatePostInputDTO } from '@domains/post/dto'
import HttpStatus from 'http-status'
import { commentService } from '@domains/comment/factory'
import { CommentService } from '@domains/comment/service/comment.service'

export const commentRouter = Router()

const service: CommentService = commentService

commentRouter.post('/:postId', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const data = req.body
  const comment = await service.createComment(userId, postId, data)
  res.status(HttpStatus.CREATED).json(comment)
})

commentRouter.delete('/:commentId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { commentId } = req.params
  await service.deleteComment(userId, commentId)
  res.status(HttpStatus.NO_CONTENT).send(`Deleted comment with id ${commentId}`)
})

commentRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { limit, before, after } = req.query as Record<string, string>
  const comments = await service.getComments(userId, postId, { limit: Number(limit), before, after })
  res.status(HttpStatus.OK).json(comments)
})
