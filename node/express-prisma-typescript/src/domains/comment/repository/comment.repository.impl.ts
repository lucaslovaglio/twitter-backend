import { PrismaClient } from '@prisma/client'
import { CommentRepository } from '@domains/comment/repository/comment.repository'
import { CommentDto } from '@domains/comment/dto'
import { ExtendedPostDTO } from '@domains/post/dto'
import { CursorPagination } from '@types'
import { ReactionTypeEnum } from '@domains/reaction/type'

interface PaginationOptions {
  cursor?: { id: string }
  skip?: number
  take?: number
}

export class CommentRepositoryImpl implements CommentRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (childPostId: string, parentPostId: string): Promise<CommentDto> {
    const comment = await this.db.comment.create({
      data: {
        childPostId,
        parentPostId
      }
    })
    return new CommentDto(comment)
  }

  async delete (id: string): Promise<void> {
    await this.db.comment.delete({ where: { id } })
  }

  async getById (id: string): Promise<CommentDto | null> {
    const comment = await this.db.comment.findUnique({ where: { id } })
    return (comment != null) ? new CommentDto(comment) : null
  }

  async getCommentsPaginated (
    postId: string,
    options: CursorPagination
  ): Promise<ExtendedPostDTO[]> {
    const paginationOptions = this.getPaginationOptions(options)
    const comments = await this.db.comment.findMany({
      ...paginationOptions,
      where: { parentPostId: postId },
      include: {
        childPost: {
          include: {
            author: true,
            PostInteractionCount: {
              include: {
                type: true
              }
            }
          }
        }
      },
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })

    const extendedPosts = comments.map((comment) => {
      const interactions = comment.childPost.PostInteractionCount
      const qtyComments =
        interactions.find((i) => i.type.name === ReactionTypeEnum.COMMENT)?.count ?? 0
      const qtyLikes =
        interactions.find((i) => i.type.name === ReactionTypeEnum.LIKE)?.count ?? 0
      const qtyRetweets =
        interactions.find((i) => i.type.name === ReactionTypeEnum.RETWEET)?.count ?? 0

      return new ExtendedPostDTO(
        {
          ...comment.childPost,
          qtyComments,
          qtyLikes,
          qtyRetweets
        }
      )
    })

    return extendedPosts.sort((a, b) => b.qtyLikes - a.qtyLikes)
  }

  private getPaginationOptions (options: CursorPagination): PaginationOptions {
    return {
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined
    }
  }
}
