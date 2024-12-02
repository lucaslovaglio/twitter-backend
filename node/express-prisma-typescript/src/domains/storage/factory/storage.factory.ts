import { StorageService, StorageServiceAwsImpl } from '@domains/storage/service'

export const awsService: StorageService = new StorageServiceAwsImpl()
