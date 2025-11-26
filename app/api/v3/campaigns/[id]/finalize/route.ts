/**
 * Finalize Campaign API Route (V3)
 * 
 * POST /api/v3/campaigns/[id]/finalize
 * Marks campaign as ready for sending, re-renders final HTML
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { renderEmail } from '@/lib/email-v3/renderer';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
    
    // Fetch campaign
    const { data: campaign, error: fetchError } = await supabase
      .from('campaigns_v3')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !campaign) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campaign not found',
        },
        { status: 404 }
      );
    }
    
    console.log(`🎯 [FINALIZE-V3] Finalizing campaign: ${params.id}`);
    
    // Re-render to ensure latest HTML
    const renderResult = await renderEmail(
      campaign.component_filename,
      { props: campaign.default_props || {} }
    );
    
    if (renderResult.error) {
      throw new Error(`Render failed: ${renderResult.error}`);
    }
    
    // Update campaign status
    const { data: finalizedCampaign, error: updateError } = await supabase
      .from('campaigns_v3')
      .update({
        html_content: renderResult.html,
        status: 'ready',
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    console.log(`✅ [FINALIZE-V3] Campaign finalized: ${params.id}`);
    
    return NextResponse.json({
      success: true,
      campaign: finalizedCampaign,
    });
    
  } catch (error: any) {
    console.error('❌ [FINALIZE-V3] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Finalization failed',
      },
      { status: 500 }
    );
  }
}

