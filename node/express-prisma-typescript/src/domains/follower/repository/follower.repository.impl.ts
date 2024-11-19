import { FollowerRepository } from '@domains/follower/repository/follower.repository'
import { PrismaClient } from '@prisma/client'
import { FollowDTO } from '@domains/follower/dto'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (followerId: string, followedId: string): Promise<FollowDTO> {
    return await this.db.follow.create({
      data: {
        followerId,
        followedId
      }
    }).then(follow => new FollowDTO(follow))
  }

  async delete (followerId: string, followedId: string): Promise<void> {
    await this.db.follow.delete({
      where: {
        followerId_followedId: {
          followerId,
          followedId
        }
      }
    })
  }

  async getFollowers (followedId: string): Promise<FollowDTO[]> {
    const followers = await this.db.follow.findMany({
      where: {
        followedId
      }
    })
    return followers.map(follow => new FollowDTO(follow))
  }
}

