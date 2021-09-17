import express, { response } from 'express'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { UserRepository } from 'users/repositories/user-repository'
import { SocialSignupController } from './social-signup/social-signup-controller'
import { SocialSigninController } from './social-signin/social-signin-controller'
import { SocialSecessionController } from './social-secession/social-secession-controller'

const authRouter = express.Router()
container.register('IUserRepository', { useClass: UserRepository })

authRouter.post('/signin', (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(SocialSigninController).execute(request, response)
})

authRouter.post('/signup', (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(SocialSignupController).execute(request, response)
})

authRouter.delete('/secession', (request, response) => {
  console.log(`request body at router: ${request.body}`)
  container.resolve(SocialSecessionController).execute(request, response)
})

export default authRouter
