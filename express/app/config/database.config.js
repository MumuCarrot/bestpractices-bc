import { env } from './env.js';

/**
 * Database configuration object
 * Contains Supabase connection settings
 * @type {Object}
 */
export const databaseConfig = {
  supabase: {
    /** Supabase project URL */
    url: env.supabaseUrl,
    /** Supabase service role key (has admin privileges) */
    serviceKey: env.supabaseServiceKey,
  }
}