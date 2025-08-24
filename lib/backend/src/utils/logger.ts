import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Create log directory if it does not exist
const logDirectory = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

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
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return stack
      ? `[${timestamp}] ${level}: ${message}${metaString}\n${stack}`
      : `[${timestamp}] ${level}: ${message}${metaString}`;
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
        winston.format.simple()
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
