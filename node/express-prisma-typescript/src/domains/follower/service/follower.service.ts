import { FollowDTO } from '@domains/follower/dto';

export interface FollowerService {
  followUser: (followerId: string, followedId: string) => Promise<FollowDTO>
  unfollowUser: (followerId: string, followedId: string) => Promise<void>
  getFollowers: (followedId: string) => Promise<FollowDTO[]>
  getFollowing: (followerId: string) => Promise<FollowDTO[]>
  isFollowing: (followerId: string, followedId: string) => Promise<boolean>
}
