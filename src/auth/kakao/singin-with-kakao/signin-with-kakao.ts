import { generateToken } from 'auth/token/generate-token'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as SigninWithKakaoErrors from './signin-with-kakao-error'
import {
  SigninWithKakaoInputDto,
  SigninWithKakaoOutputDto,
} from './signin-wth-kakao-dto'

type Response = SigninWithKakaoOutputDto | SigninWithKakaoErrors.UserNotFound

export class SigninWithKakao {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  public async execute(inputDto: SigninWithKakaoInputDto): Promise<Response> {
    try {
      const { vendor, vendorAccountId, email } = inputDto

      const alreadyCreatedUser =
        await this.userRepository.findByVendorAndVendorAccountId(
          vendor,
          vendorAccountId
        )

      if (alreadyCreatedUser) {
        const user = alreadyCreatedUser
        const accessToken = await generateToken(
          {
            subject: 'accessToken',
            userId: user.id,
          },
          {
            expiresIn: '15d',
          }
        )

        const outputDto: SigninWithKakaoOutputDto = {
          user: user,
          accessToken: accessToken,
        }
        return outputDto
      } else {
        return new SigninWithKakaoErrors.UserNotFound()
      }
    } catch (error) {
      throw new Error()
    }
  }
}
