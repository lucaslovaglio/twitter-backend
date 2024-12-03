import { followerServiceMock } from '../factory/follower.factory'
import { FollowerService } from './follower.service'
import { ConflictException } from '../../../utils/errors'
import { FollowerRepository } from '../repository/follower.repository'
import { FollowerRepositoryMock } from '../repository/follower.repository.mock'
import { FollowerServiceImpl } from './follower.service.impl'

describe('FollowerServiceImpl', () => {
  let service: FollowerService
  let repository: FollowerRepository

  beforeEach(() => {
    repository = new FollowerRepositoryMock()
    service = new FollowerServiceImpl(repository)
  })

  it('should follow a user successfully', async () => {
    const userId = 'user1'
    const followedId = 'user2'

    // Simulate that the user is not following the target user
    const follow = await service.followUser(userId, followedId)

    expect(follow.followerId).toBe(userId)
    expect(follow.followedId).toBe(followedId)
    expect(follow.createdAt).toBeDefined()
    expect(follow.updatedAt).toBeDefined()
  })

  it('should throw an error when already following', async () => {
    const userId = 'user1'
    const followedId = 'user2'

    // First, follow the user
    await service.followUser(userId, followedId)

    // Try to follow the same user again
    await expect(service.followUser(userId, followedId))
      .rejects
      .toThrowError(new ConflictException('You are already following this user'))
  })

  it('should unfollow a user successfully', async () => {
    const userId = 'user1'
    const followedId = 'user2'

    // First, follow the user
    await service.followUser(userId, followedId)

    // Unfollow the user
    await service.unfollowUser(userId, followedId)

    // Check that the user is no longer following
    const isFollowing = await service.isFollowing(userId, followedId)
    expect(isFollowing).toBe(false)
  })

  it('should throw an error when trying to unfollow a user not followed', async () => {
    const userId = 'user1'
    const followedId = 'user2'

    // Try to unfollow a user without following them first
    await expect(service.unfollowUser(userId, followedId))
      .rejects
      .toThrowError(new ConflictException('You are not following this user'))
  })

  it('should get followers of a user', async () => {
    const userId = 'user1'
    const followedId = 'user2'

    // First, follow the user
    await service.followUser(userId, followedId)

    // Get followers of the followedId
    const followers = await service.getFollowers(followedId)
    expect(followers.length).toBe(1)
    expect(followers[0].followerId).toBe(userId)
  })

  it('should get following users of a user', async () => {
    const userId = 'user1'
    const followedId = 'user2'

    // First, follow the user
    await service.followUser(userId, followedId)

    // Get following of the user
    const following = await service.getFollowing(userId)
    expect(following.length).toBe(1)
    expect(following[0].followedId).toBe(followedId)
  })
})
