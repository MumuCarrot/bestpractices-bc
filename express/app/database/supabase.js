import { createClient } from '@supabase/supabase-js'
import { databaseConfig } from '../config/index.js'

/**
 * Supabase client instance
 * Used for database operations and authentication
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(
	databaseConfig.supabase.url, 
	databaseConfig.supabase.serviceKey
)