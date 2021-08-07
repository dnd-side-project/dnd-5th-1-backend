import { UseCaseError } from '../../../src/core/infra/user-case-error'

export class InvalidCategory extends UseCaseError {
  constructor() {
    super('Invalid Vote Category')
  }
}

export class AlreadyExists extends UseCaseError {
  constructor() {
    super('Invalid Vote Category')
  }
}
