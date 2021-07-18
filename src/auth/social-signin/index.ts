import { SocialSignin } from './social-signin'
import { userRepository } from 'users/repositories'
import { SocialSigninController } from './social-signin-controller'

const socialSignin = new SocialSignin(userRepository)
const socialSigninController = new SocialSigninController(socialSignin)

export { socialSignin, socialSigninController }
