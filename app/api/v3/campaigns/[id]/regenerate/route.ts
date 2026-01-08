/**
 * Regenerate Campaign API Route (V3)
 * 
 * POST /api/v3/campaigns/[id]/regenerate
 * Regenerates campaign with refinement prompt
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { generateEmail } from '@/lib/email-v3/generator';
import { renderEmail } from '@/lib/email-v3/renderer';
import { z } from 'zod';

const RegenerateRequestSchema = z.object({
  prompt: z.string().min(10).max(500),
  preserveProps: z.boolean().optional().default(false),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
    const { id } = await params;
    
    // Fetch existing campaign
    const { data: existingCampaign, error: fetchError } = await supabase
      .from('campaigns_v3')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !existingCampaign) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campaign not found',
        },
        { status: 404 }
      );
    }
    
    // Parse and validate request
    const body = await request.json();
    const { prompt, preserveProps } = RegenerateRequestSchema.parse(body);// Build context-aware prompt
    let fullPrompt = prompt;
    if (existingCampaign.generation_prompt) {
      fullPrompt = `Original request: ${existingCampaign.generation_prompt}\n\nRefinement: ${prompt}`;
    }
    
    // Generate new version
    const generated = await generateEmail(fullPrompt);
    
    // Render to HTML
    const renderResult = await renderEmail(generated.filename);
    
    if (renderResult.error) {
      throw new Error(`Render failed: ${renderResult.error}`);
    }
    
    // Update campaign (increment version)
    const { data: campaign, error: updateError } = await supabase
      .from('campaigns_v3')
      .update({
        component_filename: generated.filename,
        component_code: generated.code,
        html_content: renderResult.html,
        design_system_used: generated.designSystemUsed,
        generation_prompt: fullPrompt,
        version: existingCampaign.version + 1,
        previous_version_id: existingCampaign.id,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (updateError) throw updateError;return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        subject_line: campaign.subject_line,
        html: renderResult.html,
        filename: generated.filename,
        designSystemUsed: generated.designSystemUsed,
        version: campaign.version,
      },
    });
    
  } catch (error: any) {
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Regeneration failed',
      },
      { status: 500 }
    );
  }
}

