import { BaseController } from 'core/infra/base-controller'
import { SigninWithApple } from './signin-with-apple'
import { UseCaseError } from '../../core/infra/user-case-error'
import {
  SigninWithAppleInputDto,
  SigninWithAppleOutputDto,
} from './signin-wth-apple-dto'
import * as SigninWithAppleErrors from './signin-with-apple-error'

export class SigninWithAppleController extends BaseController {
  private useCase: SigninWithApple

  constructor(useCase: SigninWithApple) {
    super()
    this.useCase = useCase
  }

  async executeImpl(): Promise<any> {
    const dto: SigninWithAppleInputDto = this.req
      .body as SigninWithAppleInputDto

    try {
      const result = await this.useCase.execute(dto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case SigninWithAppleErrors.UserNotFound:
            return this.notFound(result.message)
        }
      } else {
        const outputDto: SigninWithAppleOutputDto = result

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
