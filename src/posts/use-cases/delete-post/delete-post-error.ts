import { UseCaseError } from 'core/infra/user-case-error'

export class NotFound extends UseCaseError {
  constructor() {
    super('Post not found. Please check if the postId is valid.')
  }
}

export class NotAuthorized extends UseCaseError {
  constructor() {
    super('Unauthorized to access the resource.')
  }
}
