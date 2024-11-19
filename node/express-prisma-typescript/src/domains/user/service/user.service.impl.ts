import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { AccountPrivacyEnum } from '@domains/user/type'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: any): Promise<UserDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async updatePrivacy (userId: any, privacyType: AccountPrivacyEnum): Promise<void> {
    await this.repository.changeAccountPrivacy(userId, privacyType)
  }

  async isPrivate (userId: string): Promise<boolean> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    const privacyType = await this.repository.getPrivacyType(user.accountPrivacyId)
    return privacyType === AccountPrivacyEnum.PRIVATE
  }
}
