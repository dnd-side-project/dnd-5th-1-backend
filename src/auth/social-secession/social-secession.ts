import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as SocialSecessionErrors from './social-secession-error'
import {
  SocialSecessionInputDto,
} from './social-secession-dto'
import { inject, injectable } from 'tsyringe'

type Response =
  | boolean
  | SocialSecessionErrors.InvalidParameters

@injectable()
export class SocialSecession {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  public async execute(inputDto: SocialSecessionInputDto): Promise<Response> {
    try {

        const result = await this.userRepository.deleteUser({
            vendor: inputDto.vendor,
            vendorAccountId: inputDto.vendorAccountId
        })

        if (!result) {
            return new SocialSecessionErrors.InvalidParameters()
        }

        return result
    } catch (error) {
      throw new Error()
    }
  }
}
