import { UserRepositoryImpl } from '@domains/user/repository'
import { db } from '@utils'
import { UserServiceImpl } from '@domains/user/service'

export const userRepository = new UserRepositoryImpl(db)
export const userService = new UserServiceImpl(userRepository)
