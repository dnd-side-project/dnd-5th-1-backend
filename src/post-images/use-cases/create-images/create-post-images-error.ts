import { UseCaseError } from 'core/infra/user-case-error'

export class S3UploadFailed extends UseCaseError {
  constructor() {
    super('S3 image upload failed')
  }
}

export class PostImageExists extends UseCaseError {
  constructor() {
    super('PostImage Already Exists')
  }
}

export class InvalidExtension extends UseCaseError {
  constructor() {
    super('Invalid Extension, must be among JPEG, JPG, PNG')
  }
}
