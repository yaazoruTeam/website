import express, { Request, Response } from 'express'
import { router } from '@routers/router'
import { errorHandler } from '@middleware/errorHandler'
import config from '@config/index'
import { createSchema } from '@db/schema'

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
    console.log("Creating database schema...");
    await createSchema();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// טיפול בסגירה נכונה
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();