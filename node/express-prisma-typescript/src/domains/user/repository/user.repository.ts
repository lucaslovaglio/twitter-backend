import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, AccountPrivacyType } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO, accountPrivacy: AccountPrivacyType) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: string) => Promise<UserDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
}
