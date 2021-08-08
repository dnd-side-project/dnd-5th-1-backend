import { BaseController } from 'core/infra/base-controller'
import { UseCaseError } from '../../core/infra/use-case-error'
import { UserExists } from './social-signup-error'
import {
  SocialSignupInputDto,
  SocialSignupOutputDto,
} from './social-signup-dto'
import { SocialSignup } from './social-signup'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
export class SocialSignupController extends BaseController {
  constructor(private useCase: SocialSignup) {
    super()
  }

  async executeImpl(): Promise<any> {
    console.log(`request body: ${this.req.body}`)
    const dto: SocialSignupInputDto = this.req.body as SocialSignupInputDto
    console.log(`input dto: ${this.req.body}`)
    try {
      const result = await this.useCase.execute(dto)
      console.log(`Signin Usecase result: ${result}`)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case UserExists:
            return this.alreadyExists(result.message)
        }
      } else {
        const outputDto: SocialSignupOutputDto = result

        this.res.set({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + outputDto.accessToken,
        })

        return this.ok(this.res, 200, {
          profilePictureImage: outputDto.user.imageUrl.value,
          nickname: outputDto.user.nickname.value,
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
