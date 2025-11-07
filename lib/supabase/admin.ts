/**
 * Supabase Admin Client
 * 
 * Server-side client with service role privileges
 * Use for: scripts, background jobs, admin operations
 * 
 * WARNING: This client bypasses RLS (Row Level Security)
 * Only use in trusted server-side contexts
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

/**
 * Get admin client with lazy initialization
 * Validates environment variables only when first accessed
 */
function getClient(): SupabaseClient {
  if (!adminClient) {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }

    // Create admin client with service role key
    // Bypasses RLS - use with caution!
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return adminClient;
}

/**
 * Admin client proxy that lazily initializes on first access
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getClient();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

/**
 * Get admin client (direct access)
 */
export function getAdminClient() {
  return getClient();
}

