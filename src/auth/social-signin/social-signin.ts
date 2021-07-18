import { generateToken } from 'auth/token/generate-token'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as SocialSigninErrors from './social-signin-error'
import {
  SigninWithAppleInputDto,
  SigninWithAppleOutputDto as SocialSigninOutputDto,
} from './social-signin-dto'

type Response = SocialSigninOutputDto | SocialSigninErrors.UserNotFound

export class SocialSignin {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  public async execute(inputDto: SigninWithAppleInputDto): Promise<Response> {
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

        const outputDto: SocialSigninOutputDto = {
          user: user,
          accessToken: accessToken,
        }
        return outputDto
      } else {
        return new SocialSigninErrors.UserNotFound()
      }
    } catch (error) {
      throw new Error()
    }
  }
}
