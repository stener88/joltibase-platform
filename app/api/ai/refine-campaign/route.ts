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
import { z, ZodError } from 'zod';
import { detectUserIntent, CONFIDENCE_THRESHOLDS } from '@/lib/ai/intent-detection';
import { generateEmailAdvice } from '@/lib/ai/advisory-chat';

// ============================================================================
// Deep Merge Functions
// ============================================================================

/**
 * Deep merge refined blocks with original blocks
 * Preserves all required fields from original, overrides with refined values
 */
function deepMergeBlock(original: any, refined: any): any {
  // If refined explicitly undefined, keep original
  if (refined === undefined) return original;
  
  // Primitive values - use refined
  if (typeof refined !== 'object' || refined === null) {
    return refined;
  }
  
  // Arrays - merge element by element
  if (Array.isArray(refined)) {
    if (!Array.isArray(original)) return refined;
    
    return refined.map((item, i) => {
      const origItem = original[i];
      if (!origItem || typeof item !== 'object') return item;
      return deepMergeBlock(origItem, item);
    });
  }
  
  // Objects - merge recursively
  const result: any = { ...original };
  for (const key in refined) {
    if (refined[key] === undefined) continue;
    
    if (typeof refined[key] === 'object' && refined[key] !== null) {
      result[key] = deepMergeBlock(original[key], refined[key]);
    } else {
      result[key] = refined[key];
    }
  }
  
  return result;
}

function mergeBlocks(
  originalBlocks: SemanticBlock[],
  refinedBlocks: any[]
): any[] {
  // Safety check: if no originals to merge with, return refined as-is
  // This handles edge case of empty currentBlocks or when AI adds new blocks
  if (originalBlocks.length === 0) {
    console.warn('⚠️  [MERGE] No original blocks to merge with - returning AI response as-is');
    return refinedBlocks;
  }
  
  return refinedBlocks.map((refined, index) => {
    const original = originalBlocks[index];
    
    // No original at this index (AI added new block) or block type changed
    // Return refined as-is and hope it's complete
    if (!original || original.blockType !== refined.blockType) {
      if (!original) {
        console.warn(`⚠️  [MERGE] Block ${index} has no original (new block?) - returning as-is`);
      } else {
        console.warn(`⚠️  [MERGE] Block ${index} type changed (${original.blockType} → ${refined.blockType}) - returning as-is`);
      }
      return refined;
    }
    
    // Normal case: merge refined with original
    return deepMergeBlock(original, refined);
  });
}

/**
 * Validate block completeness before Zod validation
 * Returns array of error messages for debugging
 */
