import winston from 'winston';
import path from 'path';
import fs from 'fs';

// יצירת תיקיית לוגים אם לא קיימת
const logDirectory = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// הגדרות פורמט משופר
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

// הגדרת רמת לוגים לפי סביבה
const getLogLevel = (): string => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }
  // במצב פיתוח נרצה לראות debug logs
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

// יצירת ה-Logger
const logger = winston.createLogger({
  level: getLogLevel(),
  format: logFormat,
  defaultMeta: { service: 'yaazoru-backend' },
  transports: [
    // שומר לוגים של שגיאות לקובץ error.log
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error'
    }),

    // שומר את כל הלוגים לקובץ combined.log (כולל debug בפיתוח)
    new winston.transports.File({
      filename: path.join(logDirectory, 'combined.log'),
      level: getLogLevel()
    }),
  ],
});

// במצב פיתוח מוסיפים גם הדפסה לקונסול
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: getLogLevel(), // גם הקונסול יכבד את רמת הלוג
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

// פונקציות לשליטה דינמית ברמת הלוג
export const setLogLevel = (level: string) => {
  logger.level = level;
  logger.info(`Log level changed to: ${level}`);
};

export const getCurrentLogLevel = () => {
  return logger.level;
};

export default logger;
