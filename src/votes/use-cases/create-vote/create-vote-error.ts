import { UseCaseError } from '../../../core/infra/use-case-error'

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
