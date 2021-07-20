import express from 'express'
import { socialSigninController } from './social-signin'
import { socialSignupController } from './social-signup'

const authRouter = express.Router()

authRouter.post('/signin', (request, response) => {
  console.log(`request body at router: ${request.body}`)
  socialSigninController.execute(request, response)
})

authRouter.post('/signup', (request, response) => {
  console.log(`request body at router: ${request.body}`)
  socialSignupController.execute(request, response)
})

export default authRouter
