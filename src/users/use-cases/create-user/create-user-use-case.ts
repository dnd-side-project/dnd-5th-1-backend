import { IUserRepository } from '../../repositories/user-repository.interface'
import { UserRepository } from '../../repositories/user-repository'
import { CreateUserDTO } from '../../controllers/create-user-controller/create-user-dto'
import { User } from 'users/domain/user'

export class CreateUserUseCase {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(req: CreateUserDTO): Promise<any> {
    const { vendor, vendorAccountId, username, email } = req

    // const user = new User({
    //   name: username,
    //   email: email,
    // })

    const userAlreadyExists = await this.userRepository.exists(id)

    if (userAlreadyExists) {
      throw userAlreadyExists
      console.log('user already exists')
    }

    try {
      await this.userRepository.save({
        name: "sdfsfd",
        image_url: "sdsdf",
        email: "sdfsdf"
      })

      console.log('user successfully saved')
    } catch (error) {
      console.log('user save failed')
      //throw error
    }

    // return ok
    return
  }
}
