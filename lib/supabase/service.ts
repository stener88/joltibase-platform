import { createClient } from '@supabase/supabase-js';

/**
 * Service Role Client - Bypasses RLS for system operations
 * 
 * USE ONLY FOR:
 * - Background jobs (email queue processing, cron jobs)
 * - System operations (webhooks, admin tasks)
 * - Operations that need to bypass RLS
 * 
 * NEVER USE FOR:
 * - User-facing operations
 * - Direct client requests
 * - Operations that should respect RLS
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured. Get it from Supabase Dashboard → Settings → API → service_role key');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

