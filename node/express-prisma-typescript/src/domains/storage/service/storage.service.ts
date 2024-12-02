export interface StorageService {
  generateUploadUrl: (filePath: string) => Promise<string>
  generateDownloadUrl: (filePath: string) => Promise<string>
  deleteFile: (filePath: string) => Promise<void>
}
