import { FollowerRepository } from '@domains/follower/repository/follower.repository'
import { FollowDTO } from '@domains/follower/dto'

export class FollowerRepositoryMock implements FollowerRepository {
  private follows: FollowDTO[] = []

  async create (followerId: string, followedId: string): Promise<FollowDTO> {
    const newFollow = new FollowDTO({
      id: `${followerId}_${followedId}`,
      followerId,
      followedId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    this.follows.push(newFollow)
    return newFollow
  }

  async delete (followerId: string, followedId: string): Promise<void> {
    this.follows = this.follows.filter(
      (follow) => follow.followerId !== followerId || follow.followedId !== followedId
    )
  }

  async getFollowers (followedId: string): Promise<FollowDTO[]> {
    return this.follows.filter(follow => follow.followedId === followedId)
  }

  async getFollowing (followerId: string): Promise<FollowDTO[]> {
    return this.follows.filter(follow => follow.followerId === followerId)
  }

  async isFollowing (followerId: string, followedId: string): Promise<boolean> {
    return this.follows.some(
      (follow) => follow.followerId === followerId && follow.followedId === followedId
    )
  }
}
