import express from 'express'
import { verifyToken } from '../auth/token/verify-token'

export const jwtCheck = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // read the token from headers
  const token = req.headers.authorization?.split(' ')[1]
  console.log(`authorization header: ${token}`)

  // token does not exist
  if (!token) {
    return res.status(401).json({
      message: 'User not logged in',
    })
  }
  // process the promise
  try {
    const jwtPayload = await verifyToken(token)
    console.log(`JWT verified. Payload: ${JSON.stringify(jwtPayload, null, 4)}`)
    req.user = jwtPayload.userId.value
  } catch (error) {
    // if it has failed to verify, it will return an error message
    console.log(`JWT verification error: ${error}`)
    return res.status(401).json({
      message: 'accessToken expired',
    })
  }

  next()
}
