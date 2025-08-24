import { Request, Response, NextFunction } from 'express';
import logger, { setUserContext } from '../utils/logger';

// Extend Express Request interface for this file
interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    user_id?: string;
  };
}

export const userContextMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Extract user ID if available (from JWT middleware)
  logger.debug('1111 UserContext Middleware: Checking for user info in request');
  const userId = req.user?.id || req.user?.user_id;
  logger.debug(`2222 UserContext Middleware: Extracted userId: ${userId}`);
  if (userId) {
    setUserContext(userId);
  }
  
  next();
};
