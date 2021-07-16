import { createUserUseCase } from 'users/use-cases/create-user'
import { CreateUserController } from './create-user-controller'

const createUserController = new CreateUserController(createUserUseCase)

export { createUserController }
