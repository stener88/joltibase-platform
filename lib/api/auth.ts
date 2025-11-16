/**
 * API Authentication Utilities
 * 
 * Shared authentication helpers for API routes to eliminate duplicate auth checks.
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';

export interface AuthResult {
  user: User;
  supabase: Awaited<ReturnType<typeof createClient>>;
}

/**
 * Require authentication for an API route.
 * Returns authenticated user and supabase client, or sends 401 response.
 * 
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   const authResult = await requireAuth();
 *   if (authResult instanceof NextResponse) return authResult;
 *   
 *   const { user, supabase } = authResult;
 *   // ... use authenticated user
 * }
 * ```
 */
export async function requireAuth(): Promise<AuthResult | NextResponse> {
  const supabase = await createClient();
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      },
      { status: 401 }
    );
  }

  return { user, supabase };
}

