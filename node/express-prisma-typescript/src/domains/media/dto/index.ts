export class FileDTO {
  constructor (file: FileDTO) {
    this.id = file.id
    this.name = file.name
    this.path = file.path
    this.createdById = file.createdById
    this.createdAt = file.createdAt
  }

  id: string
  name: string
  path: string
  createdById: string
  createdAt: Date
}

export class ExtendedFileDTO extends FileDTO {
  constructor (file: ExtendedFileDTO) {
    super(file)
    this.url = file.url
  }

  url: string
}
