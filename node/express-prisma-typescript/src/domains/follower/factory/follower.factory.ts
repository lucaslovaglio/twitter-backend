import { FollowerServiceImpl } from '@domains/follower/service/follower.service.impl'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { db } from '@utils'

const followerRepository = new FollowerRepositoryImpl(db)
export const followerService = new FollowerServiceImpl(followerRepository)
