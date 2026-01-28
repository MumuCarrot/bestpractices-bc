import winston from 'winston';
import { serverConfig } from '../config/server.config.js';

/**
 * Custom format for console output
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    
    return msg;
  })
);

/**
 * Custom format for file output (JSON)
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
  level: serverConfig.isDevelopment ? 'debug' : 'info',
  format: fileFormat,
  defaultMeta: { service: 'monster-arena' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: consoleFormat,
    }),
    
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat,
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat,
    }),
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

/**
 * Logger utility with convenient methods
 */
export const log = {
  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {Object} meta - Additional metadata
   */
  error: (message, meta = {}) => {
    logger.error(message, meta);
  },

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {Object} meta - Additional metadata
   */
  warn: (message, meta = {}) => {
    logger.warn(message, meta);
  },

  /**
   * Log informational messages
   * @param {string} message - Info message
   * @param {Object} meta - Additional metadata
   */
  info: (message, meta = {}) => {
    logger.info(message, meta);
  },

  /**
   * Log debug messages (only in development)
   * @param {string} message - Debug message
   * @param {Object} meta - Additional metadata
   */
  debug: (message, meta = {}) => {
    logger.debug(message, meta);
  },

  /**
   * Log HTTP requests
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {number} responseTime - Response time in milliseconds
   */
  http: (req, res, responseTime) => {
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTime}ms`;
    const meta = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip || req.connection.remoteAddress,
    };

    if (res.statusCode >= 500) {
      logger.error(message, meta);
    } else if (res.statusCode >= 400) {
      logger.warn(message, meta);
    } else {
      logger.info(message, meta);
    }
  },
};

export default logger;
