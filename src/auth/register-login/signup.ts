import { generateToken } from 'auth/token/generate-token'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as SignupError from './signup-error'
import {
  SignupInputDto,
  SignupOutputDto,
} from './signup-dto'

type Response = SignupOutputDto | SignupError.UserExists

export class Signup {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  public async execute(inputDto: SignupInputDto): Promise<Response> {
    try {
      const { nickname, vendor, vendorAccountId, email, imageUrl } = inputDto

      const checkUserExists =
        await this.userRepository.findByVendorAndVendorAccountId(
          vendor,
          vendorAccountId
        )

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

          const outputDto: SignupOutputDto = {
            user: user,
            accessToken: accessToken,
          }
          return outputDto
        }
      } else {
        return new SignupError.UserExists()
      }
    } catch (error) {
      throw new Error()
    }
  }
}
