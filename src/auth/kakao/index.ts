import express from 'express'
import { signinWithKakaoController } from './singin-with-kakao'

const kakaoAuthRouter = express.Router()

kakaoAuthRouter.post('/kakao/signin', (request, response) =>
  signinWithKakaoController.execute(request, response)
)

export default kakaoAuthRouter
