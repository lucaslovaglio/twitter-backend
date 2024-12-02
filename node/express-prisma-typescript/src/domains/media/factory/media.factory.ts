import { MediaRepository, MediaRepositoryImpl } from '@domains/media/repository'
import { db } from '@utils'
import { MediaService, MediaServiceImpl } from '@domains/media/service'
import { awsService } from '@domains/storage/factory'

const mediaRepository: MediaRepository = new MediaRepositoryImpl(db)
export const mediaService: MediaService = new MediaServiceImpl(mediaRepository, awsService)
