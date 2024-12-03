import { CreateReactionInputDTO, ExtendedReactionDTO, ReactionDTO, ReactionTypeDTO } from '@domains/reaction/dto'
import { ReactionTypeEnum } from '@domains/reaction/type'

export interface ReactionRepository {
  create: (userId: string, postId: string, data: CreateReactionInputDTO) => Promise<ReactionDTO>
  delete: (reactionId: string) => Promise<void>
  getReactionById: (reactionId: string) => Promise<ReactionDTO | null>
  getReactionType: (reactionType: ReactionTypeEnum) => Promise<ReactionTypeDTO | null>
  getReactionTypeById: (reactionTypeId: string) => Promise<ReactionTypeDTO | null>
  getReactionsByPostId: (postId: string, reactionType: ReactionTypeDTO) => Promise<ExtendedReactionDTO[]>
  getReactionsByUserId: (userId: string, reactionType: ReactionTypeDTO) => Promise<ReactionDTO[]>
  getReactionByPostIdAndUserId: (userId: string, postId: string, reactionType: ReactionTypeDTO) => Promise<ReactionDTO | null>
  getAllReactionTypes: () => Promise<ReactionTypeDTO[]>
}
