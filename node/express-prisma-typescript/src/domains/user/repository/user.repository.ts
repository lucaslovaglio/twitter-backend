import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { AccountPrivacyDTO, ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { AccountPrivacyEnum } from '@domains/user/type'

export interface UserRepository {
  create: (data: SignupInputDTO, accountPrivacyType: AccountPrivacyEnum) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: string) => Promise<UserDTO | null>
  getViewById: (userId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  changeAccountPrivacy: (userId: string, accountPrivacy: AccountPrivacyDTO) => Promise<void>
  getPrivacy: (accountPrivacyId: string) => Promise<AccountPrivacyDTO | null>
  getAllAccountPrivacy: () => Promise<AccountPrivacyDTO[]>
  getUsersByUsername: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>
}
