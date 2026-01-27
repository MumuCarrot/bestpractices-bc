import { env } from './env.js';

/**
 * Argon2 password hashing configuration object
 * Contains parameters for password hashing algorithm
 * @type {Object}
 */
export const argon2Config = {
  /** Memory cost in KB (default: 65536 = 64MB) */
  memoryCost: env.argon2MemoryCost,
  /** Number of iterations (default: 3) */
  timeCost: env.argon2TimeCost,
  /** Number of threads/parallelism (default: 1) */
  parallelism: env.argon2Parallelism,
}