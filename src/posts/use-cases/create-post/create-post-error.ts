import { UseCaseError } from 'core/infra/user-case-error'

export class InvalidTitle extends UseCaseError {
  constructor() {
    super(
      'Invalid title provided. Please input title between 1 and 50 characters.'
    )
  }
}

export class InvalidDescription extends UseCaseError {
  constructor() {
    super(
      'Invalid description provided. Please input description between 1 and 200 characters.'
    )
  }
}
