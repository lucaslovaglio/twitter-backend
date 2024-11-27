import { ChatRepository } from '@domains/chat/repository/chat.repository'
import { ChatRepositoryImpl } from '@domains/chat/repository/chat.repository.impl'
import { db } from '@utils'
import { ChatService, ChatServiceImpl } from '@domains/chat/service'
import { userService } from '@domains/user/factory'
import { followerService } from '@domains/follower/factory'

const chatRepository: ChatRepository = new ChatRepositoryImpl(db)
export const chatService: ChatService = new ChatServiceImpl(chatRepository, userService, followerService)
