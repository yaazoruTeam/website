import winston from 'winston';
import path from 'path';
import fs from 'fs';

// יצירת תיקיית לוגים אם לא קיימת
const logDirectory = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// הגדרות פורמט
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// יצירת ה-Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'yaazoru-backend' },
  transports: [
    // שומר לוגים של שגיאות לקובץ error.log
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error'
    }),

    // שומר את כל הלוגים לקובץ combined.log
    new winston.transports.File({
      filename: path.join(logDirectory, 'combined.log')
    }),
  ],
});

// במצב פיתוח מוסיפים גם הדפסה לקונסול
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

export default logger;
