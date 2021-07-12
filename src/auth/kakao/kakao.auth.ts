import express from 'express'

const kakaoSignIn = (req: express.Request, res: express.Response) => {
  const generatedUrl = 'generatedUrl'

  return res.redirect(generatedUrl)
}

const kakaoCheck = (req: express.Request, res: express.Response) => {
  res.status(200)
  return
}

export { kakaoSignIn, kakaoCheck }
