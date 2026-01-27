import { env } from './env.js';

export const serverConfig = {
  nodeEnv: env.nodeEnv,
  port: env.port,
  isProduction: env.nodeEnv === 'production',
  isDevelopment: env.nodeEnv === 'development',
}
