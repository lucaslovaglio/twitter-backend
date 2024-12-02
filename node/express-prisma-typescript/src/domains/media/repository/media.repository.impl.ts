import { MediaRepository } from '@domains/media/repository/media.repository'
import { FileDTO } from '@domains/media/dto'
import { PrismaClient } from '@prisma/client'

export class MediaRepositoryImpl implements MediaRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, fileName: string, model: string): Promise<FileDTO> {
    const file = await this.db.file.create({
      data: {
        name: fileName,
        path: `/${model}/${fileName}`,
        createdById: userId
      }
    })
    return new FileDTO(file)
  }

  async deleteByPath (path: string): Promise<void> {
    await this.db.file.delete({
      where: {
        path
      }
    })
  }

  async getByPath (path: string): Promise<FileDTO | null> {
    const file = await this.db.file.findUnique({
      where: {
        path
      }
    })
    return (file != null) ? new FileDTO(file) : null
  }
}
