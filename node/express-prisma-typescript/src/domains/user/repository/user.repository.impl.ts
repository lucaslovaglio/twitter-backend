import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { AccountPrivacyDTO, ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'
import { AccountPrivacyEnum } from '@domains/user/type'
import { NotFoundException } from '@utils'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (data: SignupInputDTO, accountPrivacyType: AccountPrivacyEnum): Promise<UserDTO> {
    const accountPrivacy = await this.getAccountPrivacyByType(accountPrivacyType)
    if (!accountPrivacy) {
      throw new NotFoundException('Account privacy')
    }
    const user = await this.db.user.create({
      data: {
        ...data,
        accountPrivacyId: accountPrivacy.id
      }
    })
    return new UserDTO(user)
  }

  private async getAccountPrivacyByType (accountPrivacy: AccountPrivacyEnum): Promise<AccountPrivacyDTO | null> {
    const privacy = await this.db.accountPrivacyType.findFirst({
      where: {
        name: accountPrivacy
      }
    })
    return privacy ? new AccountPrivacyDTO({ id: privacy.id, name: privacy.name as AccountPrivacyEnum }) : null
  }

  async getById (userId: any): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user ? new UserDTO(user) : null
  }

  async getViewById (userId: any): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })

    return user ? new UserViewDTO({ ...user, profilePicture: null }) : null
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

  async changeAccountPrivacy (userId: any, accountPrivacy: AccountPrivacyDTO): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        accountPrivacyId: accountPrivacy.id
      }
    })
  }

  async getPrivacy (accountPrivacyId: string): Promise<AccountPrivacyDTO | null> {
    const privacy = await this.db.accountPrivacyType.findUnique({
      where: { id: accountPrivacyId }
    })
    return privacy ? new AccountPrivacyDTO({ id: privacy.id, name: privacy.name as AccountPrivacyEnum }) : null
  }

  async getAllAccountPrivacy (): Promise<AccountPrivacyDTO[]> {
    const privacyTypes = await this.db.accountPrivacyType.findMany()
    return privacyTypes.map(privacy => new AccountPrivacyDTO({ id: privacy.id, name: privacy.name as AccountPrivacyEnum }))
  }
}
