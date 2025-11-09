import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// GET /api/campaigns/[id] - Get single campaign
// ============================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const campaignId = (await params).id;
    console.log(`📥 [CAMPAIGNS-API] Fetching campaign: ${campaignId} for user: ${user.id}`);

    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError) {
      console.error('❌ [CAMPAIGNS-API] Fetch error:', campaignError);
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: campaign,
    });

  } catch (error: any) {
    console.error('❌ [CAMPAIGNS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/campaigns/[id] - Update campaign
// ============================================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const campaignId = (await params).id;
    const updates = await request.json();

    // Update campaign
    const { data: campaign, error: updateError } = await supabase
      .from('campaigns')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ [CAMPAIGNS-API] Update error:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      data: campaign,
    });

  } catch (error: any) {
    console.error('❌ [CAMPAIGNS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/campaigns/[id] - Delete campaign
// ============================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const campaignId = (await params).id;

    // Delete campaign (cascade will handle emails)
    const { error: deleteError } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('❌ [CAMPAIGNS-API] Delete error:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted',
    });

  } catch (error: any) {
    console.error('❌ [CAMPAIGNS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
