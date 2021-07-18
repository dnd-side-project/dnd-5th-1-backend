import { generateToken } from 'auth/token/generate-token'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as SigninWithAppleErrors from './signin-with-apple-error'
import {
  SigninWithAppleInputDto,
  SigninWithAppleOutputDto,
} from './signin-wth-apple-dto'

type Response = SigninWithAppleOutputDto | SigninWithAppleErrors.UserNotFound

export class SigninWithApple {
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

        const outputDto: SigninWithAppleOutputDto = {
          user: user,
          accessToken: accessToken,
        }
        return outputDto
      } else {
        return new SigninWithAppleErrors.UserNotFound()
      }
    } catch (error) {
      throw new Error()
    }
  }
}
