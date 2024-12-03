import { ReactionService } from '@domains/reaction/service/reaction.service'
import { ReactionRepository } from '@domains/reaction/repository'
import { CreateReactionInputDTO, ExtendedReactionDTO, ReactionDTO, ReactionTypeDTO } from '@domains/reaction/dto'
import { ForbiddenException, NotFoundException } from '@utils'
import { PostService } from '@domains/post/service'
import { validate } from 'class-validator'
import { ReactionTypeEnum } from '@domains/reaction/type'
import { CursorPagination } from '@types'

export class ReactionServiceImpl implements ReactionService {
  constructor (
    private readonly repository: ReactionRepository,
    private readonly postService: PostService
  ) {}

  async createReaction (userId: string, postId: string, body: CreateReactionInputDTO): Promise<ReactionDTO> {
    await validate(body)
    await this.postService.checkPostAccess(userId, postId)
    const reactionType = await this.getReactionType(body.reactionType)
    await this.postService.incrementReactionCount(postId, reactionType)
    return await this.repository.create(userId, postId, body)
  }

  async deleteReaction (userId: string, reactionId: string): Promise<void> {
    const reaction: ReactionDTO | null = await this.repository.getReactionById(reactionId)
    if (!reaction) throw new NotFoundException('reaction')
    if (reaction.userId !== userId) throw new ForbiddenException()
    const reactionType = await this.repository.getReactionTypeById(reaction.typeId)
    if (!reactionType) throw new NotFoundException('reaction type')
    await this.postService.decrementReactionCount(reaction.postId, reactionType)
    await this.repository.delete(reaction.id)
  }

  async getReactionsByPostId (userId: string, postId: string, reactionTypeId: string, options: CursorPagination): Promise<ExtendedReactionDTO[]> {
    await this.postService.checkPostAccess(userId, postId)
    const reactionType: ReactionTypeDTO | null = await this.repository.getReactionTypeById(reactionTypeId)
    if (!reactionType) throw new NotFoundException('reaction type')
    return await this.repository.getReactionsByPostId(postId, reactionType, options)
  }

  async getAllReactionTypes (): Promise<ReactionTypeDTO[]> {
    return await this.repository.getAllReactionTypes()
  }

  async getReactionByPostIdAndUserId (userId: string, postId: string, reactionTypeId: string): Promise<ReactionDTO> {
    const reactionType = await this.repository.getReactionTypeById(reactionTypeId)
    if (!reactionType) throw new NotFoundException('reaction type')
    const reaction: ReactionDTO | null = await this.repository.getReactionByPostIdAndUserId(postId, userId, reactionType)
    if (!reaction) throw new NotFoundException('reaction')
    if (reaction.userId !== userId) throw new ForbiddenException()
    return reaction
  }

  async getReactionsByUserId (userId: string, reactionTypeId: string): Promise<ReactionDTO[]> {
    const reactionType = await this.repository.getReactionTypeById(reactionTypeId)
    if (!reactionType) throw new NotFoundException('reaction type')
    return await this.repository.getReactionsByUserId(userId, reactionType)
  }

  async getReactionType (type: ReactionTypeEnum): Promise<ReactionTypeDTO> {
    const reactionType = await this.repository.getReactionType(type)
    if (!reactionType) throw new NotFoundException('reaction type')
    return reactionType
  }
}
