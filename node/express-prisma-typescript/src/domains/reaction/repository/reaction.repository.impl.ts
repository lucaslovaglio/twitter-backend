import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { CreateReactionInputDTO, ExtendedReactionDTO, ReactionDTO, ReactionTypeDTO } from '@domains/reaction/dto'
import { PrismaClient } from '@prisma/client'
import { ReactionTypeEnum } from '@domains/reaction/type'
import { NotFoundException } from '@utils'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, postId: string, data: CreateReactionInputDTO): Promise<ReactionDTO> {
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
    return new ReactionDTO(reaction)
  }

  async delete (reactionId: string): Promise<void> {
    await this.db.postReaction.delete({
      where: {
        id: reactionId
      }
    })
  }

  async getReactionById (reactionId: string): Promise<ReactionDTO | null> {
    const reaction = await this.db.postReaction.findUnique({
      where: {
        id: reactionId
      }
    })
    return reaction ? new ReactionDTO(reaction) : null
  }

  async getReactionsByPostId (postId: string, reactionType: ReactionTypeDTO): Promise<ExtendedReactionDTO[]> {
    const reactions = await this.db.postReaction.findMany({
      where: {
        postId,
        typeId: reactionType.id
      },
      include: {
        user: true,
        type: true
      }
    })
    return reactions.map(reaction => {
      return new ExtendedReactionDTO({
        ...reaction,
        type: { id: reactionType.id, name: reactionType.name }
      })
    })
  }

  async getReactionsByUserId (userId: string, reactionType: ReactionTypeDTO): Promise<ReactionDTO[]> {
    const reactions = await this.db.postReaction.findMany({
      where: {
        userId,
        typeId: reactionType.id
      }
    })
    return reactions.map(reaction => new ReactionDTO(reaction))
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

  async getReactionByPostIdAndUserId (userId: string, postId: string, reactionType: ReactionTypeDTO): Promise<ReactionDTO | null> {
    const reaction = await this.db.postReaction.findFirst({
      where: {
        postId,
        userId,
        typeId: reactionType.id
      }
    })
    return reaction ? new ReactionDTO(reaction) : null
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
