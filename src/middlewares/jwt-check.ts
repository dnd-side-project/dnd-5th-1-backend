import express from 'express'
import { verifyToken } from '../lib/token/verify-token'

export const jwtCheck = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  console.log(`authorization header: ${token}`)

  if (!token) {
    return res.status(401).json({
      message: 'User not logged in',
    })
  }

  try {
    const jwtPayload = await verifyToken(token)
    console.log(`JWT verified. Payload: ${JSON.stringify(jwtPayload, null, 4)}`)
    req.user = jwtPayload.userId.value
  } catch (error) {
    console.log(`JWT verification error: ${error}`)
    return res.status(401).json({
      message: 'accessToken expired',
    })
  }

  next()
}

export const jwtCheckIfExists = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  console.log(`authorization header: ${token}`)

  try {
    if (token) {
      const jwtPayload = await verifyToken(token)
      console.log(
        `JWT verified. Payload: ${JSON.stringify(jwtPayload, null, 4)}`
      )
      req.user = jwtPayload.userId.value
    } else {
      next()
    }
  } catch (error) {
    console.log(`JWT verification error: ${error}`)
    return res.status(401).json({
      message: 'accessToken expired',
    })
  }

  next()
}
