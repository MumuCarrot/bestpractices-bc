import 'dotenv/config'

/**
 * Parses an environment variable as an integer with a default value
 * @param {string} name - Environment variable name
 * @param {number} defaultValue - Default value if variable is not set or invalid
 * @returns {number} Parsed integer value or default value
 */
function getInt(name, defaultValue) {
  const value = process.env[name];
  return value ? parseInt(value, 10) : defaultValue;
}

/**
 * Environment variables configuration object
 * All values are loaded from process.env with fallback defaults
 * @type {Object}
 */
export const env = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: getInt('PORT', 8000),

  // Supabase configuration
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ?? '',

  // Argon2 password hashing configuration
  argon2MemoryCost: getInt('ARGON2_MEMORY_COST', 65536),
  argon2TimeCost: getInt('ARGON2_TIME_COST', 3),
  argon2Parallelism: getInt('ARGON2_PARALLELISM', 1),

  // JWT configuration
  secretKey: process.env.SECRET_KEY ?? '',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '5m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '1h',
}