import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { CreateReactionInputDTO, ReactionDto, ReactionTypeDTO } from '@domains/reaction/dto'
import { PrismaClient } from '@prisma/client'
import { ReactionTypeEnum } from '@domains/reaction/type'
import { NotFoundException } from '@utils'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, postId: string, data: CreateReactionInputDTO): Promise<ReactionDto> {
    const reactionType: ReactionTypeDTO | null = await this.getReactionType(data.reactionType)
    if (!reactionType) {
      throw new NotFoundException('reaction type')
    }
    const reaction = await this.db.postReaction.create({
      data: {
        typeId: reactionType.id,
        userId,
        postId
      }
    })
    return new ReactionDto(reaction)
  }

  async delete (reactionId: string): Promise<void> {
    await this.db.postReaction.delete({
      where: {
        id: reactionId
      }
    })
  }

  async getReactionById (reactionId: string): Promise<ReactionDto | null> {
    const reaction = await this.db.postReaction.findUnique({
      where: {
        id: reactionId
      }
    })
    return reaction ? new ReactionDto(reaction) : null
  }

  async getReactionsByPostId (postId: string, reactionType: ReactionTypeDTO): Promise<ReactionDto[]> {
    const reactions = await this.db.postReaction.findMany({
      where: {
        postId,
        typeId: reactionType.id
      }
    })
    return reactions.map(reaction => new ReactionDto(reaction))
  }

  async getReactionsByUserId (userId: string, reactionType: ReactionTypeDTO): Promise<ReactionDto[]> {
    const reactions = await this.db.postReaction.findMany({
      where: {
        userId,
        typeId: reactionType.id
      }
    })
    return reactions.map(reaction => new ReactionDto(reaction))
  }

  async getAllReactionTypes (): Promise<ReactionTypeDTO[]> {
    const reactionTypes = await this.db.postReactionType.findMany()
    return reactionTypes.map(
      reactionType =>
        new ReactionTypeDTO(
          { id: reactionType.id, name: reactionType.name as ReactionTypeEnum }
        )
    )
  }

  async getReactionByPostIdAndUserId (userId: string, postId: string, reactionType: ReactionTypeDTO): Promise<ReactionDto | null> {
    const reaction = await this.db.postReaction.findFirst({
      where: {
        postId,
        userId,
        typeId: reactionType.id
      }
    })
    return reaction ? new ReactionDto(reaction) : null
  }

  async getReactionType (reactionType: ReactionTypeEnum): Promise<ReactionTypeDTO | null> {
    const reactionTypeDTO = await this.db.postReactionType.findFirst({
      where: {
        name: reactionType
      }
    })
    return reactionTypeDTO ? new ReactionTypeDTO({ id: reactionTypeDTO.id, name: reactionTypeDTO.name as ReactionTypeEnum }) : null
  }

  async getReactionTypeById (reactionTypeId: string): Promise<ReactionTypeDTO | null> {
    const reactionType = await this.db.postReactionType.findUnique({
      where: {
        id: reactionTypeId
      }
    })
    return reactionType ? new ReactionTypeDTO({ id: reactionType.id, name: reactionType.name as ReactionTypeEnum }) : null
  }
}
