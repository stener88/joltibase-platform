import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { fromDbRow, toDbPayload, type BrandIdentity, type BrandKitDbRow } from '@/lib/types/brand';

/**
 * GET /api/brand
 * Fetch the current user's brand kit
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('brand_kits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // PGRST116 = no rows found (user hasn't set up brand yet)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ brand: null });
      }
      console.error('[Brand API] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const brand = fromDbRow(data as BrandKitDbRow);
    return NextResponse.json({ brand });
  } catch (error) {
    console.error('[Brand API] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/brand
 * Create or update the current user's brand kit
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.companyName || !body.primaryColor) {
      return NextResponse.json(
        { error: 'Missing required fields: companyName, primaryColor' },
        { status: 400 }
      );
    }

    const brandPayload = toDbPayload(body as BrandIdentity, user.id);

    const { data, error } = await supabase
      .from('brand_kits')
      .upsert({
        ...brandPayload,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'  // Specify which column to check for conflicts
      })
      .select()
      .single();

    if (error) {
      console.error('[Brand API] POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const brand = fromDbRow(data as BrandKitDbRow);
    return NextResponse.json({ brand });
  } catch (error) {
    console.error('[Brand API] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/brand
 * Delete the current user's brand kit
 */
export async function DELETE() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('brand_kits')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('[Brand API] DELETE error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Brand API] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

