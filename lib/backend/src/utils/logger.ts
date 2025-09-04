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

// ✅ CHANGE: JSON format for file logs (suitable for Datadog Agent)
const jsonFileFormat = winston.format.combine(
  winston.format.timestamp({ format: () => new Date().toLocaleString('he-IL',{
    timeZone: 'Asia/Jerusalem',
    year:'2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/(d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\(d{2})/, '$3-$2-$1 $4'),
}),
  winston.format.errors({ stack: true }),
  // ✅ Add userId to log info
  winston.format((info) => {
    const userId = getCurrentUserId();
    if (userId) {
      info.userId = userId;
    }
    return info;
  })(),
  // ✅ Custom JSON formatter to ensure proper JSON output
  winston.format.printf((info) => {
    const logObject: Record<string, any> = {
      timestamp: info.timestamp,
      level: info.level,
      message: info.message,
      service: info.service || 'yaazoru-backend'
    };

    // Add userId if exists
    if (info.userId) {
      logObject.userId = info.userId;
    }

    // Add stack trace if exists
    if (info.stack) {
      logObject.stack = info.stack;
    }

    // Add any additional metadata
    Object.keys(info).forEach(key => {
      if (!['timestamp', 'level', 'message', 'service', 'userId', 'stack', 'splat', Symbol.for('level'), Symbol.for('message')].includes(key)) {
        logObject[key] = info[key];
      }
    });

    return JSON.stringify(logObject);
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
  format: jsonFileFormat, // ✅ שימוש בפורמט JSON לקבצים
  defaultMeta: { service: 'yaazoru-backend' },
  transports: [
    // Save error logs to error.log file
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
      format: jsonFileFormat // ✅ JSON עבור קובץ השגיאות
    }),

    // Save all logs to combined.log file (including debug in development)
    new winston.transports.File({
      filename: path.join(logDirectory, 'combined.log'),
      level: getLogLevel(),
      format: jsonFileFormat // ✅ JSON עבור קובץ הלוגים המשולב
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
} else {
  // ✅ בפרודקשן - גם הקונסול יהיה בפורמט JSON
  logger.add(
    new winston.transports.Console({
      level: getLogLevel(),
      format: jsonFileFormat
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
