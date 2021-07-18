import { BaseController } from 'core/infra/base-controller'
import { SigninWithKakao as SigninWithKakao } from './signin-with-kakao'
import { UseCaseError } from '../../../core/infra/user-case-error'
import {
  SigninWithKakaoInputDto,
  SigninWithKakaoOutputDto,
} from './signin-wth-kakao-dto'
import * as SigninWithKakaoErrors from './signin-with-kakao-error'

export class SigninWithKakaoController extends BaseController {
  private useCase: SigninWithKakao

  constructor(useCase: SigninWithKakao) {
    super()
    this.useCase = useCase
  }

  async executeImpl(): Promise<any> {
    const dto: SigninWithKakaoInputDto = this.req
      .body as SigninWithKakaoInputDto

    try {
      const result = await this.useCase.execute(dto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case SigninWithKakaoErrors.UserNotFound:
            return this.notFound(result.message)
        }
      } else {
        const outputDto: SigninWithKakaoOutputDto = result

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
