import { BaseController } from 'core/infra/base-controller'
import { UseCaseError } from '../../core/infra/user-case-error'
import { UserExists } from './signup-error'
import { SignupInputDto, SignupOutputDto } from './signup-dto'
import { Signup } from './signup'

export class SignupController extends BaseController {
  private useCase: Signup

  constructor(useCase: Signup) {
    super()
    this.useCase = useCase
  }

  async executeImpl(): Promise<any> {
    const dto: SignupInputDto = this.req
      .body as SignupInputDto

    try {
      const result = await this.useCase.execute(dto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case UserExists:
            return this.alreadyExists(result.message)
        }
      } else {
        const outputDto: SignupOutputDto = result

        this.res.set({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + outputDto.accessToken,
        })

        return this.ok(this.res, 200, {
          profilePictureImage: outputDto.user.image_url,
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
