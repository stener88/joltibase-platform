/**
 * List Campaigns API Route (V3)
 * 
 * GET /api/v3/campaigns
 * Lists all v3 campaigns for the authenticated user with pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
    
    // Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Build query
    let query = supabase
      .from('campaigns_v3')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,generation_prompt.ilike.%${search}%`);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: campaigns, error: fetchError, count } = await query;
    
    if (fetchError) {
      throw new Error(fetchError.message);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        campaigns: campaigns || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    });
    
  } catch (error: any) {
    console.error('❌ [LIST-CAMPAIGNS-V3] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch campaigns',
      },
      { status: 500 }
    );
  }
}

