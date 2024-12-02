import { ExtendedFileDTO } from '@domains/media/dto'

export interface MediaService {
  uploadMedia: (userId: string, model: string, fileName: string) => Promise<ExtendedFileDTO>
  deleteMedia: (userId: string, model: string, fileName: string) => Promise<void>
  getMedia: (userId: string, model: string, fileName: string) => Promise<ExtendedFileDTO>
}
