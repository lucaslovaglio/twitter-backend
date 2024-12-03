import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { AccountPrivacyDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { AccountPrivacyEnum } from '@domains/user/type'
import { MediaService } from '@domains/media/service'
import { ExtendedFileDTO } from '@domains/media/dto'
import { MediaModel } from '@domains/media/type'

export class UserServiceImpl implements UserService {
  constructor (
    private readonly repository: UserRepository,
    private readonly mediaService: MediaService
  ) {}

  async getUser (userId: any): Promise<UserViewDTO> {
    const user = await this.repository.getViewById(userId)
    if (!user) throw new NotFoundException('user')
    const profilePicture: ExtendedFileDTO = await this.getProfilePicture(userId)
    const url = profilePicture.url
    return new UserViewDTO({ ...user, profilePicture: url })
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async updatePrivacy (userId: any, privacy: AccountPrivacyDTO): Promise<void> {
    await this.repository.changeAccountPrivacy(userId, privacy)
  }

  async isPrivate (userId: string): Promise<boolean> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    const privacy = await this.repository.getPrivacy(user.accountPrivacyId)
    return privacy?.name === AccountPrivacyEnum.PRIVATE
  }

  async getAllAccountPrivacy (): Promise<AccountPrivacyDTO[]> {
    return await this.repository.getAllAccountPrivacy()
  }

  async uploadProfilePicture (userId: string): Promise<ExtendedFileDTO> {
    return await this.mediaService.uploadMedia(userId, MediaModel.PROFILE_PICTURE, userId)
  }

  async getProfilePicture (userId: string): Promise<ExtendedFileDTO> {
    return await this.mediaService.getMedia(userId, MediaModel.PROFILE_PICTURE, userId)
  }

  async getUsersByUsername (username: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.repository.getUsersByUsername(username, options)
    return await Promise.all(
      users.map(async user => {
        const profilePicture: ExtendedFileDTO = await this.getProfilePicture(user.id)
        const url = profilePicture.url
        return new UserViewDTO({ ...user, profilePicture: url })
      })
    )
  }
}
