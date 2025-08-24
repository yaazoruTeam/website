import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { AsyncLocalStorage } from 'async_hooks';

// Create log directory if it does not exist
const logDirectory = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// AsyncLocalStorage for user context
const userContext = new AsyncLocalStorage<{ userId?: string }>();

// Function to get current user ID
const getCurrentUserId = (): string | undefined => {
  const context = userContext.getStore();
  return context?.userId;
};

// Function to set user ID for current context (used internally)
export const setUserContext = (userId: string): void => {
  userContext.enterWith({ userId });
};

// Function to run code with user context
export const withUser = <T>(userId: string, fn: () => T): T => {
  return userContext.run({ userId }, fn);
};

// Enhanced format settings
const logFormat = winston.format.combine(
  winston.format.timestamp({ 
    format: () => new Date().toLocaleString('he-IL', {
      timeZone: 'Asia/Jerusalem',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1 $4')
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(), // מאפשר הדפסה של אובייקטים
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    // Get current user ID - exactly like getting timestamp
    const userId = getCurrentUserId();
    const userInfo = userId ? ` [User: ${userId}]` : '';
    
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return stack
      ? `[${timestamp}]${userInfo} ${level}: ${message}${metaString}\n${stack}`
      : `[${timestamp}]${userInfo} ${level}: ${message}${metaString}`;
  })
);

// Define log level based on environment
const getLogLevel = (): string => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }
  // In development mode we want to see debug logs
  return process.env.NODE_ENV === 'production' ? 'info' : 'silly';
};

// Create the logger
const logger = winston.createLogger({
  level: getLogLevel(),
  format: logFormat,
  defaultMeta: { service: 'yaazoru-backend' },
  transports: [
    // Save error logs to error.log file
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error'
    }),

    // Save all logs to combined.log file (including debug in development)
    new winston.transports.File({
      filename: path.join(logDirectory, 'combined.log'),
      level: getLogLevel()
    }),
  ],
});

// In development mode we want to see debug logs
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: getLogLevel(), // Also respect log level in console
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
          // Get current user ID for console too
          const userId = getCurrentUserId();
          const userInfo = userId ? ` [User: ${userId}]` : '';
          
          const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
          return stack
            ? `[${timestamp}]${userInfo} ${level}: ${message}${metaString}\n${stack}`
            : `[${timestamp}]${userInfo} ${level}: ${message}${metaString}`;
        })
      )
    })
  );
}

// Functions for dynamic control over log level
export const setLogLevel = (level: string) => {
  logger.level = level;
  logger.info(`Log level changed to: ${level}`);
};

export const getCurrentLogLevel = () => {
  return logger.level;
};

export default logger;
