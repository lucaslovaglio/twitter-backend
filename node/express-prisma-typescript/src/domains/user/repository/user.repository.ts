import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO } from '../dto'
import { AccountPrivacyEnum } from '@domains/user/type'

export interface UserRepository {
  create: (data: SignupInputDTO, accountPrivacy: AccountPrivacyEnum) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: string) => Promise<UserDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  changeAccountPrivacy: (userId: string, accountPrivacy: AccountPrivacyEnum) => Promise<void>
  getPrivacyType: (accountPrivacyId: string) => Promise<AccountPrivacyEnum>
}
