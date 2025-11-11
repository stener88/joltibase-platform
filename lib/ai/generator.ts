/**
 * AI Campaign Generator - Main Orchestration
 * 
 * Ties everything together: AI prompts, OpenAI API, email templates,
 * brand kits, rate limiting, and database tracking
 */

import { generateCompletion } from './client';
import { CAMPAIGN_GENERATOR_SYSTEM_PROMPT, buildCampaignPrompt } from './prompts';
import { validateCampaignInput, parseAndValidateCampaign, type GeneratedCampaign } from './validator';
import { enforceRateLimit } from './rate-limit';
import { saveAIGeneration } from './usage-tracker';

import { renderBlocksToEmail } from '@/lib/email/blocks/renderer';
import type { BlockEmail } from '@/lib/email/blocks/types';
import { createClient } from '@/lib/supabase/server';

// ============================================================================
// Generator Input & Output Interfaces
// ============================================================================

export interface GenerateCampaignInput {
  prompt: string;
  userId: string;
  companyName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone?: 'professional' | 'friendly' | 'casual';
  campaignType?: 'one-time' | 'sequence';
}

export interface GeneratedCampaignResult {
  id: string;
  campaign: GeneratedCampaign;
  renderedEmails: Array<{
    subject: string;
    previewText: string;
    html: string;
    plainText: string;
    ctaText: string;
    ctaUrl: string;
  }>;
  metadata: {
    model: string;
    tokensUsed: number;
    promptTokens: number;
    completionTokens: number;
    costUsd: number;
    generationTimeMs: number;
    generatedAt: Date;
  };
}

// ============================================================================
// Main Generator Function
// ============================================================================

/**
 * Generate a complete email campaign using AI
 * 
 * This is the main entry point that orchestrates the entire generation process
 */
