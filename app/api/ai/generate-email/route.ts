/**
 * AI Email Generation API (V2 Semantic)
 * 
 * POST /api/ai/generate-email
 * 
 * Generates a complete email from a user prompt using AI semantic blocks
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  generateEmailSemantic,
  validateComponentTree,
} from '@/lib/email-v2';
import { z } from 'zod';

// Request schema with optional emailType
const GenerateEmailRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt too long'),
  campaignId: z.string().uuid('Invalid campaign ID'),
  emailType: z.enum(['marketing', 'transactional', 'newsletter']).optional(),
});

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 [GENERATE-EMAIL-V2] Request from user:', user.id);

    // Parse and validate request
    const body = await req.json();
    const validation = GenerateEmailRequestSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('❌ [GENERATE-EMAIL-V2] Invalid request:', validation.error);
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: validation.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    const { prompt, campaignId, emailType } = validation.data;
    
    console.log('📝 [GENERATE-EMAIL-V2] Prompt:', prompt);
    console.log('📧 [GENERATE-EMAIL-V2] Campaign ID:', campaignId);
    console.log('📧 [GENERATE-EMAIL-V2] Email type:', emailType || 'auto');

    // Get campaign and verify ownership
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    console.log('✅ [GENERATE-EMAIL-V2] Campaign ownership verified');

    // Get global settings (or use defaults)
    const globalSettings = {
      primaryColor: campaign.primary_color || '#7c3aed',
      secondaryColor: campaign.secondary_color || undefined,
      fontFamily: campaign.font_family || 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      backgroundColor: campaign.background_color || '#ffffff',
    };

    console.log('⚙️  [GENERATE-EMAIL-V2] Settings:', globalSettings);

    // Generate email with AI using semantic blocks approach
    const result = await generateEmailSemantic(prompt, globalSettings, { emailType });
    
    console.log('✅ [GENERATE-EMAIL-V2] Email generated (semantic blocks)');
    console.log(`📊 [GENERATE-EMAIL-V2] Model: ${result.metadata.model}`);
    console.log(`📦 [GENERATE-EMAIL-V2] Blocks: ${result.metadata.blocksGenerated}`);
    console.log(`⏱️  [GENERATE-EMAIL-V2] Time: ${result.metadata.timeMs}ms`);

    // Validate generated structure
    const treeValidation = validateComponentTree(result.email);
    if (!treeValidation.valid) {
      console.error('❌ [GENERATE-EMAIL-V2] Invalid component tree:', treeValidation.errors);
      return NextResponse.json(
        { 
          error: 'Generated email has invalid structure',
          details: treeValidation.errors
        },
        { status: 500 }
      );
    }

    console.log('✅ [GENERATE-EMAIL-V2] Structure validated');

    // Save to database
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({
        version: 'v2',
        root_component: result.email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('❌ [GENERATE-EMAIL-V2] Database update failed:', updateError);
      return NextResponse.json(
        { error: 'Failed to save to database' },
        { status: 500 }
      );
    }

    console.log('✅ [GENERATE-EMAIL-V2] Saved to database');

    const totalTime = Date.now() - startTime;
    console.log(`🎉 [GENERATE-EMAIL-V2] Complete! Total time: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      rootComponent: result.email,
      metadata: {
        ...result.metadata,
        totalTimeMs: totalTime,
      },
    });

  } catch (error) {
    console.error('❌ [GENERATE-EMAIL-V2] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Email generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

