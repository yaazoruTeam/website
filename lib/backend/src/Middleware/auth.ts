import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { HttpError, User, JwtPayload } from '../model'
import config from '../config'

const JWT_SECRET = config.jwt.secret

const hasRole = (...roles: Array<User.Model['role']>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
      const error: HttpError.Model = {
        status: 403,
        message: 'Access denied - missing token',
      }
      return next(error)
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload.Model

      if (!roles.includes(decoded.role)) {
        const error: HttpError.Model = {
          status: 403,
          message: `Access denied - role '${decoded.role}' not authorized`,
        }
        return next(error)
      }

      next()
    } catch (error) {
      const err: HttpError.Model = {
        status: 401,
        message: 'Invalid or expired token',
      }
      return next(err)
    }
  }
}

export { hasRole }
