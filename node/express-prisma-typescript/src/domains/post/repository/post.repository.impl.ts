import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { ReactionTypeDTO } from '@domains/reaction/dto'
import { ReactionTypeEnum } from '@domains/reaction/type'

interface VisibilityFilter {
  OR: Array<{
    author: {
      accountPrivacy: {
        name: string
      }
    }
  } | {
    author: {
      followers: {
        some: {
          followerId: string
        }
      }
    }
  }>
}

interface PaginationOptions {
  cursor?: { id: string }
  skip?: number
  take?: number
}

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (
    userId: string,
    options: CursorPagination
  ): Promise<ExtendedPostDTO[]> {
    const visibilityFilter = this.getVisibilityFilter(userId)

    const paginationOptions = this.getPaginationOptions(options)

    const posts = await this.db.post.findMany({
      where: visibilityFilter,
      ...paginationOptions,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ],
      include: {
        author: true,
        PostInteractionCount: {
          include: {
            type: true
          }
        }
      }
    })

    return posts.map((posts) => {
      const interactions = posts.PostInteractionCount
      const qtyComments =
        interactions.find((i) => i.type.name === ReactionTypeEnum.COMMENT)?.count ?? 0
      const qtyLikes =
        interactions.find((i) => i.type.name === ReactionTypeEnum.LIKE)?.count ?? 0
      const qtyRetweets =
        interactions.find((i) => i.type.name === ReactionTypeEnum.RETWEET)?.count ?? 0

      return new ExtendedPostDTO(
        {
          ...posts,
          qtyComments,
          qtyLikes,
          qtyRetweets
        }
      )
    })
  }

  private getVisibilityFilter (userId: string): VisibilityFilter {
    return {
      OR: [
        {
          author: {
            accountPrivacy: {
              name: 'public'
            }
          }
        },
        {
          author: {
            followers: {
              some: {
                followerId: userId
              }
            }
          }
        }
      ]
    }
  }

  private getPaginationOptions (options: CursorPagination): PaginationOptions {
    return {
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined
    }
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      }
    })
    return (post != null) ? new PostDTO(post) : null
  }

  async incrementReaction (postId: string, reactionType: ReactionTypeDTO): Promise<void> {
    await this.db.postInteractionCount.upsert({
      where: {
        postId_typeId: {
          postId,
          typeId: reactionType.id
        }
      },
      update: {
        count: {
          increment: 1
        }
      },
      create: {
        postId,
        typeId: reactionType.id,
        count: 1
      }
    })
  }

  async decrementReaction (postId: string, reactionType: ReactionTypeDTO): Promise<void> {
    const currentInteraction = await this.db.postInteractionCount.findUnique({
      where: {
        postId_typeId: {
          postId,
          typeId: reactionType.id
        }
      }
    })

    if (!currentInteraction || currentInteraction.count === 0) return

    await this.db.postInteractionCount.update({
      where: {
        postId_typeId: {
          postId,
          typeId: reactionType.id
        }
      },
      data: {
        count: {
          decrement: 1
        }
      }
    })
  }

  async getByAuthorId (authorId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }

  async getPostReactions (postId: string, reactionType: ReactionTypeDTO): Promise<number> {
    const interaction = await this.db.postInteractionCount.findUnique({
      where: {
        postId_typeId: {
          postId,
          typeId: reactionType.id
        }
      }
    })
    return interaction?.count ?? 0
  }
}
