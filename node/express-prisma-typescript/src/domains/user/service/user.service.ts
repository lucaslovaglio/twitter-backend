import { OffsetPagination } from '@types'
import { UserDTO } from '../dto'
import { AccountPrivacyEnum } from '@domains/user/type';

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  updatePrivacy: (userId: any, privacyType: AccountPrivacyEnum) => Promise<void>
  isPrivate: (userId: string) => Promise<boolean>
}
