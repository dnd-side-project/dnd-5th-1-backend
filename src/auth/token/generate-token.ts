import jwt, { SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export const generateToken = async (
  payload: string | Record<string, unknown> | Buffer,
  options: SignOptions = {}
): Promise<string> => {
  console.log(
    `verifyToken env: ${JWT_SECRET}, options: ${JSON.stringify(
      options,
      null,
      4
    )}`
  )

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET Variable is not set')
  }

  const promise = new Promise<string>((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, options, (error, token) => {
      if (error) {
        reject(error)
        return
      }
      if (!token) {
        reject(new Error('Failed to generate token'))
        return
      }
      resolve(token)
    })
  })
  return promise
}
