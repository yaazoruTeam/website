import { Request, Response, NextFunction } from 'express'
import logger, { setUserContext } from '../utils/logger'

// Extend Express Request interface for this file
interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    user_id?: string;
  }
}

export const userContextMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Extract user ID if available (from JWT middleware)
  const userId = req.user?.id || req.user?.user_id
  if (userId) {
    setUserContext(userId)
  }
  
  next()
}
