import { ExtendedPostDTO } from '@domains/post/dto'
import { CommentDto } from '@domains/comment/dto'
import { CursorPagination } from '@types'

export interface CommentRepository {
  getCommentsPaginated: (postId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
  create: (childPostId: string, parentPostId: string) => Promise<CommentDto>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<CommentDto | null>
}
