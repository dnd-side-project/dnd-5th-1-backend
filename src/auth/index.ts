import express from 'express'
import { signinWithAppleController, signupController } from './register-login'

const authRouter = express.Router()

authRouter.post('/signin', (request, response) =>
  signinWithAppleController.execute(request, response)
)

authRouter.post('/signup', (request, response) =>
  signupController.execute(request, response)
)

export default authRouter
