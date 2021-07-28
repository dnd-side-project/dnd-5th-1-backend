import AWS from 'aws-sdk'

const awsCredentials = new AWS.Credentials(
  process.env.ACCESS_KEY_ID,
  process.env.SECRET_ACCESS_KEY
)
AWS.config.credentials = awsCredentials

const S3 = new AWS.S3()

type FileType =
  // | { [fieldname: string]: Express.Multer.File }
  Express.Multer.File

export const s3upload = (filename: string, file: FileType) => {
  console.log(`uploaded file: ${JSON.stringify(file, null, 4)}`)
  return new Promise((resolve, reject) => {
    try {
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
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
          resolve(data)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}
