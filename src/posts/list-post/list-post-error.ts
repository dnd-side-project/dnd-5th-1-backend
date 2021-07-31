import { UseCaseError } from 'core/infra/user-case-error'

export class SomeProperListPostError extends UseCaseError {
  constructor() {
    super('some proper desc message')
  }
}
