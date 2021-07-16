import express, { Request, Response } from 'express'
import { kakaoCheck, kakaoSignIn } from './kakao.auth'
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config()

const KakaoStrategy = require('passport-kakao').Strategy;
const kakaoAuthRouter = express.Router()

passport.use('kakao', new KakaoStrategy({
  clientID: process.env.KAKAO_REST_API_KEY,
  clientSecret: '',
  callbackURL: process.env.KAKAO_CALLBACK
},
(accessToken: string, refreshToken: string, profile: any, done: any) => {
  console.log(profile)
  return done(null, profile)
}));

kakaoAuthRouter.get('/signin',
  passport.authenticate('kakao'),
);

// 콜백 url 로 리다이렉트 되었을 떄
kakaoAuthRouter.get('/callback',
  passport.authenticate('kakao', {
    session: false // session 은 사용하지 않음 (자사 JWT 사용)
  }),
  (req: Request, res: Response) => {
    res.redirect('/health')
  }
);

export { kakaoAuthRouter, passport }
