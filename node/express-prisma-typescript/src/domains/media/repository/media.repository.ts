import { FileDTO } from '@domains/media/dto'

export interface MediaRepository {
  create: (userId: string, fileName: string, model: string) => Promise<FileDTO>
  deleteByPath: (path: string) => Promise<void>
  getByPath: (path: string) => Promise<FileDTO | null>
}
