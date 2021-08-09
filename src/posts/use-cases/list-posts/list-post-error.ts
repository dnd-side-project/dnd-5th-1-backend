import { UseCaseError } from 'core/infra/use-case-error'

export class SomeProperListPostError extends UseCaseError {
  constructor() {
    super('some proper desc message')
  }
}
