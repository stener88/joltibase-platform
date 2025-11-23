import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { processCampaignQueue } from '@/lib/email-sending/queue';

// ============================================
// POST /api/campaigns/[id]/queue - Process Campaign Queue
// ============================================

export async function POST(
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

    // Verify campaign ownership
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Process the queue
    console.log(`🔄 [QUEUE-API] Processing queue for campaign ${campaignId}`);
    const result = await processCampaignQueue(campaignId);

    if (!result.success) {
      throw new Error(result.error);
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${result.processed} emails`,
      data: {
        processed: result.processed,
        failed: result.failed,
      },
    });

  } catch (error: any) {
    console.error('❌ [QUEUE-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process queue' },
      { status: 500 }
    );
  }
}

