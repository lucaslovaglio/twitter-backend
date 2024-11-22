import { db } from '@utils'
import { PostRepositoryImpl } from '@domains/post/repository'
import { PostServiceImpl } from '@domains/post/service'
import { followerService } from '@domains/follower/factory'
import { userService } from '@domains/user/factory'

const postRepository = new PostRepositoryImpl(db)
export const postService = new PostServiceImpl(postRepository, followerService, userService)
