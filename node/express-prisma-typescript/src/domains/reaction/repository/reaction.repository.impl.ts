import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { CreateReactionInputDTO, ExtendedReactionDTO, ReactionDTO, ReactionTypeDTO } from '@domains/reaction/dto'
import { PostInteractionCount, PrismaClient } from '@prisma/client'
import { ReactionTypeEnum } from '@domains/reaction/type'
import { NotFoundException } from '@utils'
import { CursorPagination } from '@types'

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

  async getReactionsByPostId (postId: string, reactionType: ReactionTypeDTO, options: CursorPagination): Promise<ExtendedReactionDTO[]> {
    const reactions = await this.db.postReaction.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      where: {
        postId,
        typeId: reactionType.id
      },
      include: {
        user: true,
        type: true
      }
    })
    await this.syncReactionCount(postId, reactionType.id, reactions.length)
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

  private async getExistingReactionCount (postId: string, reactionTypeId: string): Promise<PostInteractionCount | null> {
    const count = await this.db.postInteractionCount.findUnique({
      where: {
        postId_typeId: {
          postId,
          typeId: reactionTypeId
        }
      }
    })
    return count ?? null
  }

  private isUpdateRecent (lastUpdatedAt: Date, thresholdInMinutes: number = 5): boolean {
    const currentTime = new Date()
    const timeDiff = currentTime.getTime() - lastUpdatedAt.getTime()
    const thresholdInMs = thresholdInMinutes * 60 * 1000
    return timeDiff < thresholdInMs
  }

  private async syncReactionCount (postId: string, reactionTypeId: string, value: number): Promise<void> {
    const existingCount = await this.getExistingReactionCount(postId, reactionTypeId)

    if (!existingCount) {
      await this.createReactionCount(postId, reactionTypeId, value)
      return
    }

    if (this.isUpdateRecent(existingCount.updatedAt, this.calculateWaitTimeWithAsymptote(existingCount.count))) {
      return
    }

    await this.updateReactionCount(postId, reactionTypeId, value)
  }

  private calculateWaitTimeWithAsymptote (likes: number): number {
    const A = 10080 // Asymptote of 7 days in minutes
    const B = 500 // Curvature value
    // This function let posts with fewer reactions to update faster than posts with a lot of reactions

    const waitTime = (A * likes) / (B + likes)

    return waitTime * 60 * 1000
  }

  private async createReactionCount (postId: string, reactionTypeId: string, value: number): Promise<void> {
    await this.db.postInteractionCount.create({
      data: {
        postId,
        typeId: reactionTypeId,
        count: value
      }
    })
  }

  private async updateReactionCount (postId: string, reactionTypeId: string, value: number): Promise<void> {
    await this.db.postInteractionCount.update({
      where: {
        postId_typeId: {
          postId,
          typeId: reactionTypeId
        }
      },
      data: {
        count: value
      }
    })
  }
}
