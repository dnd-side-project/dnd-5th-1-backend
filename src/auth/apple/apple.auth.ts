import express from 'express'

const appleSignIn = (req: express.Request, res: express.Response): void => {
  const generatedUrl = 'generatedUrl'

  res.redirect(generatedUrl)
  return
}

const appleCheck = (req: express.Request, res: express.Response): void => {
  res.status(200)
  return
}

export { appleSignIn, appleCheck }
