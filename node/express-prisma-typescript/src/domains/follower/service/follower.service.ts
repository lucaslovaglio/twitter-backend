import { FollowDTO } from '@domains/follower/dto'

export interface FollowerService {
  followUser: (userId: string, followedId: string) => Promise<FollowDTO>
  unfollowUser: (userId: string, followedId: string) => Promise<void>
  getFollowers: (userId: string) => Promise<FollowDTO[]>
  getFollowing: (userId: string) => Promise<FollowDTO[]>
  isFollowing: (userId: string, followedId: string) => Promise<boolean>
}
