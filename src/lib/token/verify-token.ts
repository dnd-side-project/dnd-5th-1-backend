import jwt, { Secret } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

interface jwtProps {
  subject: string
  userId: {
    value: string
  }
  iat: number
  exp: number
}

export const verifyToken = async (token: string): Promise<jwtProps> => {
  // create a promise that decodes the token
  console.log(`verifyToken env: ${JWT_SECRET}`)
  const promise = new Promise<jwtProps>((resolve, reject) => {
    jwt.verify(
      token,
      JWT_SECRET as Secret,
      (err: unknown, decoded: unknown) => {
        if (err) reject(err)
        resolve(decoded as jwtProps)
      }
    )
  })
  return promise
}
