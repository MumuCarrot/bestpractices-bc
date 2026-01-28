import { log } from '../utils/logger.js';

/**
 * HTTP request logging middleware
 * Logs all incoming requests with method, URL, status code, and response time
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Log request start
  log.debug(`Incoming request: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  });

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function (...args) {
    const responseTime = Date.now() - startTime;
    
    // Log HTTP request/response
    log.http(req, res, responseTime);
    
    // Call original end method
    originalEnd.apply(this, args);
  };

  next();
};
