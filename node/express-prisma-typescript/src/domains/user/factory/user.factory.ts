import { UserRepositoryImpl } from '@domains/user/repository'
import { db } from '@utils'
import { UserServiceImpl } from '@domains/user/service'
import { mediaService } from '@domains/media/factory'

export const userRepository = new UserRepositoryImpl(db)
export const userService = new UserServiceImpl(userRepository, mediaService)
