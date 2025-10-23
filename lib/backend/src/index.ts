import 'reflect-metadata'
import express, { Request, Response } from 'express'
import { router } from '@routers/router'
import { errorHandler } from '@middleware/errorHandler'
import config from '@config/index'
import logger from '@utils/logger'
import { initializeDatabase, closeDatabase } from './data-source'

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
    // Initialize TypeORM database connection
    // זה בעצמו מריץ מיגרציות אוטומטית!
    logger.info('🗄️  Initializing database...')
    await initializeDatabase()
    logger.info('✅ Database initialized successfully')

    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`)
      logger.info(`💚 Health check available at http://localhost:${PORT}/health`)
    })
  } catch (error) {
    logger.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server')
  await closeDatabase()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server')
  await closeDatabase()
  process.exit(0)
})

startServer();