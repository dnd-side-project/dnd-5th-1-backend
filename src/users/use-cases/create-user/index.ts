import { userRepository } from 'users/repositories'
import { CreateUserUseCase } from './create-user-use-case'

const createUserUseCase = new CreateUserUseCase(userRepository)

export { createUserUseCase }
