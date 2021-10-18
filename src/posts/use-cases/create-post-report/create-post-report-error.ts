import { UseCaseError } from 'core/infra/use-case-error'

export class AlreadyReportedPost extends UseCaseError {
  constructor() {
    super('Already reported post')
  }
}
