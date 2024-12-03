import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, Logger, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { FollowerService } from '@domains/follower/service/follower.service'
import { UserService } from '@domains/user/service'
import { ReactionTypeDTO } from '@domains/reaction/dto'

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
    if (!post) {
      throw new NotFoundException('post')
    }
    await this.checkPostAccess(userId, post.id)
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    return await this.repository.getAllByDatePaginated(userId, options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    await this.canViewPost(userId, authorId)
    return await this.repository.getByAuthorId(authorId)
  }

  async canViewPost (userId: string, authorId: string): Promise<boolean> {
    return !await this.isPrivateProfile(authorId) || await this.isFollowing(userId, authorId)
  }

  async checkPostAccess (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) {
      throw new NotFoundException('post')
    }
    Logger.info('Checking post access')
    if (!await this.canViewPost(userId, post.authorId)) {
      Logger.info('ohh ohhhh!')
      throw new NotFoundException('post')
    }
  }

  async incrementReactionCount (postId: string, reactionType: ReactionTypeDTO): Promise<void> {
    await this.repository.incrementReaction(postId, reactionType)
  }

  async decrementReactionCount (postId: string, reactionType: ReactionTypeDTO): Promise<void> {
    await this.repository.decrementReaction(postId, reactionType)
  }

  private async isPrivateProfile (authorId: string): Promise<boolean> {
    return await this.userService.isPrivate(authorId)
  }

  private async isFollowing (userId: string, authorId: string): Promise<boolean> {
    return await this.followerService.isFollowing(userId, authorId)
  }

  async getPostReactions (postId: string, reactionType: ReactionTypeDTO): Promise<number> {
    return await this.repository.getPostReactions(postId, reactionType)
  }
}
