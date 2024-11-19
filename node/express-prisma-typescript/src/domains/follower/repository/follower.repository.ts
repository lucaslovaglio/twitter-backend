import { FollowDTO } from '@domains/follower/dto';

export interface FollowerRepository {
  create: (followerId: string, followedId: string) => Promise<FollowDTO>
  delete: (followerId: string, followedId: string) => Promise<void>
  getFollowers: (followedId: string) => Promise<FollowDTO[]>
}
