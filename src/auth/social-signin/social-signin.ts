import { generateToken } from 'auth/token/generate-token'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as SocialSigninErrors from './social-signin-error'
import {
  SocialSigninInputDto,
  SocialSigninOutputDto as SocialSigninOutputDto,
} from './social-signin-dto'
import { Vendor, VendorType } from 'users/domain/vendor'
import { inject, injectable } from 'tsyringe'

type Response =
  | SocialSigninOutputDto
  | SocialSigninErrors.UserNotFound
  | SocialSigninErrors.InvalidVendor

@injectable()
export class SocialSignin {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  public async execute(inputDto: SocialSigninInputDto): Promise<Response> {
    try {
      const { vendorAccountId } = inputDto
      if (!Vendor.isVendor(inputDto.vendor)) {
        return new SocialSigninErrors.InvalidVendor()
      }
      const vendor = new Vendor(inputDto.vendor as VendorType)
      console.log(`signin vendor: ${JSON.stringify(vendor, null, 4)}`)

      const alreadyCreatedUser =
        await this.userRepository.findByVendorAndVendorAccountId(
          vendor,
          vendorAccountId
        )

      console.log(
        `signin alreadyCreatedUser: ${JSON.stringify(vendor, null, 4)}`
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
