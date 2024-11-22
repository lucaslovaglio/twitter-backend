import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { ReactionTypeDTO } from '@domains/reaction/dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (userId: string, options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostDTO[]>
  incrementReaction: (postId: string, reactionType: ReactionTypeDTO) => Promise<void>
  decrementReaction: (postId: string, reactionType: ReactionTypeDTO) => Promise<void>
}
