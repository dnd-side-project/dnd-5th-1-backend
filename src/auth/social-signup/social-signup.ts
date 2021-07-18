import { generateToken } from 'auth/token/generate-token'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as SocialSignupError from './social-signup-error'
import {
  SocialSignupInputDto,
  SocialSignupOutputDto,
} from './social-signup-dto'

type Response = SocialSignupOutputDto | SocialSignupError.UserExists

export class SocialSignup {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  public async execute(inputDto: SocialSignupInputDto): Promise<Response> {
    try {
      const { nickname, vendor, vendorAccountId, email } = inputDto

      const checkUserExists =
        await this.userRepository.findByVendorAndVendorAccountId(
          vendor,
          vendorAccountId
        )

      if (!checkUserExists) {
        // const user = await this.userRepository.createUser(
        //   nickname,
        //   vendor,
        //   vendorAccountId,
        //   email,
        // )

        // const user = new User({
        //   nickname,
        //   vendor,
        //   vendorAccountId,
        //   email,
        // })

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
          //this.userRepo.save(user)
          const outputDto: SocialSignupOutputDto = {
            user: user,
            accessToken: accessToken,
          }

          return outputDto
        }
      } else {
        return new SocialSignupError.UserExists()
      }
    } catch (error) {
      throw new Error()
    }
  }
}
