/**
 * AI Campaign Refinement API Route
 * POST /api/ai/refine-campaign
 * 
 * Refines existing V2 email campaigns using AI (semantic blocks system)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/api/auth';
import { generateCompletion, type AIProvider } from '@/lib/ai/client';
import { renderBlocksToHTML } from '@/lib/email-v2/template-engine';
import { EmailContentSchema, type SemanticBlock } from '@/lib/email-v2/ai/blocks';
import type { GlobalEmailSettings } from '@/lib/email-v2/types';
import { z } from 'zod';

// ============================================================================
// Request Schema
// ============================================================================

const RefineCampaignRequestSchema = z.object({
  campaignId: z.string().uuid('Invalid campaign ID'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  currentEmail: z.object({
    subject: z.string().optional(),
    previewText: z.string().optional(),
    blocks: z.array(z.any()).default([]), // SemanticBlock[] - using z.any() for flexibility
    globalSettings: z.record(z.string(), z.any()).optional(),
  }),
});

type RefineCampaignRequest = z.infer<typeof RefineCampaignRequestSchema>;

// ============================================================================
// API Handler
// ============================================================================

export async function POST(request: NextRequest) {
  console.log('🔄 [REFINE-CAMPAIGN-API] Received POST request');
  
  try {
    // 1. Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
    console.log('✅ [REFINE-CAMPAIGN-API] User authenticated:', user.id);

    // 2. Parse and validate request body
    const body = await request.json();
    let validatedInput: RefineCampaignRequest;
    
    try {
      validatedInput = RefineCampaignRequestSchema.parse(body);
      console.log('✅ [REFINE-CAMPAIGN-API] Input validated');
    } catch (error) {
      console.error('❌ [REFINE-CAMPAIGN-API] Validation error:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid request data', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // 3. Verify campaign ownership
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('user_id')
      .eq('id', validatedInput.campaignId)
      .single();

    if (campaignError || !campaign) {
      console.error('❌ [REFINE-CAMPAIGN-API] Campaign not found');
      return NextResponse.json(
        { success: false, error: 'Campaign not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (campaign.user_id !== user.id) {
      console.error('❌ [REFINE-CAMPAIGN-API] Unauthorized access');
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    console.log('✅ [REFINE-CAMPAIGN-API] Campaign ownership verified');

    // 4. Prepare current email data
    const currentBlocks = validatedInput.currentEmail.blocks as SemanticBlock[];
    const currentSubject = validatedInput.currentEmail.subject || 'Email';
    const currentPreviewText = validatedInput.currentEmail.previewText || '';
    const globalSettings: GlobalEmailSettings = {
      primaryColor: validatedInput.currentEmail.globalSettings?.primaryColor || '#7c3aed',
      secondaryColor: validatedInput.currentEmail.globalSettings?.secondaryColor,
      fontFamily: validatedInput.currentEmail.globalSettings?.fontFamily || 'system-ui, -apple-system, sans-serif',
      maxWidth: validatedInput.currentEmail.globalSettings?.maxWidth || '600px',
      backgroundColor: validatedInput.currentEmail.globalSettings?.backgroundColor || '#ffffff',
    };

    console.log('📝 [REFINE-CAMPAIGN-API] User message:', validatedInput.message);
    console.log('📦 [REFINE-CAMPAIGN-API] Current blocks:', currentBlocks.length);
    console.log('⚙️  [REFINE-CAMPAIGN-API] Global settings:', globalSettings);

    // 5. Build refinement prompt
    const refinementPrompt = buildRefinementPrompt(
      validatedInput.message,
      currentBlocks,
      currentSubject,
      currentPreviewText,
      globalSettings
    );

    // 6. Call AI to refine blocks
    const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';
    const model = provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o';
    
    console.log('🤖 [REFINE-CAMPAIGN-API] Calling AI for refinement...');
    
    const aiResult = await generateCompletion(
      [
        {
          role: 'system',
          content: `You are an expert email campaign editor. Refine the existing email based on the user's request while maintaining the overall structure and brand consistency.

CRITICAL RULES:
1. Keep the same number of blocks (or adjust only if explicitly requested)
2. Maintain brand colors and fonts from globalSettings
3. All colors must be hex codes (#ffffff, #000000)
4. Preserve block types unless user explicitly asks to change them
5. Only modify what the user requests - don't make unnecessary changes
6. Keep preview text under 140 characters
7. Keep headlines under 80 characters
8. Keep CTA text under 30 characters`,
        },
        {
          role: 'user',
          content: refinementPrompt,
        },
      ],
      {
        provider,
        model,
        temperature: 0.7,
        maxTokens: 4000,
        zodSchema: EmailContentSchema,
      }
    );

    console.log(`✅ [REFINE-CAMPAIGN-API] ${provider.toUpperCase()} response received`);

    // 7. Parse AI response
    let refinedContent;
    try {
      const parsed = JSON.parse(aiResult.content);
      refinedContent = EmailContentSchema.parse(parsed);
      console.log('✅ [REFINE-CAMPAIGN-API] Response validated');
      console.log('📦 [REFINE-CAMPAIGN-API] Refined blocks:', refinedContent.blocks.length);
    } catch (error) {
      console.error('❌ [REFINE-CAMPAIGN-API] Failed to parse AI response:', error);
      return NextResponse.json(
        { success: false, error: 'AI response parsing failed', code: 'PARSE_ERROR' },
        { status: 500 }
      );
    }

    // 8. Render refined blocks to HTML
    console.log('🎨 [REFINE-CAMPAIGN-API] Rendering blocks to HTML...');
    const html = renderBlocksToHTML(
      refinedContent.blocks,
      globalSettings,
      refinedContent.previewText
    );

    // 9. Generate plain text version (simple extraction)
    const plainText = extractPlainText(refinedContent.blocks);

    // 10. Extract CTA info (from first CTA block found)
    const ctaBlock = refinedContent.blocks.find(b => b.blockType === 'cta') as any;
    const ctaText = ctaBlock?.buttonText || '';
    const ctaUrl = ctaBlock?.buttonUrl || '';

    // 11. Generate subject line (use first heading/hero headline or current subject)
    const subject = extractSubject(refinedContent.blocks, currentSubject);

    // 12. Convert refined blocks to EmailComponent tree (for V2 editor)
    console.log('🌳 [REFINE-CAMPAIGN-API] Converting blocks to EmailComponent tree...');
    const { semanticBlocksToEmailComponent } = await import('@/lib/email-v2/blocks-converter');
    const refinedRootComponent = semanticBlocksToEmailComponent(
      refinedContent.blocks,
      globalSettings,
      refinedContent.previewText
    );

    // 13. Save refined campaign to database
    console.log('💾 [REFINE-CAMPAIGN-API] Saving refined campaign to database...');
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({
        semantic_blocks: {
          blocks: refinedContent.blocks,
          previewText: refinedContent.previewText,
        },
        global_settings: globalSettings,
        html_content: html,
        subject_line: subject,
        preview_text: refinedContent.previewText,
        updated_at: new Date().toISOString(),
        // root_component will be saved when user enters visual edit mode
      })
      .eq('id', validatedInput.campaignId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('❌ [REFINE-CAMPAIGN-API] Database update failed:', updateError);
      // Don't fail the request - return refined content anyway
    } else {
      console.log('✅ [REFINE-CAMPAIGN-API] Campaign saved to database');
    }

    // 14. Track usage
    try {
      await supabase.from('ai_usage').insert({
        user_id: user.id,
        feature: 'campaign_refinement',
        tokens_used: aiResult.tokensUsed,
        cost_usd: aiResult.costUsd || 0,
      });
      console.log('✅ [REFINE-CAMPAIGN-API] Usage tracked');
    } catch (usageError) {
      console.error('⚠️  [REFINE-CAMPAIGN-API] Failed to track usage (non-critical)');
    }

    // 15. Return refined email
    console.log('✅ [REFINE-CAMPAIGN-API] Refinement complete');
    
    return NextResponse.json({
      success: true,
      data: {
        refinedEmail: {
          subject,
          previewText: refinedContent.previewText,
          blocks: refinedContent.blocks,
          globalSettings,
          html,
          plainText,
          ctaText,
          ctaUrl,
        },
        // Include rootComponent for V2 editor
        rootComponent: refinedRootComponent,
        message: `✓ Refined email successfully. Updated ${refinedContent.blocks.length} blocks.`,
        metadata: {
          tokensUsed: aiResult.tokensUsed,
          costUsd: aiResult.costUsd,
        },
      },
    });

  } catch (error: unknown) {
    console.error('❌ [REFINE-CAMPAIGN-API] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function buildRefinementPrompt(
  userMessage: string,
  currentBlocks: SemanticBlock[],
  currentSubject: string,
  currentPreviewText: string,
  globalSettings: GlobalEmailSettings
): string {
  return `You are refining an existing email campaign. The user wants to make changes while keeping the overall structure.

CURRENT EMAIL:
Subject: ${currentSubject}
Preview Text: ${currentPreviewText}

Current Blocks (${currentBlocks.length} blocks):
${JSON.stringify(currentBlocks, null, 2)}

Global Settings:
- Primary Color: ${globalSettings.primaryColor}
- Font Family: ${globalSettings.fontFamily}
- Background Color: ${globalSettings.backgroundColor || '#ffffff'}
- Max Width: ${globalSettings.maxWidth}

USER REQUEST: "${userMessage}"

Your task:
1. Refine the blocks based on the user's request
2. Keep the same block structure unless explicitly asked to change it
3. Maintain brand colors and fonts
4. Update preview text if relevant
5. Ensure all content follows email best practices

Return the refined email content in the same format as the current blocks.`;
}

function extractPlainText(blocks: SemanticBlock[]): string {
  const textParts: string[] = [];
  
  for (const block of blocks) {
    switch (block.blockType) {
      case 'hero':
        textParts.push((block as any).headline);
        if ((block as any).subheadline) {
          textParts.push((block as any).subheadline);
        }
        break;
      case 'content':
        const paragraphs = (block as any).paragraphs || [];
        textParts.push(...paragraphs);
        break;
      case 'heading':
        textParts.push((block as any).text || '');
        break;
      case 'text':
        textParts.push((block as any).text || '');
        break;
    }
  }
  
  return textParts.join('\n\n').substring(0, 500); // Limit to 500 chars
}

function extractSubject(blocks: SemanticBlock[], fallback: string): string {
  // Try to find a hero headline first
  const heroBlock = blocks.find(b => b.blockType === 'hero') as any;
  if (heroBlock?.headline) {
    return heroBlock.headline.substring(0, 80);
  }
  
  // Try heading block
  const headingBlock = blocks.find(b => b.blockType === 'heading') as any;
  if (headingBlock?.text) {
    return headingBlock.text.substring(0, 80);
  }
  
  // Fallback to provided subject
  return fallback.substring(0, 80);
}

