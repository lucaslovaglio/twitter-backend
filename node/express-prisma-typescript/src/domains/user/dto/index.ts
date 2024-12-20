import { AccountPrivacyEnum } from '@domains/user/type'
import { IsEnum, IsString } from 'class-validator';

export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
    this.accountPrivacyId = user.accountPrivacyId
  }

  id: string
  name: string | null
  createdAt: Date
  accountPrivacyId: string
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.name = user.name
    this.password = user.password
  }

  email!: string
  username!: string
  password!: string
}
export class UserViewDTO {
  constructor (user: UserViewDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string | null
  username: string
  profilePicture?: string
}

export class AccountPrivacyDTO {
  constructor (accountPrivacy: AccountPrivacyDTO) {
    this.id = accountPrivacy.id
    this.name = accountPrivacy.name
  }

  id: string
  name: AccountPrivacyEnum
}

export class UpdatePrivacy {
  @IsString()
    id!: string

  @IsEnum(AccountPrivacyEnum)
    name!: AccountPrivacyEnum
}
