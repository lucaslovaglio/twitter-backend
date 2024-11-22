import { CreateReactionInputDTO, ReactionDto, ReactionTypeDTO } from '@domains/reaction/dto'

export interface ReactionService {
  createReaction: (userId: string, postId: string, body: CreateReactionInputDTO) => Promise<ReactionDto>
  deleteReaction: (userId: string, reactionId: string) => Promise<void>
  getReactionsByPostId: (userId: string, postId: string, reactionTypeId: string) => Promise<ReactionDto[]>
  getReactionsByUserId: (userId: string, reactionTypeId: string) => Promise<ReactionDto[]>
  getReactionByPostIdAndUserId: (userId: string, postId: string, reactionTypeId: string) => Promise<ReactionDto>
  getAllReactionTypes: () => Promise<ReactionTypeDTO[]>
}
