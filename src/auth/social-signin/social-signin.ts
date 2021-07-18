import { generateToken } from 'auth/token/generate-token'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as SocialSigninErrors from './social-signin-error'
import {
  SocialSigninInputDto,
  SocialSigninOutputDto as SocialSigninOutputDto,
} from './social-signin-dto'
import { Vendor, VendorType } from 'users/domain/vendor'

type Response =
  | SocialSigninOutputDto
  | SocialSigninErrors.UserNotFound
  | SocialSigninErrors.InvalidVendor

export class SocialSignin {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  public async execute(inputDto: SocialSigninInputDto): Promise<Response> {
    try {
      const { vendorAccountId } = inputDto
      if (!Vendor.isVendor(inputDto.vendor)) {
        return new SocialSigninErrors.InvalidVendor()
      }
      const vendor = new Vendor(inputDto.vendor as VendorType)

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
