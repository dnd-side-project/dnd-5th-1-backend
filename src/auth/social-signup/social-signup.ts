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
import { inject, injectable } from 'tsyringe'

type Response =
  | SocialSignupOutputDto
  | SocialSignupError.UserExists
  | SocialSignupError.InvalidVendor

@injectable()
export class SocialSignup {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  public async execute(inputDto: SocialSignupInputDto): Promise<Response> {
    try {
      const nickname = new Nickname(inputDto.nickname)
      const email = inputDto.email ? inputDto.email : ''
      const imageUrl = new ImageUrl()
      console.log(`imageUrl: ${imageUrl.value}`)
      if (!Vendor.isVendor(inputDto.vendor)) {
        return new SocialSignupError.InvalidVendor()
      }
      const vendor = new Vendor(inputDto.vendor as VendorType)
      const vendorAccountId: string = inputDto.vendorAccountId
      const { nickname, vendor, vendorAccountId, email, imageUrl } = inputDto

      const userExists =
        await this.userRepository.findByVendorAndVendorAccountId(
          vendor,
          vendorAccountId
        )

      if (!userExists) {
        console.log('user not exist, create one')
        const user = await this.userRepository.createAndSave(
          new User({
            nickname,
            email,
            imageUrl,
            vendor,
            vendorAccountId,
          })
        )
        console.log(`User createAndSave result: ${user}`)
      if (!checkUserExists) {
        const user = await this.userRepository.createUser(
          nickname,
          vendor,
          vendorAccountId,
          email,
          imageUrl
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
          throw new Error('User Creation Failed')
        }
        else {
          throw new Error()
        }
      } else {
        return new SocialSignupError.UserExists()
      }
    } catch (error) {
      console.log(error)
      throw new Error('Unexpected Error')
    }
  }
}
