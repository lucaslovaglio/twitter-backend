import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO } from '../dto'
import { UserRepository } from './user.repository'
import { AccountPrivacyEnum } from '@domains/user/type'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (data: SignupInputDTO, accountPrivacy: AccountPrivacyEnum): Promise<UserDTO> {
    const accountPrivacyId = await this.getAccountPrivacyId(accountPrivacy)
    const user = await this.db.user.create({
      data: {
        ...data,
        accountPrivacyId
      }
    })
    return new UserDTO(user)
  }

  async getAccountPrivacyId (accountPrivacy: AccountPrivacyEnum): Promise<string> {
    const privacy = await this.db.accountPrivacyType.findFirst({
      where: {
        name: accountPrivacy
      }
    })
    return privacy ? privacy.id : ''
  }

  async getById (userId: any): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user ? new UserDTO(user) : null
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            username
          }
        ]
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async changeAccountPrivacy (userId: any, accountPrivacy: AccountPrivacyEnum): Promise<void> {
    const accountPrivacyId = await this.getAccountPrivacyId(accountPrivacy)
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        accountPrivacyId
      }
    })
  }

  async getPrivacyType (accountPrivacyId: string): Promise<AccountPrivacyEnum> {
    const privacy = await this.db.accountPrivacyType.findUnique({
      where: { id: accountPrivacyId }
    })
    return privacy ? privacy.name as AccountPrivacyEnum : AccountPrivacyEnum.PUBLIC
  }
}
