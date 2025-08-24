// Global type declarations for Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        user_id?: string;
      };
    }
  }
}

export {}; // Make this a module
