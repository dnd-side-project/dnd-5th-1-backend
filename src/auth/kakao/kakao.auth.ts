import express from 'express'

const kakaoSignIn = (req: express.Request, res: express.Response) => {
  //
}

const kakaoCheck = (req: express.Request, res: express.Response) => {
  return res.send("ok")
}

export { kakaoSignIn, kakaoCheck }
