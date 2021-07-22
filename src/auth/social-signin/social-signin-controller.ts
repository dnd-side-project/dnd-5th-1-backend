import { BaseController } from 'core/infra/base-controller'
import { SocialSignin } from './social-signin'
import { UseCaseError } from '../../core/infra/user-case-error'
import {
  SocialSigninInputDto,
  SocialSigninOutputDto,
} from './social-signin-dto'
import * as SocialSigninErrors from './social-signin-error'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
export class SocialSigninController extends BaseController {
  constructor(private useCase: SocialSignin) {
    super()
  }

  async executeImpl(): Promise<any> {
    const dto: SocialSigninInputDto = this.req.body as SocialSigninInputDto

    try {
      const result = await this.useCase.execute(dto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case SocialSigninErrors.UserNotFound:
            return this.notFound(result.message)
        }
      } else {
        const outputDto: SocialSigninOutputDto = result

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
