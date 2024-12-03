import { CommentService } from '@domains/comment/service/comment.service'
import { CreatePostInputDTO, PostDTO } from '@domains/post/dto'
import { PostService } from '@domains/post/service'
import { NotFoundException } from '@utils'
import { CommentDto } from '@domains/comment/dto'
import { CommentRepository } from '@domains/comment/repository'
import { CursorPagination } from '@types'

export class CommentServiceImpl implements CommentService {
  constructor (
    private readonly repository: CommentRepository,
    private readonly postService: PostService
  ) {}

  async getComments (userId: string, postId: string, options: CursorPagination): Promise<PostDTO[]> {
    const post = await this.postService.getPost(userId, postId)
    if (!await this.postService.canViewPost(userId, post.authorId)) throw new NotFoundException('post')
    return await this.repository.getCommentsPaginated(postId, options)
  }

  async createComment (userId: string, parentPostId: string, body: CreatePostInputDTO): Promise<CommentDto> {
    const newPost = await this.postService.createPost(userId, body)
    return await this.repository.create(newPost.id, parentPostId)
  }

  async deleteComment (userId: string, id: string): Promise<void> {
    const comment: CommentDto = await this.getComment(id)
    const post = await this.getPost(userId, comment.childPostId)
    await this.postService.deletePost(userId, post.id)
    await this.repository.delete(id)
  }

  private async getComment (id: string): Promise<CommentDto> {
    const comment = await this.repository.getById(id)
    if (!comment) throw new NotFoundException('comment')
    return comment
  }

  private async getPost (userId: string, id: string): Promise<PostDTO> {
    const post: PostDTO = await this.postService.getPost(userId, id)
    if (post.authorId !== userId) throw new NotFoundException('post')
    return post
  }
}
