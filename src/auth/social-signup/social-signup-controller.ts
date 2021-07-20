import { BaseController } from 'core/infra/base-controller'
import { UseCaseError } from '../../core/infra/user-case-error'
import { UserExists } from './social-signup-error'
import {
  SocialSignupInputDto,
  SocialSignupOutputDto,
} from './social-signup-dto'
import { SocialSignup } from './social-signup'

export class SocialSignupController extends BaseController {
  private useCase: SocialSignup

  constructor(useCase: SocialSignup) {
    super()
    this.useCase = useCase
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
          profilePictureImage: outputDto.user.imageUrl,
          nickname: outputDto.user.nickname,
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
