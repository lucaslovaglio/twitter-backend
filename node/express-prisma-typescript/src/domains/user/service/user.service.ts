import { OffsetPagination } from '@types'
import { AccountPrivacyDTO, UserDTO, UserViewDTO } from '../dto'
import { ExtendedFileDTO } from '@domains/media/dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  updatePrivacy: (userId: any, privacy: AccountPrivacyDTO) => Promise<void>
  isPrivate: (userId: string) => Promise<boolean>
  getAllAccountPrivacy: () => Promise<AccountPrivacyDTO[]>
  uploadProfilePicture: (userId: string) => Promise<ExtendedFileDTO>
  getProfilePicture: (userId: string) => Promise<ExtendedFileDTO>
}
