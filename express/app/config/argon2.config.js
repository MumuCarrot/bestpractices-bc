import { env } from './env.js';

export const argon2Config = {
  memoryCost: env.argon2MemoryCost,
  timeCost: env.argon2TimeCost,
  parallelism: env.argon2Parallelism,
}