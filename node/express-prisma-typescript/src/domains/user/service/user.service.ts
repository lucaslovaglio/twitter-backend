import { OffsetPagination } from '@types'
import { AccountPrivacyDTO, UserDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  updatePrivacy: (userId: any, privacy: AccountPrivacyDTO) => Promise<void>
  isPrivate: (userId: string) => Promise<boolean>
  getAllAccountPrivacy: () => Promise<AccountPrivacyDTO[]>
}
