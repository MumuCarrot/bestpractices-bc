import { env } from './env.js';
import { serverConfig } from './server.config.js';

// Helper to convert time string to milliseconds
function timeToMs(timeString) {
  const unit = timeString.slice(-1);
  const value = parseInt(timeString.slice(0, -1), 10);
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return parseInt(timeString, 10);
  }
}

export const appConfig = {
  secretKey: env.secretKey,
  accessTokenExpiresIn: env.accessTokenExpiresIn,
  refreshTokenExpiresIn: env.refreshTokenExpiresIn,
  cookieOptions: {
    httpOnly: true,
    secure: serverConfig.isProduction,
    sameSite: 'strict',
    maxAge: timeToMs(env.refreshTokenExpiresIn),
  },
  accessTokenCookieOptions: {
    httpOnly: true,
    secure: serverConfig.isProduction,
    sameSite: 'strict',
    maxAge: timeToMs(env.accessTokenExpiresIn),
  },
}