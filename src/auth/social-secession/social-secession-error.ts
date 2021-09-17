import { UseCaseError } from 'core/infra/use-case-error'

export class InvalidParameters extends UseCaseError {
  constructor() {
    super('Invalid parameters"')
  }
}
