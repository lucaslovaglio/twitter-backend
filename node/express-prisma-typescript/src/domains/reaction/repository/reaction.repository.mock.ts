import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { CreateReactionInputDTO, ExtendedReactionDTO, ReactionDTO, ReactionTypeDTO } from '@domains/reaction/dto'
import { NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { ReactionTypeEnum } from '@domains/reaction/type'

export class ReactionRepositoryMock implements ReactionRepository {
  private readonly reactions: ReactionDTO[] = []
  private readonly reactionType: ReactionTypeDTO = new ReactionTypeDTO({ id: '1', name: ReactionTypeEnum.LIKE })

  // Simula la creación de una reacción (solo LIKE)
  async create (userId: string, postId: string, data: CreateReactionInputDTO): Promise<ReactionDTO> {
    if (data.reactionType !== ReactionTypeEnum.LIKE) {
      throw new Error('Only LIKE reactions are allowed')
    }

    const newReaction: ReactionDTO = {
      id: `${this.reactions.length + 1}`,
      typeId: this.reactionType.id,
      userId,
      postId,
      createdAt: new Date()
    }

    this.reactions.push(newReaction)
    return new ReactionDTO(newReaction)
  }

  // Simula la eliminación de una reacción (solo el LIKE)
  async delete (reactionId: string): Promise<void> {
    const reactionIndex = this.reactions.findIndex(reaction => reaction.id === reactionId)
    if (reactionIndex === -1) throw new NotFoundException('reaction')
    this.reactions.splice(reactionIndex, 1)
  }

  // Simula la obtención de una reacción por su ID
  async getReactionById (reactionId: string): Promise<ReactionDTO | null> {
    const reaction = this.reactions.find(reaction => reaction.id === reactionId)
    return reaction ? new ReactionDTO(reaction) : null
  }

  // Simula la obtención de reacciones por el ID de un post
  async getReactionsByPostId (postId: string, reactionType: ReactionTypeDTO, options: CursorPagination): Promise<ExtendedReactionDTO[]> {
    return this.reactions
      .filter(reaction => reaction.postId === postId)
      .map(reaction => ({ ...reaction, type: this.reactionType, user: { id: reaction.userId, name: '', username: '' } }))
  }

  // Simula la obtención de todas las reacciones de un usuario por tipo
  async getReactionsByUserId (userId: string): Promise<ReactionDTO[]> {
    return this.reactions.filter(reaction => reaction.userId === userId)
  }

  // Simula la obtención de todos los tipos de reacciones
  async getAllReactionTypes (): Promise<ReactionTypeDTO[]> {
    return [this.reactionType]
  }

  // Simula la obtención de una reacción por el ID del post y el ID del usuario
  async getReactionByPostIdAndUserId (postId: string, userId: string): Promise<ReactionDTO | null> {
    const reaction = this.reactions.find(reaction => reaction.postId === postId && reaction.userId === userId)
    return reaction ? new ReactionDTO(reaction) : null
  }

  // Simula la obtención de un tipo de reacción por su ID
  async getReactionTypeById (reactionTypeId: string): Promise<ReactionTypeDTO | null> {
    return reactionTypeId === this.reactionType.id ? this.reactionType : null
  }

  // Simula la obtención de un tipo de reacción por su valor
  async getReactionType (reactionType: ReactionTypeEnum): Promise<ReactionTypeDTO | null> {
    return new ReactionTypeDTO({ id: '1', name: reactionType })
  }
}
