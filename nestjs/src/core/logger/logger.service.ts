import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class LoggerService {
  private readonly logger: winston.Logger;

  constructor(private configService: ConfigService) {
    // Ensure logs directory exists
    const logsDir = join(process.cwd(), 'logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    const isDevelopment = nodeEnv === 'development';

    // Custom format for console output
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
      }),
    );

    // Custom format for file output (JSON)
    const fileFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    );

    // Create Winston logger instance
    this.logger = winston.createLogger({
      level: isDevelopment ? 'debug' : 'info',
      format: fileFormat,
      defaultMeta: { service: 'nestjs' },
      transports: [
        // Write all logs to console
        new winston.transports.Console({
          format: consoleFormat,
        }),

        // Write all logs with level 'error' and below to error.log
        new winston.transports.File({
          filename: join(logsDir, 'error.log'),
          level: 'error',
          format: fileFormat,
        }),

        // Write all logs to combined.log
        new winston.transports.File({
          filename: join(logsDir, 'combined.log'),
          format: fileFormat,
        }),
      ],

      // Handle exceptions and rejections
      exceptionHandlers: [
        new winston.transports.File({
          filename: join(logsDir, 'exceptions.log'),
        }),
      ],
      rejectionHandlers: [
        new winston.transports.File({
          filename: join(logsDir, 'rejections.log'),
        }),
      ],
    });
  }

  /**
   * Logs error level messages.
   * Errors are written to both console and error.log file.
   *
   * @param {string} message - Error message to log
   * @param {Object} [meta] - Optional additional metadata object to include in the log
   */
  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  /**
   * Logs warning level messages.
   * Warnings are written to both console and combined.log file.
   *
   * @param {string} message - Warning message to log
   * @param {Object} [meta] - Optional additional metadata object to include in the log
   */
  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  /**
   * Logs informational level messages.
   * Info messages are written to both console and combined.log file.
   *
   * @param {string} message - Informational message to log
   * @param {Object} [meta] - Optional additional metadata object to include in the log
   */
  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  /**
   * Logs debug level messages.
   * Debug messages are only logged in development environment and written to console and combined.log file.
   *
   * @param {string} message - Debug message to log
   * @param {Object} [meta] - Optional additional metadata object to include in the log
   */
  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  /**
   * Logs HTTP request/response information.
   * Automatically determines log level based on status code:
   * - 5xx: error level
   * - 4xx: warning level
   * - 2xx/3xx: info level
   *
   * @param {any} req - Express request object
   * @param {any} res - Express response object
   * @param {number} responseTime - Response time in milliseconds
   */
  http(req: any, res: any, responseTime: number) {
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTime}ms`;
    const meta = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip || req.connection?.remoteAddress,
    };

    if (res.statusCode >= 500) {
      this.logger.error(message, meta);
    } else if (res.statusCode >= 400) {
      this.logger.warn(message, meta);
    } else {
      this.logger.info(message, meta);
    }
  }
}
