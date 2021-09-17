import { BaseController } from 'core/infra/base-controller'
import { SocialSecession } from './social-secession'
import { UseCaseError } from '../../core/infra/use-case-error'
import {
    SocialSecessionInputDto,
  } from './social-secession-dto'
import * as SocialSecessionErrors from './social-secession-error'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
export class SocialSecessionController extends BaseController {
  constructor(private useCase: SocialSecession) {
    super()
  }

  async executeImpl(): Promise<any> {
    const dto: SocialSecessionInputDto = this.req.body as SocialSecessionInputDto

    try {
      const result = await this.useCase.execute(dto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case SocialSecessionErrors.InvalidParameters:
            return this.clientError(result.message)
        }
      } else {

        this.res.set({
          'Content-Type': 'application/json'
        })

        return this.ok(this.res, 200)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
