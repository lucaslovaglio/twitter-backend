import { db } from '@utils'
import { CommentServiceImpl } from '@domains/comment/service/comment.service.impl'
import { postService } from '@domains/post/factory'
import { CommentRepositoryImpl } from '@domains/comment/repository'

const commentRepository = new CommentRepositoryImpl(db)
export const commentService = new CommentServiceImpl(commentRepository, postService)
