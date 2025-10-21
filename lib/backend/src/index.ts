import express, { Request, Response } from 'express'
import { router } from '@routers/router'
import { errorHandler } from '@middleware/errorHandler'
import config from '@config/index'
import logger from '@utils/logger'

// Import express type extensions globally
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        user_id: string;
        role?: string;
      };
    }
  }
}

const cors = require('cors')

const app = express()
const PORT = config.server.port

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint לDocker
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(router)
app.use(errorHandler)

// פונקציה להפעלת השרת
const startServer = async () => {
  try {
    // No more migrations here - they run in separate Docker service
    logger.info("🚀 Starting server...");
    
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
      logger.info(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// טיפול בסגירה נכונה
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();