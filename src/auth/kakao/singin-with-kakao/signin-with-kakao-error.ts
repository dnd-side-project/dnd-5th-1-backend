import { UseCaseError } from 'core/infra/user-case-error'

export class UserNotFound extends UseCaseError {
  constructor() {
    super('User Not Found')
  }
}
