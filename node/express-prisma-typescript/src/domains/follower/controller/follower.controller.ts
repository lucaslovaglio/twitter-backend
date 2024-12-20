import { Router } from 'express'
import { FollowerService } from '@domains/follower/service/follower.service'
import 'express-async-errors'
import HttpStatus from 'http-status'
import { followerService } from '@domains/follower/factory'

export const followerRouter = Router()

const service: FollowerService = followerService

followerRouter.post('/follow/:followedId', async (req, res) => {
  const { userId } = res.locals.context
  const { followedId } = req.params
  const follow = await service.followUser(userId, followedId)
  res.status(HttpStatus.OK).json(follow)
})

followerRouter.delete('/unfollow/:followedId', async (req, res) => {
  const { userId } = res.locals.context
  const { followedId } = req.params
  await service.unfollowUser(userId, followedId)
  res.status(HttpStatus.OK)
})

followerRouter.get('/all', async (req, res) => {
  const { userId } = res.locals.context
  const followers = await service.getFollowers(userId)
  res.status(HttpStatus.OK).json(followers)
})
