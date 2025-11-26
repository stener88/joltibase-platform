import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmail } from '@/lib/email-v3/generator';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { campaignId, currentTsxCode, userMessage } = await request.json();

    if (!campaignId || !currentTsxCode || !userMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`🔄 [REFINE] User message: "${userMessage}"`);

    // For now, regenerate entirely based on user message
    // TODO: Implement targeted modification based on current TSX
    const result = await generateEmail(userMessage);

    return NextResponse.json({
      tsxCode: result.code,
      message: `Updated the email based on your request.`,
      patternsUsed: result.patternsUsed,
    });

  } catch (error: any) {
    console.error('[REFINE] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refine email' },
      { status: 500 }
    );
  }
}

