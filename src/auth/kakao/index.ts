import express from 'express'
import { kakaoCheck, kakaoSignIn } from './kakao.auth'

const kakaoAuthRouter = express.Router()

kakaoAuthRouter.post('/apple/signin', kakaoSignIn)
kakaoAuthRouter.get('/apple/check', kakaoCheck)

export default kakaoAuthRouter
