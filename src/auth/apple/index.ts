import express from 'express'
import { appleCheck, appleSignIn } from './apple.auth'

const appleAuthRouter = express.Router()

appleAuthRouter.post('/apple/signin', appleSignIn)
appleAuthRouter.get('/apple/check', appleCheck)

export default appleAuthRouter
