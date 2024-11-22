import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { ReactionTypeEnum } from '@domains/reaction/type';
import { ReactionTypeDTO } from '@domains/reaction/dto';

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
  ): Promise<PostDTO[]> {
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
        author: true
      }
    })

    return posts.map((post) => new PostDTO(post))
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
    await this.db.postInteractionCount.update({
      where: {
        postId_typeId: {
          postId,
          typeId: reactionType.id
        }
      },
      data: {
        count: {
          increment: 1
        }
      }
    })
  }

  async decrementReaction (postId: string, reactionType: ReactionTypeDTO): Promise<void> {
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
}
