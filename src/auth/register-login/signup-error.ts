import { UseCaseError } from 'core/infra/user-case-error'

export class UserExists extends UseCaseError {
  constructor() {
    super('User Already Exists')
  }
}
