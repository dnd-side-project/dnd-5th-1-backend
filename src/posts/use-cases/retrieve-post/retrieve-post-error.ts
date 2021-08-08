import { UseCaseError } from 'core/infra/use-case-error'

export class NotFound extends UseCaseError {
  constructor() {
    super('Post matching the id not found')
  }
}
