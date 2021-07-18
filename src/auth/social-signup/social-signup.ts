import { generateToken } from 'auth/token/generate-token'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as SocialSignupError from './social-signup-error'
import {
  SocialSignupInputDto,
  SocialSignupOutputDto,
} from './social-signup-dto'
import { Nickname } from 'users/domain/nickname'
import { ImageUrl } from 'users/domain/image-url'
import { Vendor } from 'users/domain/vendor'
import { VendorType } from '../../users/domain/vendor'
import { User } from 'users/domain/user'

type Response =
  | SocialSignupOutputDto
  | SocialSignupError.UserExists
  | SocialSignupError.InvalidVendor

export class SocialSignup {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  public async execute(inputDto: SocialSignupInputDto): Promise<Response> {
    try {
      const { vendorAccountId } = inputDto

      const nickname = new Nickname(inputDto.nickname)
      const imageUrl = new ImageUrl()
      if (!Vendor.isVendor(inputDto.vendor)) {
        return new SocialSignupError.InvalidVendor()
      }
      const vendor = new Vendor(inputDto.vendor as VendorType)
      const email = inputDto.email ? inputDto.email : ''

      const userExists =
        await this.userRepository.findByVendorAndVendorAccountId(
          vendor,
          vendorAccountId
        )

      if (!userExists) {
        const user = await this.userRepository.createAndSave(
          new User({
            nickname,
            email,
            imageUrl,
            vendor,
            vendorAccountId,
          })
        )

        if (user) {
          const accessToken = await generateToken(
            {
              subject: 'accessToken',
              userId: user.id,
            },
            {
              expiresIn: '15d',
            }
          )

          const outputDto: SocialSignupOutputDto = {
            user: user,
            accessToken: accessToken,
          }

          return outputDto
        } else {
          throw new Error()
        }
      } else {
        return new SocialSignupError.UserExists()
      }
    } catch (error) {
      throw new Error()
    }
  }
}
