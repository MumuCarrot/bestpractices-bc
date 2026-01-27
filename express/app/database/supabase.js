import { createClient } from '@supabase/supabase-js'
import { databaseConfig } from '../config/index.js'

export const supabase = createClient(
	databaseConfig.supabase.url, 
	databaseConfig.supabase.serviceKey
)