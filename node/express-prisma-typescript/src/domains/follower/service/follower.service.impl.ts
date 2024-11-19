import { FollowerService } from './follower.service'
import { FollowerRepository } from '../repository'
import { FollowDTO } from '@domains/follower/dto'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}

  async followUser (followerId: string, followedId: string): Promise<FollowDTO> {
    return await this.repository.create(followerId, followedId)
  }

  async unfollowUser (followerId: string, followedId: string): Promise<void> {
    await this.repository.delete(followerId, followedId)
  }

  async getFollowers (followedId: string): Promise<FollowDTO[]> {
    return await this.repository.getFollowers(followedId)
  }

  async getFollowing (followerId: string): Promise<FollowDTO[]> {
    return await this.repository.getFollowers(followerId)
  }
}
