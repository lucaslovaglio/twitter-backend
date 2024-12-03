import { PostRepository } from './post.repository'
import { CreatePostInputDTO, PostDTO, ExtendedPostDTO } from '../dto'
import { ReactionTypeDTO } from '@domains/reaction/dto'
import { CursorPagination } from '@types';

export class PostRepositoryMock implements PostRepository {
  private posts: PostDTO[] = []
  private readonly interactions = new Map<string, Map<string, number>>()

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = new PostDTO({
      id: String(this.posts.length + 1),
      authorId: userId,
      content: data.content,
      images: data.images ?? [],
      createdAt: new Date()
    })
    this.posts.push(post)
    return post
  }

  async getAllByDatePaginated (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    // Simulamos la paginación y el filtrado
    const posts = this.posts.slice(0, options.limit)
    return posts.map(post => new ExtendedPostDTO({
      ...post,
      author: {
        email: 'mock@mock',
        password: 'mock',
        accountPrivacyId: 'mock',
        createdAt: new Date(),
        id: post.authorId,
        username: 'mockuser',
        name: 'Mock User'
      },
      qtyComments: 0,
      qtyLikes: this.getReactions(post.id, 'LIKE'),
      qtyRetweets: this.getReactions(post.id, 'RETWEET')
    }))
  }

  private getReactions (postId: string, type: string): number {
    return this.interactions.get(postId)?.get(type) ?? 0
  }

  async delete (postId: string): Promise<void> {
    this.posts = this.posts.filter(post => post.id !== postId)
  }

  async getById (postId: string): Promise<PostDTO | null> {
    const post = this.posts.find(post => post.id === postId)
    return post ?? null
  }

  async incrementReaction (postId: string, reactionType: ReactionTypeDTO): Promise<void> {
    if (!this.interactions.has(postId)) {
      this.interactions.set(postId, new Map())
    }
    const postInteractions = this.interactions.get(postId)
    const currentCount = postInteractions?.get(reactionType.name) ?? 0
    postInteractions?.set(reactionType.name, currentCount + 1)
  }

  async decrementReaction (postId: string, reactionType: ReactionTypeDTO): Promise<void> {
    const postInteractions = this.interactions.get(postId)
    const currentCount = postInteractions?.get(reactionType.name) ?? 0
    if (currentCount > 0) {
      postInteractions?.set(reactionType.name, currentCount - 1)
    }
  }

  async getByAuthorId (authorId: string): Promise<PostDTO[]> {
    return this.posts.filter(post => post.authorId === authorId)
  }

  async getPostReactions (postId: string, reactionType: ReactionTypeDTO): Promise<number> {
    return this.getReactions(postId, reactionType.name)
  }
}
