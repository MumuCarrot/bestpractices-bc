import { env } from './env.js';

/**
 * Server configuration object
 * Contains server-related settings and environment flags
 * @type {Object}
 */
export const serverConfig = {
  /** Current Node.js environment (development, production, etc.) */
  nodeEnv: env.nodeEnv,
  /** Server port number */
  port: env.port,
  /** Boolean flag indicating if running in production environment */
  isProduction: env.nodeEnv === 'production',
  /** Boolean flag indicating if running in development environment */
  isDevelopment: env.nodeEnv === 'development',
}
