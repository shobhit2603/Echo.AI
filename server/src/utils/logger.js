import winston from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for local development
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Include stack trace in errors
    process.env.NODE_ENV === 'production' ? json() : combine(colorize(), logFormat)
  ),
  transports: [
    new winston.transports.Console()
  ],
});

export default logger;
