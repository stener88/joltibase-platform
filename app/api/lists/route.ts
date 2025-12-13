import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// GET /api/lists - Get all lists for user
// ============================================

export async function GET() {
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

    // Fetch lists
    const { data: lists, error: listsError } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (listsError) {
      console.error('Error fetching lists:', listsError);
      throw listsError;
    }

    return NextResponse.json({
      success: true,
      data: lists || [],
    });

  } catch (error: any) {
    console.error('Error in GET /api/lists:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/lists - Create new list
// ============================================

export async function POST(request: Request) {
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

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'List name is required' },
        { status: 400 }
      );
    }

    // Create list
    const { data: list, error: createError } = await supabase
      .from('lists')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        contact_count: 0,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating list:', createError);
      throw createError;
    }

    return NextResponse.json({
      success: true,
      data: list,
    });

  } catch (error: any) {
    console.error('Error in POST /api/lists:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
