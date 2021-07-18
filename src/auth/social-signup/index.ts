import { userRepository } from 'users/repositories'
import { SocialSignup } from './social-signup'
import { SocialSignupController } from './social-signup-controller'

const socialSignup = new SocialSignup(userRepository)
const socialSignupController = new SocialSignupController(socialSignup)

export { socialSignup, socialSignupController }
