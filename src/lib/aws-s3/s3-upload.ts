import AWS from 'aws-sdk'

const awsCredentials = new AWS.Credentials(
  process.env.ACCESS_KEY_ID,
  process.env.SECRET_ACCESS_KEY
)
AWS.config.credentials = awsCredentials
AWS.config.region = 'ap-northeast-2'

const S3 = new AWS.S3()

export interface ImageFile {
  originalname: string
  mimetype: string
  buffer: Buffer
}
type FileType = Express.Multer.File | ImageFile

export const s3upload = (file: FileType) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.originalname,
        ContentType: file.mimetype,
        Body: file.buffer,
      }

      S3.upload(uploadParams, (error, data) => {
        if (error) {
          reject(error)
          return
        }
        if (data === undefined) {
          reject(new Error('Failed to upload file'))
        } else {
          resolve(data.Location)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}
