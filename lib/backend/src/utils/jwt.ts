import { JwtPayload } from '@model'
import jwt from 'jsonwebtoken'
import config from '@config/index'

const JWT_SECRET = config.jwt.secret

const generateToken = (userId: number | undefined, role: string): string => {
  const payload = { user_id: userId, role: role }
  const options = { expiresIn: 3600 }

  const token = jwt.sign(payload, JWT_SECRET, options)
  return token
}

const verifyToken = (token: string): { valid: boolean; decoded?: JwtPayload.Model } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload.Model
    return { valid: true, decoded }
  } catch (error: unknown) {
    return { valid: false }
  }
}

export { generateToken, verifyToken }
