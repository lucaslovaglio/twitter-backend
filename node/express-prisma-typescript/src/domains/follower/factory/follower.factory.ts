import { FollowerServiceImpl } from '@domains/follower/service/follower.service.impl'
import { FollowerRepositoryImpl, FollowerRepositoryMock } from '@domains/follower/repository'
import { db } from '@utils'

const followerRepository = new FollowerRepositoryImpl(db)
export const followerService = new FollowerServiceImpl(followerRepository)

const followerRepositoryMock = new FollowerRepositoryMock()
export const followerServiceMock = new FollowerServiceImpl(followerRepositoryMock)
