import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { FollowerService } from '@domains/follower/service/follower.service'
import { UserService } from '@domains/user/service'

export class PostServiceImpl implements PostService {
  constructor (
    private readonly repository: PostRepository,
    private readonly followerService: FollowerService,
    private readonly userService: UserService
  ) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    const post = await this.repository.getById(postId)
    if (!post || await this.canViewPost(userId, post.authorId)) {
      throw new NotFoundException('post')
    }
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    return await this.repository.getAllByDatePaginated(userId, options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    if (await this.canViewPost(userId, authorId)) {
      throw new NotFoundException('post')
    }
    return await this.repository.getByAuthorId(authorId)
  }

  private async canViewPost (userId: string, authorId: string): Promise<boolean> {
    return !await this.isPrivateProfile(authorId) || await this.isFollowing(userId, authorId)
  }

  private async isPrivateProfile (authorId: string): Promise<boolean> {
    return await this.userService.isPrivate(authorId)
  }

  private async isFollowing (userId: string, authorId: string): Promise<boolean> {
    return await this.followerService.isFollowing(userId, authorId)
  }
}
