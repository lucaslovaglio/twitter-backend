import { ReactionServiceImpl } from '@domains/reaction/service/reaction.service.impl'
import { ReactionRepositoryMock } from '@domains/reaction/repository'
import { ReactionTypeEnum } from '@domains/reaction/type'
import { PostService, PostServiceMock } from '@domains/post/service'
import { ReactionTypeDTO } from '@domains/reaction/dto'

describe('ReactionServiceImpl', () => {
  let reactionService: ReactionServiceImpl
  let reactionRepositoryMock: ReactionRepositoryMock
  let postService: PostService

  beforeEach(() => {
    reactionRepositoryMock = new ReactionRepositoryMock()
    postService = new PostServiceMock()
    reactionService = new ReactionServiceImpl(reactionRepositoryMock, postService)
  })

  it('should create a like reaction', async () => {
    const reactionInput = { reactionType: ReactionTypeEnum.LIKE }
    const userId = 'user1'
    const postId = 'post1'

    const reaction = await reactionService.createReaction(userId, postId, reactionInput)
    expect(reaction).toHaveProperty('id')
    expect(reaction.typeId).toBe('1')
  })

  it('should delete a reaction', async () => {
    const reactionInput = { reactionType: ReactionTypeEnum.LIKE }
    const userId = 'user1'
    const postId = 'post1'

    const reaction = await reactionService.createReaction(userId, postId, reactionInput)
    await reactionService.deleteReaction(userId, reaction.id)

    const deletedReaction = await reactionRepositoryMock.getReactionById(reaction.id)
    expect(deletedReaction).toBeNull()
  })

  it('should have 2 likes', async () => {
    const reactionInput = { reactionType: ReactionTypeEnum.LIKE }
    const reactionType = new ReactionTypeDTO({ id: '1', name: ReactionTypeEnum.LIKE })
    const userId = 'user1'
    const postId = 'post1'

    await reactionService.createReaction(userId, postId, reactionInput)
    await reactionService.createReaction(userId, postId, reactionInput)

    const reactions = await reactionService.getReactionsByPostId(userId, postId, '1', { limit: 10, before: '', after: '' })
    expect(reactions).toHaveLength(2)

    const reactionCount = await postService.getPostReactions(postId, reactionType)
    expect(reactionCount).toBe(2)
  })
})