export async function generateCampaign(input: GenerateCampaignInput): Promise<GeneratedCampaignResult> {
  const startTime = Date.now();
  console.log('🚀 [GENERATOR] Starting campaign generation...');
  console.log('📝 [GENERATOR] Input:', { userId: input.userId, prompt: input.prompt?.substring(0, 50) + '...' });
  
  try {
    // 1. Validate input
    const validatedInput = validateCampaignInput(input);
    console.log('✅ [GENERATOR] Input validated successfully');
    
    // 2. Check rate limits
    console.log('⏱️  [GENERATOR] Checking rate limits...');
    await enforceRateLimit(validatedInput.userId);
    console.log('✅ [GENERATOR] Rate limit check passed');
    
    // 3. Build prompts
    const systemPrompt = CAMPAIGN_GENERATOR_SYSTEM_PROMPT;
    const userPrompt = buildCampaignPrompt({
      prompt: validatedInput.prompt,
      companyName: validatedInput.companyName,
      productDescription: validatedInput.productDescription,
      targetAudience: validatedInput.targetAudience,
      tone: validatedInput.tone,
      campaignType: validatedInput.campaignType,
      
    });
    
    // 5. Call OpenAI API
    console.log('🤖 [GENERATOR] Calling OpenAI API...');
    const aiResult = await generateCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      {
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 4000,
        jsonMode: true,
        retries: 3,
      }
    );
    console.log('✅ [GENERATOR] OpenAI response received:', { 
      model: aiResult.model, 
      tokens: aiResult.tokensUsed,
      contentLength: aiResult.content.length 
    });
    
    // 6. Validate AI response
    console.log('🔍 [GENERATOR] Validating AI response...');
    console.log('📄 [GENERATOR] AI response preview:', aiResult.content.substring(0, 500));
    const generatedCampaign = parseAndValidateCampaign(aiResult.content);
    console.log('✅ [GENERATOR] Campaign validated:', { 
      name: generatedCampaign.campaignName,
      emailCount: generatedCampaign.emails.length,
      template: generatedCampaign.design.template
    });
    
    // 7. Render HTML emails using block renderer
    console.log('📧 [GENERATOR] Rendering emails with block renderer...');
    console.log('📦 [GENERATOR] Campaign format: blocks');
    const renderedEmails = generatedCampaign.emails.map((email, index) => {
      console.log(`  📝 [GENERATOR] Rendering email ${index + 1}/${generatedCampaign.emails.length}: ${email.subject}`);
      
      // Prepare globalSettings with defaults
      const globalSettings = email.globalSettings || {
        backgroundColor: '#f3f4f6',
        contentBackgroundColor: '#ffffff',
        maxWidth: 600,
        fontFamily: 'system-ui',
        mobileBreakpoint: 480,
      };
      
      // Render blocks to email-safe HTML (pass as separate parameters)
      const html = renderBlocksToEmail(email.blocks, globalSettings);
      
      // Generate plain text version (simplified)
      const plainText = email.blocks
        .filter(block => block.type === 'text' || block.type === 'heading')
        .map(block => {
          if (block.type === 'text' || block.type === 'heading') {
            return block.content.text;
          }
          return '';
        })
        .filter(text => text)
        .join('\n\n');
      
      return {
        subject: email.subject,
        previewText: email.previewText,
        html,
        plainText: plainText || email.subject,
        ctaText: email.blocks.find(b => b.type === 'button')?.content?.text || 'Get Started',
        ctaUrl: email.blocks.find(b => b.type === 'button')?.content?.url || '{{cta_url}}',
      };
    });
    
    console.log('✅ [GENERATOR] All emails rendered successfully:', { count: renderedEmails.length });
    
    // 8. Calculate total generation time
    const generationTimeMs = Date.now() - startTime;
    
    // 9. Save to database
    console.log('💾 [GENERATOR] Saving to database...');
    const generationId = await saveAIGeneration({
      userId: validatedInput.userId,
      prompt: validatedInput.prompt,
      companyName: validatedInput.companyName,
      productDescription: validatedInput.productDescription,
      targetAudience: validatedInput.targetAudience,
      tone: validatedInput.tone,
      campaignType: validatedInput.campaignType,
      generatedContent: generatedCampaign,
      model: aiResult.model,
      tokensUsed: aiResult.tokensUsed,
      promptTokens: aiResult.promptTokens,
      completionTokens: aiResult.completionTokens,
      costUsd: aiResult.costUsd,
      generationTimeMs,
    });
    console.log('✅ [GENERATOR] Saved to database:', { generationId });
    
    // 10. Create campaign record
    console.log('📝 [GENERATOR] Creating campaign record...');
    const supabase = await createClient();
    
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        id: generationId, // Use same ID as ai_generation
        user_id: validatedInput.userId,
        name: generatedCampaign.campaignName,
        type: validatedInput.campaignType || 'one-time',
        status: 'draft',
        ai_generated: true,
        ai_prompt: validatedInput.prompt,
        subject_line: renderedEmails[0]?.subject || '',
        preview_text: renderedEmails[0]?.previewText || '',
        from_name: validatedInput.companyName || 'My Company',
        from_email: 'noreply@example.com', // TODO: Get from user profile
        html_content: JSON.stringify(renderedEmails),
        blocks: generatedCampaign.emails[0]?.blocks || [],
        design_config: generatedCampaign.emails[0]?.globalSettings || null,
        ai_metadata: {
          campaign: generatedCampaign,
          renderedEmails: renderedEmails
        }
      })
      .select()
      .single();
    
    if (campaignError) {
      console.error('❌ [GENERATOR] Error creating campaign:', campaignError);
      throw new Error(`Failed to create campaign: ${campaignError.message}`);
    }
    
    console.log('✅ [GENERATOR] Campaign record created:', { campaignId: campaign.id });
    
    // 11. Return complete result
    const result = {
      id: generationId,
      campaign: generatedCampaign,
      renderedEmails,
      metadata: {
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        promptTokens: aiResult.promptTokens,
        completionTokens: aiResult.completionTokens,
        costUsd: aiResult.costUsd,
        generationTimeMs,
        generatedAt: new Date(),
      },
    };
    
    console.log('🎉 [GENERATOR] Campaign generation complete!');
    console.log('📊 [GENERATOR] Final result:', {
      id: result.id,
      campaignName: result.campaign.campaignName,
      emailCount: result.renderedEmails.length,
      tokensUsed: result.metadata.tokensUsed,
      cost: result.metadata.costUsd,
      timeMs: result.metadata.generationTimeMs
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ [GENERATOR] Error in generateCampaign:', error);
    console.error('📍 [GENERATOR] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

// Note: parseEmailBody function removed - AI now returns structured sections directly
// No need to parse HTML/text since the AI generates ContentSection[] format

