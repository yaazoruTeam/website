import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { HttpError, User, JwtPayload } from '@model'
import config from '@config/index'
import { setUserContext } from '../utils/logger'

// Extend Express Request interface for this file
interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    user_id?: string;
  };
}

const JWT_SECRET = config.jwt.secret

const hasRole = (...roles: Array<User.Model['role']>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

      // Add user info to request
      req.user = {
        id: decoded.user_id,
        user_id: decoded.user_id
      };

      // Set user context for logger
      setUserContext(decoded.user_id);

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
