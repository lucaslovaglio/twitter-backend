import { ReactionRepositoryImpl } from '@domains/reaction/repository'
import { ReactionServiceImpl } from '@domains/reaction/service'
import { db } from '@utils'
import { postService } from '@domains/post/factory'

const reactionRepository = new ReactionRepositoryImpl(db)
export const reactionService = new ReactionServiceImpl(reactionRepository, postService)
