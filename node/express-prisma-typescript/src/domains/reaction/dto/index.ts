import { ReactionTypeEnum } from '@domains/reaction/type'
import { IsEnum, IsNotEmpty, NotEquals } from 'class-validator'
import { UserViewDTO } from '@domains/user/dto'
import { PostDTO } from '@domains/post/dto'

export class CreateReactionInputDTO {
  @IsEnum(ReactionTypeEnum)
  @NotEquals(ReactionTypeEnum.COMMENT)
  @IsNotEmpty()
    reactionType!: ReactionTypeEnum
}

export class ReactionDTO {
  constructor (reaction: ReactionDTO) {
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

export class ExtendedReactionDTO {
  constructor (extendedReaction: ExtendedReactionDTO) {
    this.id = extendedReaction.id
    this.type = extendedReaction.type
    this.user = extendedReaction.user
    this.postId = extendedReaction.postId
    this.createdAt = extendedReaction.createdAt
  }

  id: string
  type: ReactionTypeDTO
  user: UserViewDTO
  postId: string
  createdAt: Date
}
