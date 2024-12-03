import { CreateReactionInputDTO, ExtendedReactionDTO, ReactionDTO, ReactionTypeDTO } from '@domains/reaction/dto'
import { ReactionTypeEnum } from '@domains/reaction/type'
import { CursorPagination } from '@types'

export interface ReactionService {
  createReaction: (userId: string, postId: string, body: CreateReactionInputDTO) => Promise<ReactionDTO>
  deleteReaction: (userId: string, reactionId: string) => Promise<void>
  getReactionsByPostId: (userId: string, postId: string, reactionTypeId: string, options: CursorPagination) => Promise<ExtendedReactionDTO[]>
  getReactionsByUserId: (userId: string, reactionTypeId: string) => Promise<ReactionDTO[]>
  getReactionByPostIdAndUserId: (userId: string, postId: string, reactionTypeId: string) => Promise<ReactionDTO>
  getAllReactionTypes: () => Promise<ReactionTypeDTO[]>
  getReactionType: (type: ReactionTypeEnum) => Promise<ReactionTypeDTO>
}
