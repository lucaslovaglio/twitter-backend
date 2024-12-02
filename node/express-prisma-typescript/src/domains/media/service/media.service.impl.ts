import { StorageService } from '@domains/storage/service'
import { MediaService } from '@domains/media/service/media.service'
import { ExtendedFileDTO } from '@domains/media/dto'
import { ForbiddenException, NotFoundException } from '@utils'
import { MediaRepository } from '@domains/media/repository/media.repository'

export class MediaServiceImpl implements MediaService {
  constructor (
    private readonly repository: MediaRepository,
    private readonly storageService: StorageService
  ) {}

  async uploadMedia (userId: string, model: string, fileName: string): Promise<ExtendedFileDTO> {
    const path = `${model}/${fileName}`
    const url = await this.storageService.generateUploadUrl(path)
    const file = await this.repository.create(userId, fileName, path)
    return new ExtendedFileDTO({ ...file, url })
  }

  async deleteMedia (userId: string, model: string, fileName: string): Promise<void> {
    const path = `${model}/${fileName}`
    const file = await this.repository.getByPath(path)
    if (!file) throw new NotFoundException('file')
    if (file.createdById !== userId) throw new ForbiddenException()
    await this.repository.deleteByPath(path)
  }

  async getMedia (userId: string, model: string, fileName: string): Promise<ExtendedFileDTO> {
    const path = `${model}/${fileName}`
    const file = await this.repository.getByPath(path)
    if (!file) throw new NotFoundException('file')
    const url = await this.storageService.generateDownloadUrl(path)
    // here we could check permissions to read the file
    return new ExtendedFileDTO({ ...file, url })
  }
}
