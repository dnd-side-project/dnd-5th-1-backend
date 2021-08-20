import express from 'express'
import { container } from 'tsyringe'
import { GetUserController } from './controllers/get-user-controller.ts/get-user-controller'
import { UserRepository } from './repositories/user-repository'

const userRouter = express.Router()
container.register('IUserRepository', { useClass: UserRepository })

userRouter.get('/', (request, response) => {
  container.resolve(GetUserController).execute(request, response)
})

export default userRouter
