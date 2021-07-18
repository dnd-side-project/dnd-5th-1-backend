import express from 'express'
import { signinWithAppleController } from './singin-with-apple'

const appleAuthRouter = express.Router()

appleAuthRouter.post('/apple/signin', (request, response) =>
  signinWithAppleController.execute(request, response)
)

export default appleAuthRouter
