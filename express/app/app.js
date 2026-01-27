import express from 'express';
import cookieParser from 'cookie-parser';
import healthRouter from './routers/health.router.js';
import { serverConfig } from './config/index.js';

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();
const port = serverConfig.port;

// Middleware for parsing JSON request bodies
app.use(express.json());
// Middleware for parsing cookies
app.use(cookieParser());
// Health check routes
app.use('/health', healthRouter);

/**
 * Start the Express server
 */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});