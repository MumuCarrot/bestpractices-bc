import express from 'express';
import cookieParser from 'cookie-parser';
import { mkdirSync, existsSync } from 'fs';
import healthRouter from './routers/health.router.js';
import authRouter from './routers/auth.router.js';
import { serverConfig } from './config/index.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { log } from './utils/logger.js';

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();
const port = serverConfig.port;

// Ensure logs directory exists
if (!existsSync('logs')) {
  mkdirSync('logs', { recursive: true });
}

// HTTP request logging middleware (should be first)
app.use(loggerMiddleware);

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

// Health check routes
app.use('/health', healthRouter);

// Auth routes
app.use('/auth', authRouter);

/**
 * Start the Express server
 */
app.listen(port, () => {
  log.info(`Server listening at http://localhost:${port}`, {
    port,
    environment: serverConfig.nodeEnv,
  });
});