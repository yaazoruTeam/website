import { Request, Response, NextFunction } from 'express'
import logger, { setUserContext } from '../utils/logger'

export const userContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Extract user ID if available (from JWT middleware)
  const userId = req.user?.id || req.user?.user_id
  if (userId) {
    setUserContext(userId)
  }
  
  next()
}
