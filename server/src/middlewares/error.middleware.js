import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Log the error using Winston
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  if (process.env.NODE_ENV !== 'production') {
    // In dev, log the stack trace to console explicitly
    logger.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
