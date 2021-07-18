import { SigninWithKakao } from './signin-with-kakao'
import { userRepository } from 'users/repositories'
import { SigninWithKakaoController } from './signin-with-kakao-controller'

const signinWithKakao = new SigninWithKakao(userRepository)
const signinWithKakaoController = new SigninWithKakaoController(signinWithKakao)

export { signinWithKakaoController }
