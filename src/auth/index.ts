import express from 'express'
import { socialSigninController } from './social-signin'
import { socialSignupController } from './social-signup'

const authRouter = express.Router()

authRouter.post('/signin', (request, response) =>
  socialSigninController.execute(request, response)
)

authRouter.post('/signup', (request, response) =>
  socialSignupController.execute(request, response)
)

export default authRouter
