import { ReactionTypeEnum } from '@domains/reaction/type'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class CreateReactionInputDTO {
  @IsEnum(ReactionTypeEnum)
  @IsNotEmpty()
    reactionType!: ReactionTypeEnum
}

export class ReactionDto {
  constructor (reaction: ReactionDto) {
    this.id = reaction.id
    this.typeId = reaction.typeId
    this.userId = reaction.userId
    this.postId = reaction.postId
    this.createdAt = reaction.createdAt
  }

  id: string
  typeId: string
  userId: string
  postId: string
  createdAt: Date
}

export class ReactionTypeDTO {
  constructor (reactionType: ReactionTypeDTO) {
    this.id = reactionType.id
    this.name = reactionType.name
  }

  id: string
  name: ReactionTypeEnum
}
