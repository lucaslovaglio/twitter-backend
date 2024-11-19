import { Router } from 'express'
import { FollowerService } from '@domains/follower/service/follower.service'
import { FollowerServiceImpl } from '@domains/follower/service/follower.service.impl'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { db } from '@utils'
import 'express-async-errors'
import HttpStatus from 'http-status'

export const followerRouter = Router()

const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))

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
