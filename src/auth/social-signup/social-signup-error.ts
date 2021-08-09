import { UseCaseError } from 'core/infra/use-case-error'

export class UserExists extends UseCaseError {
  constructor() {
    super('User Already Exists')
  }
}

export class InvalidVendor extends UseCaseError {
  constructor() {
    super('Invalid Vendor, please provide either "Kakao" or "Apple"')
  }
}
