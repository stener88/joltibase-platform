import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// GET /api/lists - Fetch user's lists
// ============================================

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all lists for user
    const { data: lists, error: fetchError } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('❌ [LISTS-API] Fetch error:', fetchError);
      throw fetchError;
    }

    return NextResponse.json({
      success: true,
      data: lists || [],
    });

  } catch (error: any) {
    console.error('❌ [LISTS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch lists' },
      { status: 500 }
    );
  }
}

