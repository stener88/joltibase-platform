import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { refineEmail } from '@/lib/email-v3/refiner';
import { parseAndInjectIds } from '@/lib/email-v3/tsx-parser';

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

    const { campaignId, currentTsxCode, userMessage, selectedComponentId, selectedComponentType } = await request.json();

    if (!campaignId || !currentTsxCode || !userMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`🔄 [REFINE] User message: "${userMessage}"`);
    if (selectedComponentId) {
      console.log(`🎯 [REFINE] Target component: ${selectedComponentType} (${selectedComponentId})`);
    }

    // Parse current TSX to get component map
    let componentMap;
    try {
      const parsed = parseAndInjectIds(currentTsxCode);
      componentMap = parsed.componentMap;
    } catch (error) {
      console.warn('[REFINE] Failed to parse TSX, proceeding without component map');
      componentMap = undefined;
    }

    // Use AI-native refinement
    const result = await refineEmail({
      currentTsxCode,
      userMessage,
      componentMap,
      selectedComponentId,
      selectedComponentType,
    });

    console.log(`✅ [REFINE] ${result.message}:`, result.changesApplied);

    return NextResponse.json({
      tsxCode: result.newTsxCode,
      message: result.message,
      changesApplied: result.changesApplied,
    });

  } catch (error: any) {
    console.error('[REFINE] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refine email' },
      { status: 500 }
    );
  }
}

