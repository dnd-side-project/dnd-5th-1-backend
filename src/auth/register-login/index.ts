import { SigninWithApple } from './signin-with-apple'
import { userRepository } from 'users/repositories'
import { SigninWithAppleController } from './signin-with-apple-controller'
import { Signup } from './signup'
import { SignupController } from './sigup-controller'

const signinWithApple = new SigninWithApple(userRepository)
const signinWithAppleController = new SigninWithAppleController(signinWithApple)

const signup = new Signup(userRepository)
const signupController = new SignupController(signup)

export { signinWithAppleController, signupController }
