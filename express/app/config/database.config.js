import { env } from './env.js';

export const databaseConfig = {
  supabase: {
    url: env.supabaseUrl,
    serviceKey: env.supabaseServiceKey,
  }
}