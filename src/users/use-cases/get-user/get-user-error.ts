import { UseCaseError } from 'core/infra/use-case-error'

export class InvalidUserId extends UseCaseError {
  constructor() {
    super('Invalid User Id')
  }
}
