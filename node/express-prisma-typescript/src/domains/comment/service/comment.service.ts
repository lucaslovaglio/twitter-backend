import { CreatePostInputDTO, PostDTO } from '@domains/post/dto'
import { CommentDto } from '@domains/comment/dto'
import { CursorPagination } from '@types'

export interface CommentService {
  getComments: (userId: string, postId: string, options: CursorPagination) => Promise<PostDTO[]>
  createComment: (userId: string, postId: string, body: CreatePostInputDTO) => Promise<CommentDto>
  deleteComment: (userId: string, id: string) => Promise<void>
}
