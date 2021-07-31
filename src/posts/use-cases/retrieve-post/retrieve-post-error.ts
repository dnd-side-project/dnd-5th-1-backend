import { UseCaseError } from 'core/infra/user-case-error'

export class NotFound extends UseCaseError {
  constructor() {
    super('Post matching the id not found')
  }
}
