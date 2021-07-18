import { SigninWithApple } from './signin-with-apple'
import { userRepository } from 'users/repositories'
import { SigninWithAppleController } from './signin-with-apple-controller'

const signinWithApple = new SigninWithApple(userRepository)
const signinWithAppleController = new SigninWithAppleController(signinWithApple)

export { signinWithAppleController }
