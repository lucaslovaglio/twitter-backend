import { FollowerService } from './follower.service'
import { FollowerRepository } from '../repository'
import { FollowDTO } from '@domains/follower/dto'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}

  async followUser (userId: string, followedId: string): Promise<FollowDTO> {
    return await this.repository.create(userId, followedId)
  }

  async unfollowUser (userId: string, followedId: string): Promise<void> {
    await this.repository.delete(userId, followedId)
  }

  async getFollowers (userId: string): Promise<FollowDTO[]> {
    return await this.repository.getFollowers(userId)
  }

  async getFollowing (userId: string): Promise<FollowDTO[]> {
    return await this.repository.getFollowing(userId)
  }

  async isFollowing (userId: string, followedId: string): Promise<boolean> {
    return await this.repository.isFollowing(userId, followedId)
  }
}
