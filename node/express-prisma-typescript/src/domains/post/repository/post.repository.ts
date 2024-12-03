import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { ReactionTypeDTO } from '@domains/reaction/dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (userId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostDTO[]>
  incrementReaction: (postId: string, reactionType: ReactionTypeDTO) => Promise<void>
  decrementReaction: (postId: string, reactionType: ReactionTypeDTO) => Promise<void>
  getPostReactions: (postId: string, reactionType: ReactionTypeDTO) => Promise<number>
}
