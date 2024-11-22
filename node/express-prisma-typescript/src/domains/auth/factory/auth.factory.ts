import { AuthServiceImpl } from '@domains/auth/service'
import { userRepository } from '@domains/user/factory'

export const authService = new AuthServiceImpl(userRepository)
