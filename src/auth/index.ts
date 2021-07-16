import express from 'express'
import appleAuthRouter from './apple'
import { kakaoAuthRouter } from './kakao/index'

const authRouter = express.Router()

// authRouter.use('/token')
authRouter.use('/apple', appleAuthRouter)
authRouter.use('/kakao', kakaoAuthRouter)

export default authRouter
