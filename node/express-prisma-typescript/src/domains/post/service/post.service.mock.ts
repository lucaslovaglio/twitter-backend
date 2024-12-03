import { PostService } from '.'
import { PostDTO, CreatePostInputDTO, ExtendedPostDTO } from '../dto'
import { ReactionTypeDTO } from '@domains/reaction/dto'
import { CursorPagination } from '@types'

export class PostServiceMock implements PostService {
  reactions = 0

  createPost = jest.fn(async (userId: string, data: CreatePostInputDTO): Promise<PostDTO> => {
    return new PostDTO({
      id: '1',
      authorId: userId,
      content: data.content,
      images: data.images ?? [],
      createdAt: new Date()
    })
  })

  deletePost = jest.fn(async (userId: string, postId: string): Promise<void> => {
    const post = await this.getPost(userId, postId)
    if (post.authorId !== userId) throw new Error('Forbidden')
  })

  getPost = jest.fn(async (userId: string, postId: string): Promise<PostDTO> => {
    return new PostDTO({
      id: postId,
      authorId: userId,
      content: 'This is a post content',
      images: [],
      createdAt: new Date()
    })
  })

  getLatestPosts = jest.fn(async (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> => {
    return [
      new ExtendedPostDTO({
        id: '1',
        authorId: userId,
        content: 'This is a post content',
        images: [],
        createdAt: new Date(),
        author: { id: userId, name: 'John', username: 'Doe', accountPrivacyId: '123', createdAt: new Date(), email: 'mock@email.com', password: '123456' },
        qtyComments: 2,
        qtyLikes: 3,
        qtyRetweets: 1
      })
    ]
  })

  getPostsByAuthor = jest.fn(async (userId: string, authorId: string): Promise<PostDTO[]> => {
    return [
      new PostDTO({
        id: '1',
        authorId,
        content: 'Post by author',
        images: [],
        createdAt: new Date()
      })
    ]
  })

  canViewPost = jest.fn(async (userId: string, authorId: string): Promise<boolean> => {
    return true
  })

  checkPostAccess = jest.fn(async (userId: string, postId: string): Promise<void> => {
    await this.getPost(userId, postId)
  })

  incrementReactionCount = jest.fn(async (postId: string, reactionType: ReactionTypeDTO): Promise<void> => {
    this.reactions++
  })

  decrementReactionCount = jest.fn(async (postId: string, reactionType: ReactionTypeDTO): Promise<void> => {
    this.reactions--
  })

  getPostReactions = jest.fn(async (postId: string, reactionType: ReactionTypeDTO): Promise<number> => {
    return this.reactions
  })
}
