import { inject, injectable } from 'tsyringe'
import { UniqueEntityId } from 'core/infra/unique-entity-id'
import {
  GetUserInputDto,
  GetUserOutputDto,
} from 'users/controllers/get-user-controller.ts/get-user-dto'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import * as GetUserError from 'users/use-cases/get-user/get-user-error'

type Response = GetUserOutputDto | GetUserError.InvalidUserId

@injectable()
export class GetUser {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
  ) {}

  public async execute(inputDto: GetUserInputDto): Promise<Response> {
    const userId = new UniqueEntityId(inputDto.userId)

    const user = await this.userRepository.findUserById(userId)
    if (!user) {
      return new GetUserError.InvalidUserId()
    }

    let userProfile
    try {
      userProfile = await this.userRepository.getUserProfile(user)
    } catch (error) {
      return new Error(`get user failed, userId: ${userId.toString()}}`)
    }

    const outputDto: GetUserOutputDto = {
      numOfCreatedPosts: userProfile.numOfCreatedPosts,
      numOfAttendedPosts: userProfile.numOfAttendedPosts,
    }
    return outputDto
  }
}
