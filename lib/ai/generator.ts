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
import { getActiveBrandKit, createBrandKit } from '@/lib/brandkit/operations';
import { renderEmail } from '@/lib/email/templates/renderer';
import type { TemplateRenderInput, EmailContent, ContentSection } from '@/lib/email/templates/types';
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
    
    // 3. Get or create user's brand kit
    console.log('🎨 [GENERATOR] Retrieving brand kit...');
    let brandKit = await getActiveBrandKit(validatedInput.userId);
    if (!brandKit) {
      console.log('📝 [GENERATOR] No brand kit found, creating default...');
      // Create default brand kit if user doesn't have one
      brandKit = await createBrandKit(validatedInput.userId, {
        companyName: validatedInput.companyName || 'My Company',
        primaryColor: '#2563eb',
        secondaryColor: '#3b82f6',
        accentColor: '#f59e0b',
        fontStyle: 'modern',
      });
    }
    console.log('✅ [GENERATOR] Brand kit ready:', { colors: brandKit!.primaryColor });
    
    // 4. Build prompts with brand context
    const systemPrompt = CAMPAIGN_GENERATOR_SYSTEM_PROMPT;
    const userPrompt = buildCampaignPrompt({
      prompt: validatedInput.prompt,
      companyName: validatedInput.companyName,
      productDescription: validatedInput.productDescription,
      targetAudience: validatedInput.targetAudience,
      tone: validatedInput.tone,
      campaignType: validatedInput.campaignType,
      brandKit: {
        primaryColor: brandKit!.primaryColor,
        secondaryColor: brandKit!.secondaryColor,
        accentColor: brandKit!.accentColor || '#f59e0b',
        fontStyle: brandKit!.fontStyle || 'modern',
      },
    });
    
    // 5. Call OpenAI API
    console.log('🤖 [GENERATOR] Calling OpenAI API...');
    const aiResult = await generateCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      {
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        maxTokens: 2000,
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
    const generatedCampaign = parseAndValidateCampaign(aiResult.content);
    console.log('✅ [GENERATOR] Campaign validated:', { 
      name: generatedCampaign.campaignName,
      emailCount: generatedCampaign.emails.length,
      template: generatedCampaign.design.template
    });
    
    // 7. Render HTML emails using templates
    console.log('📧 [GENERATOR] Rendering emails with templates...');
    const renderedEmails = generatedCampaign.emails.map((email, index) => {
      console.log(`  📝 [GENERATOR] Rendering email ${index + 1}/${generatedCampaign.emails.length}: ${email.subject}`);
      // AI now returns structured sections directly - no HTML parsing needed!
      const content: EmailContent = {
        headline: email.subject,
        preheader: email.previewText,
        sections: email.sections || [],
        cta: {
          text: email.ctaText || 'Get Started',
          url: email.ctaUrl || '{{cta_url}}',
        },
        footer: {
          companyName: validatedInput.companyName || '{{company_name}}',
        },
      };
      
      // Render using the specified template
      const templateInput: TemplateRenderInput = {
        template: generatedCampaign.design.template,
        design: {
          template: generatedCampaign.design.template,
          headerGradient: generatedCampaign.design.headerGradient,
          ctaColor: generatedCampaign.design.ctaColor,
          accentColor: generatedCampaign.design.accentColor,
        },
        content,
        brandColors: {
          primaryColor: brandKit!.primaryColor,
          secondaryColor: brandKit!.secondaryColor,
          accentColor: brandKit!.accentColor || '#f59e0b',
          fontStyle: brandKit!.fontStyle || 'modern',
        },
        mergeTags: {
          company_name: validatedInput.companyName || 'Your Company',
        },
      };
      
      const rendered = renderEmail(templateInput);
      
      return {
        subject: rendered.subject,
        previewText: rendered.previewText,
        html: rendered.html,
        plainText: rendered.plainText,
        ctaText: email.ctaText || 'Get Started',
        ctaUrl: email.ctaUrl || '{{cta_url}}',
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

