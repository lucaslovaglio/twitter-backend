import { CreatePostInputDTO, PostDTO } from '../dto'
import { ReactionTypeDTO } from '@domains/reaction/dto';

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>
  deletePost: (userId: string, postId: string) => Promise<void>
  getPost: (userId: string, postId: string) => Promise<PostDTO>
  getLatestPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<PostDTO[]>
  getPostsByAuthor: (userId: any, authorId: string) => Promise<PostDTO[]>
  canViewPost: (userId: string, authorId: string) => Promise<boolean>
  incrementReactionCount: (postId: string, reactionType: ReactionTypeDTO) => Promise<void>
  decrementReactionCount: (postId: string, reactionType: ReactionTypeDTO) => Promise<void>
  checkPostAccess: (userId: string, postId: string) => Promise<void>
}
