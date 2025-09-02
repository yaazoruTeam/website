import { User } from '@model'

// Global type declarations for Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        user_id: string;
        role?: User.Model['role'];
      };
    }
  }
}

export {}; // Make this a module