function validateBlockCompleteness(blocks: any[]): string[] {
  const errors: string[] = [];
  
  blocks.forEach((block, i) => {
    if (!block.blockType) {
      errors.push(`Block ${i}: missing blockType`);
      return;
    }
    
    switch (block.blockType) {
      case 'hero':
        if (!block.headline) errors.push(`Block ${i}: hero missing headline`);
        if (!block.ctaText) errors.push(`Block ${i}: hero missing ctaText`);
        if (!block.ctaUrl) errors.push(`Block ${i}: hero missing ctaUrl`);
        break;
      
      case 'features':
        if (!block.features || !Array.isArray(block.features)) {
          errors.push(`Block ${i}: features missing features array`);
        } else {
          block.features.forEach((f: any, fi: number) => {
            if (!f.title) errors.push(`Block ${i}: features[${fi}] missing title`);
            if (!f.description) errors.push(`Block ${i}: features[${fi}] missing description`);
          });
        }
        break;
      
      case 'cta':
        if (!block.headline) errors.push(`Block ${i}: cta missing headline`);
        if (!block.buttonText) errors.push(`Block ${i}: cta missing buttonText`);
        if (!block.buttonUrl) errors.push(`Block ${i}: cta missing buttonUrl`);
        break;
      
      case 'footer':
        if (!block.companyName) errors.push(`Block ${i}: footer missing companyName`);
        if (!block.unsubscribeUrl) errors.push(`Block ${i}: footer missing unsubscribeUrl`);
        break;
    }
  });
  
  return errors;
}

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

    // Safety check: ensure we have blocks to refine
    if (currentBlocks.length === 0) {
      console.warn('⚠️  [REFINE-CAMPAIGN-API] No blocks to refine - campaign may not be generated yet');
      return NextResponse.json(
        {
          success: false,
          error: 'No email content to refine. Please generate the campaign first.',
          code: 'NO_CONTENT',
        },
        { status: 400 }
      );
    }

    // 5. Detect user intent: advice or refinement
    // Note: conversationHistory could be passed from frontend in future
    const intentResult = detectUserIntent(validatedInput.message);
    console.log('🎯 [REFINE-CAMPAIGN-API] Detected intent:', intentResult.intent, `(confidence: ${intentResult.confidence})`);

    // Handle low confidence - ask for clarification
    if (intentResult.confidence < CONFIDENCE_THRESHOLDS.LOW) {
      console.log('⚠️  [REFINE-CAMPAIGN-API] Low confidence, asking for clarification');
      return NextResponse.json({
        success: true,
        data: {
          message: "I'm not sure if you want advice or want me to make changes. " +
                   "Say 'suggest improvements' for advice, or 'make those changes' to update the email.",
          blocksChanged: false,
          needsClarification: true,
          blocks: currentBlocks,
          subject: currentSubject,
          previewText: currentPreviewText,
        },
      });
    }

    // Handle advisory/brainstorming requests
    if (intentResult.intent === 'advice') {
      console.log('💡 [REFINE-CAMPAIGN-API] Generating conversational advice...');
      
      try {
        const advice = await generateEmailAdvice(
          validatedInput.message,
          currentBlocks,
          currentSubject,
          currentPreviewText,
          globalSettings
        );
        
        console.log('✅ [REFINE-CAMPAIGN-API] Advice generated');
        
        // Return advice without modifying blocks
        return NextResponse.json({
          success: true,
          data: {
            message: advice,
            blocksChanged: false,
            // Return current state unchanged
            blocks: currentBlocks,
            subject: currentSubject,
            previewText: currentPreviewText,
          },
        });
      } catch (error: any) {
        console.error('❌ [REFINE-CAMPAIGN-API] Error generating advice:', error);
        
        // Return a helpful fallback message
        return NextResponse.json({
          success: true,
          data: {
            message: "I'd love to help brainstorm ideas! Could you be more specific about what you'd like to improve? For example: 'make the CTA more urgent' or 'add social proof'.",
            blocksChanged: false,
            blocks: currentBlocks,
            subject: currentSubject,
            previewText: currentPreviewText,
          },
        });
      }
    }

    // Continue with refinement mode (existing logic)...
    console.log('🔄 [REFINE-CAMPAIGN-API] Proceeding with refinement mode');

    // 6. Build refinement prompt
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
          content: `You are an expert email campaign editor. Return COMPLETE blocks with ALL fields.

CRITICAL: DO NOT omit any fields. Include ALL fields from original blocks, even if unchanged.

EXAMPLES:

Example 1 - Change CTA button color:
❌ WRONG (missing fields):
{
  "blockType": "cta",
  "buttonColor": "#FF0000"
}

✅ RIGHT (complete block):
{
  "blockType": "cta",
  "headline": "Discover the Future",
  "subheadline": "Experience innovation today",
  "buttonText": "Get Started",
  "buttonUrl": "https://example.com",
  "backgroundColor": "#ffffff",
  "buttonColor": "#FF0000",
  "buttonTextColor": "#ffffff"
}

Example 2 - Make headline shorter:
❌ WRONG (missing features):
{
  "blockType": "features",
  "heading": "Benefits"
}

✅ RIGHT (all fields):
{
  "blockType": "features",
  "heading": "Benefits",
  "subheading": "Everything you need",
  "features": [
    {"title": "Fast", "description": "Lightning quick", "icon": "lightning"},
    {"title": "Secure", "description": "Bank-grade", "icon": "shield"}
  ],
  "layout": "grid"
}

REMEMBER: Every block needs ALL its fields, not just the changed ones.

RULES:
- Keep same number of blocks unless explicitly requested
- All colors must be hex codes (#ffffff, #000000)
- Keep preview text under 140 characters
- Keep headlines under 80 characters
- Keep CTA text under 30 characters`,
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
        // NOTE: No zodSchema here - we validate after merging with originals
      }
    );

    console.log(`✅ [REFINE-CAMPAIGN-API] ${provider.toUpperCase()} response received (raw JSON)`);

    // 7. Parse AI response and merge with originals
    let refinedContent;
    try {
      // Parse JSON
      console.log('🔄 [REFINE-CAMPAIGN-API] Parsing AI response...');
      let parsed;
      try {
        parsed = JSON.parse(aiResult.content);
      } catch (e) {
        throw new Error('AI returned invalid JSON');
      }
      
      // Merge with originals BEFORE validation
      console.log('🔀 [REFINE-CAMPAIGN-API] Merging refined blocks with originals...');
      const mergedData = {
        subject: parsed.subject ?? currentSubject,
        previewText: parsed.previewText ?? currentPreviewText,
        blocks: mergeBlocks(currentBlocks, parsed.blocks || []),
      };
      
      // Pre-validation completeness check (log warnings)
      const completenessErrors = validateBlockCompleteness(mergedData.blocks);
      if (completenessErrors.length > 0) {
        console.warn('⚠️  [REFINE-CAMPAIGN-API] Blocks may be incomplete:', completenessErrors);
      }
      
      // Validate with Zod
      console.log('✅ [REFINE-CAMPAIGN-API] Validating merged content...');
      refinedContent = EmailContentSchema.parse(mergedData);
      console.log('✅ [REFINE-CAMPAIGN-API] Validation passed');
      console.log('📦 [REFINE-CAMPAIGN-API] Refined blocks:', refinedContent.blocks.length);
    } catch (error) {
      console.error('❌ [REFINE-CAMPAIGN-API] Failed to parse AI response:', error);
      
      // Enhanced error logging
      if (error instanceof ZodError) {
        console.error('📋 [REFINE-CAMPAIGN-API] Validation errors:', error.issues);
        console.error('📋 [REFINE-CAMPAIGN-API] Original blocks count:', currentBlocks.length);
      }
      
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
        blocksChanged: true, // Mark that blocks were actually modified
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
2. Return COMPLETE blocks with ALL required fields (do not omit any fields)
3. Keep the same block structure unless explicitly asked to change it
4. Maintain brand colors and fonts
5. Update preview text if relevant
6. Ensure all content follows email best practices

IMPORTANT: Every block must include ALL its required fields, even if unchanged.

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

