import { StorageService } from '@domains/storage/service/storage.service'
import AWS from 'aws-sdk'
import { Constants } from '@utils'

export class StorageServiceAwsImpl implements StorageService {
  private readonly s3: AWS.S3
  private readonly bucketName: string

  constructor () {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION
    })
    this.bucketName = Constants.S3_BUCKET_NAME
  }

  async generateUploadUrl (fileName: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Expires: 60 * 60
    }

    return await this.s3.getSignedUrlPromise('putObject', params)
  }

  async generateDownloadUrl (fileName: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Expires: 60 * 60
    }

    return await this.s3.getSignedUrlPromise('getObject', params)
  }

  async deleteFile (fileName: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName
    }

    await this.s3.deleteObject(params).promise()
    console.log(`File ${fileName} deleted from bucket ${this.bucketName}.`)
  }
}
