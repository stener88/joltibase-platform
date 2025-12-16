import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { prompt, clarificationMessage, thinkingTime, clarificationIssues } = body;

    console.log('📝 [CREATE-CLARIFICATION] Creating placeholder campaign for clarification');
    if (clarificationMessage) {
      console.log(`💭 [CREATE-CLARIFICATION] AI thought for ${thinkingTime}s`);
    } else if (clarificationIssues) {
      console.log('📝 [CREATE-CLARIFICATION] Issues:', clarificationIssues.length);
    }

    // Create draft campaign awaiting clarification (NOT generating yet!)
    const { data: campaign, error: dbError } = await supabase
      .from('campaigns_v3')
      .insert({
        user_id: user.id,
        name: 'Pending Clarification',
        generation_prompt: prompt,
        status: 'draft',
        is_generating: false, // Don't start polling until user responds
        metadata: {
          clarificationMessage,
          clarificationIssues,
          thinkingTime,
          needsClarification: true,
          createdAt: new Date().toISOString(),
        }
      })
      .select()
      .single();

    if (dbError || !campaign) {
      console.error('❌ [CREATE-CLARIFICATION] Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to create placeholder campaign' },
        { status: 500 }
      );
    }

    console.log('✅ [CREATE-CLARIFICATION] Created campaign:', campaign.id);

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
    });

  } catch (error: any) {
    console.error('❌ [CREATE-CLARIFICATION] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
