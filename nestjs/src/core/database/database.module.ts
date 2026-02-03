import { Module, Global } from '@nestjs/common';
import { SupabaseProvider, SUPABASE_CLIENT } from './supabase.provider';

@Global()
@Module({
  providers: [SupabaseProvider],
  exports: [SUPABASE_CLIENT],
})
export class DatabaseModule {}
