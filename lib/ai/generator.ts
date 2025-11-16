/**
 * AI Campaign Generator - Main Orchestration
 * 
 * Ties everything together: AI prompts, OpenAI API, email templates,
 * brand kits, rate limiting, and database tracking
 */

import { generateCompletion, type AIProvider } from './client';
import { CAMPAIGN_GENERATOR_SYSTEM_PROMPT, buildCampaignPrompt } from './prompts';
import { validateCampaignInput, parseStructuredCampaign, type GeneratedCampaign } from './validator';
import { enforceRateLimit } from './rate-limit';
import { saveAIGeneration } from './usage-tracker';
import { CampaignSchema } from '@/lib/email/blocks/schemas-v2';

import { renderBlocksToEmail } from '@/lib/email/blocks';
import { createClient } from '@/lib/supabase/server';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Robust JSON parser with automatic error fixing
 * Handles common issues from LLM-generated JSON
 */
function parseRobustJSON(content: string): any {
  try {
    // First attempt: standard parsing
    return JSON.parse(content);
  } catch (firstError) {
    console.log('🔧 [PARSER] Initial JSON parse failed, attempting fixes...');
    
    let fixedContent = content;
    
    // Fix 1: Remove trailing commas (very common in LLM output)
    fixedContent = fixedContent.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix 2: Remove comments (shouldn't be in JSON but sometimes appear)
    fixedContent = fixedContent.replace(/\/\/[^\n]*/g, '');
    fixedContent = fixedContent.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Fix 3: Fix unquoted property names (but be careful not to break string values)
    // Match: word characters followed by colon, but only at start of line or after { or ,
    fixedContent = fixedContent.replace(/([\{\,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
    
    // Fix 4: Replace single quotes with double quotes for property names
    // Only for property names (followed by colon)
    fixedContent = fixedContent.replace(/'([^']+)'(\s*:)/g, '"$1"$2');
    
    // Fix 5: Remove any undefined values (replace with null)
    fixedContent = fixedContent.replace(/:\s*undefined/g, ': null');
    
    try {
      const result = JSON.parse(fixedContent);
      console.log('✅ [PARSER] Successfully fixed and parsed JSON!');
      return result;
    } catch (secondError) {
      // Log detailed error information
      console.error('❌ [PARSER] JSON parsing failed after automatic fixes!');
      console.error('📄 [PARSER] Content length:', content.length);
      console.error('📄 [PARSER] First 1000 chars:', content.substring(0, 1000));
      console.error('📄 [PARSER] Last 500 chars:', content.substring(content.length - 500));
      
      // If the error has a position, show content around that position
      const errorMsg = (firstError as Error).message;
      const posMatch = errorMsg.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const start = Math.max(0, pos - 200);
        const end = Math.min(content.length, pos + 200);
        console.error(`📄 [PARSER] Content around error position ${pos}:`, content.substring(start, end));
      }
      
      // Save to file for debugging
      try {
        const fs = require('fs');
        const debugPath = `/tmp/gemini-json-error-${Date.now()}.json`;
        fs.writeFileSync(debugPath, content);
        console.error('💾 [PARSER] Raw content saved to:', debugPath);
        console.error('💾 [PARSER] Fixed content saved to:', debugPath.replace('.json', '-fixed.json'));
        fs.writeFileSync(debugPath.replace('.json', '-fixed.json'), fixedContent);
      } catch (fsError) {
        console.error('⚠️ [PARSER] Could not save debug file:', fsError);
      }
      
      // Throw the original error
      throw firstError;
    }
  }
}

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
    
    // 5. Get Zod Schema for post-generation validation
    // Note: Gemini API doesn't support flexible objects in responseSchema
    const zodSchema = CampaignSchema;
    console.log('📐 [GENERATOR] Prompt-based generation with post-validation (Gemini API limitation)');
    
    // 6. Call AI API (Gemini primary, OpenAI fallback)
    const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';
    console.log(`🤖 [GENERATOR] Using ${provider.toUpperCase()} (33x cheaper, 2-4x faster)`);
    
    const aiResult = await generateCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      {
        provider,
        model: provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o',
        temperature: 0.9, // Increased from 0.7 for more structural diversity
        maxTokens: 8192,
        zodSchema, // Passed for OpenAI fallback
        retries: 3,
      }
    );
    
    console.log(`✅ [GENERATOR] ${aiResult.provider.toUpperCase()} response received:`, { 
      provider: aiResult.provider,
      model: aiResult.model, 
      tokens: aiResult.tokensUsed,
      cost: `$${aiResult.costUsd.toFixed(6)}`,
      time: `${aiResult.generationTimeMs}ms`,
      contentLength: aiResult.content.length 
    });
    
    // 7. Parse structured response (Gemini/OpenAI guarantee schema compliance)
    console.log('🔍 [GENERATOR] Parsing structured response...');
    const parsedContent = parseRobustJSON(aiResult.content);
    const generatedCampaign = parseStructuredCampaign(parsedContent);
    console.log('✅ [GENERATOR] Campaign validated:', { 
      name: generatedCampaign.campaignName,
      emailCount: generatedCampaign.emails.length,
      template: generatedCampaign.design.template
    });
    
    // 8. Render HTML emails using block renderer (parallelized)
    console.log('📧 [GENERATOR] Rendering emails with block renderer (parallel)...');
    console.log('📦 [GENERATOR] Campaign format: blocks');
    
    // Parallelize email rendering for better performance
    const renderedEmails = await Promise.all(
      generatedCampaign.emails.map(async (email, index) => {
        console.log(`  📝 [GENERATOR] Rendering email ${index + 1}/${generatedCampaign.emails.length}: ${email.subject}`);
        
        // Prepare globalSettings with defaults
        const globalSettings = email.globalSettings || {
          backgroundColor: '#f3f4f6',
          contentBackgroundColor: '#ffffff',
          maxWidth: 600,
          fontFamily: 'system-ui',
          mobileBreakpoint: 480,
        };
        
        // Render blocks to email-safe HTML (synchronous but wrapped for future async support)
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
      })
    );
    
    console.log('✅ [GENERATOR] All emails rendered successfully:', { count: renderedEmails.length });
    
    // 9. Calculate total generation time
    const generationTimeMs = Date.now() - startTime;
    
    // 10. Save to database
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
    
    // 11. Create campaign record
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
    
    // 12. Return complete result
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

