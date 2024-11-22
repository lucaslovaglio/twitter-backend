import { CreateReactionInputDTO, ReactionDto, ReactionTypeDTO } from '@domains/reaction/dto'
import { ReactionTypeEnum } from '@domains/reaction/type'

export interface ReactionRepository {
  create: (userId: string, postId: string, data: CreateReactionInputDTO) => Promise<ReactionDto>
  delete: (reactionId: string) => Promise<void>
  getReactionById: (reactionId: string) => Promise<ReactionDto | null>
  getReactionType: (reactionType: ReactionTypeEnum) => Promise<ReactionTypeDTO | null>
  getReactionTypeById: (reactionTypeId: string) => Promise<ReactionTypeDTO | null>
  getReactionsByPostId: (postId: string, reactionType: ReactionTypeDTO) => Promise<ReactionDto[]>
  getReactionsByUserId: (userId: string, reactionType: ReactionTypeDTO) => Promise<ReactionDto[]>
  getReactionByPostIdAndUserId: (userId: string, postId: string, reactionType: ReactionTypeDTO) => Promise<ReactionDto | null>
  getAllReactionTypes: () => Promise<ReactionTypeDTO[]>
}
