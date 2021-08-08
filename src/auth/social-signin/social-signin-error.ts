import { UseCaseError } from 'core/infra/use-case-error'

export class UserNotFound extends UseCaseError {
  constructor() {
    super('User Not Found')
  }
}

export class InvalidVendor extends UseCaseError {
  constructor() {
    super('Invalid Vendor, please provide either "Kakao" or "Apple"')
  }
}
