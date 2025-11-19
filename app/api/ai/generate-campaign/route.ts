/**
 * AI Campaign Generation API Route
 * POST /api/ai/generate-campaign
 * 
 * Generates complete email campaigns using AI V2 (React Email system)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCampaignV2 } from '@/lib/email-v2/ai/generator-v2';
import type { GlobalEmailSettings } from '@/lib/email-v2/types';
import { renderEmailComponent } from '@/lib/email-v2/renderer';
import { RateLimitError } from '@/lib/ai/rate-limit';
import { enforceRateLimit } from '@/lib/ai/rate-limit';
import { saveAIGeneration } from '@/lib/ai/usage-tracker';

// ============================================================================
// API Response Types
// ============================================================================

interface SuccessResponse {
  success: true;
  data: {
    id: string;
    campaign: any;
    metadata: any;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: any;
}

// ============================================================================
// Color Palettes
// ============================================================================

const COLOR_PALETTES = [
  {
    name: 'Ethereal Ivory',
    primaryColor: '#1B1B1B',
    secondaryColor: '#595f39',
    backgroundColor: '#E4E4DE',
  },
  {
    name: 'Cerulean Blue',
    primaryColor: '#0F2143',
    secondaryColor: '#354E56',
    backgroundColor: '#F5F5F5',
  },
  {
    name: 'Soft Mint',
    primaryColor: '#19747E',
    secondaryColor: '#A9D6E5',
    backgroundColor: '#D1E8E2',
  },
  {
    name: 'Vivid Orange',
    primaryColor: '#FF9F1C',
    secondaryColor: '#CB997E',
    backgroundColor: '#FFE8D6',
  },
  {
    name: 'Ocean Blue',
    primaryColor: '#023E8A',
    secondaryColor: '#0077B6',
    backgroundColor: '#CAF0F8',
  },
  {
    name: 'Forest Green',
    primaryColor: '#2B9348',
    secondaryColor: '#80B918',
    backgroundColor: '#F5F5F5',
  },
  {
    name: 'Darkest Forest',
    primaryColor: '#283618',
    secondaryColor: '#606052',
    backgroundColor: '#F0EFEB',
  },
  {
    name: 'Pastel Pink',
    primaryColor: '#FFADAD',
    secondaryColor: '#CAFFBF',
    backgroundColor: '#FFFEF9',
  },
];

function getRandomColorPalette() {
  return COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
}

// ============================================================================
// Input Validation Schema
// ============================================================================

interface CampaignInput {
  prompt: string;
  companyName?: string;
  productDescription?: string;
  targetAudience?: string;
  tone?: string;
  campaignType?: 'one-time' | 'sequence' | 'newsletter';
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

function validateInput(body: any): CampaignInput {
  if (!body.prompt || typeof body.prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }
  
  if (body.prompt.length < 10) {
    throw new Error('Prompt must be at least 10 characters');
  }
  
  if (body.prompt.length > 1000) {
    throw new Error('Prompt is too long (max 1000 characters)');
  }
  
  return {
    prompt: body.prompt.trim(),
    companyName: body.companyName || undefined,
    productDescription: body.productDescription || undefined,
    targetAudience: body.targetAudience || undefined,
    tone: body.tone || undefined,
    campaignType: body.campaignType || 'one-time',
    primaryColor: body.primaryColor || undefined,
    secondaryColor: body.secondaryColor || undefined,
    backgroundColor: body.backgroundColor || undefined,
  };
}

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }
    
    // 2. Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON',
        },
        { status: 400 }
      );
    }
    
    // 3. Validate input
    let validatedInput: CampaignInput;
    try {
      validatedInput = validateInput(body);
    } catch (error: any) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: error.message || 'Invalid input',
          code: 'INVALID_INPUT',
        },
        { status: 400 }
      );
    }
    
    // 4. Check rate limits
    console.log('⏱️  [API-V2] Checking rate limits...');
    try {
      await enforceRateLimit(user.id);
    } catch (error: any) {
      if (error instanceof RateLimitError) {
        return NextResponse.json<ErrorResponse>(
          {
            success: false,
            error: error.message,
            code: 'RATE_LIMIT_EXCEEDED',
            details: {
              limitInfo: error.limitInfo,
            },
          },
          { status: 429 }
        );
      }
      throw error;
    }
    console.log('✅ [API-V2] Rate limit check passed');
    
    // 5. Prepare global settings
    // If no colors specified, randomly select from curated palettes
    let colors;
    if (validatedInput.primaryColor) {
      colors = {
        primaryColor: validatedInput.primaryColor,
        secondaryColor: validatedInput.secondaryColor || validatedInput.primaryColor,
        backgroundColor: validatedInput.backgroundColor || '#f9fafb',
      };
      console.log('🎨 [API-V2] Using user-specified colors:', colors.primaryColor);
    } else {
      colors = getRandomColorPalette();
      console.log('🎨 [API-V2] Using random palette:', colors.name);
    }
    
    const globalSettings: GlobalEmailSettings = {
      primaryColor: colors.primaryColor,
      secondaryColor: colors.secondaryColor,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      backgroundColor: colors.backgroundColor,
    };
    
    // 6. Generate campaign using V2 generator
    console.log('🎨 [API-V2] Calling generateCampaignV2...');
    console.log('📝 [API-V2] Prompt:', validatedInput.prompt.substring(0, 100));
    
    let result;
    try {
      result = await generateCampaignV2(
        validatedInput.prompt,
        globalSettings,
        {
          campaignName: `Campaign - ${new Date().toLocaleDateString()}`,
          campaignType: validatedInput.campaignType as any,
          companyName: validatedInput.companyName,
          targetAudience: validatedInput.targetAudience,
          emailType: 'marketing',
          model: 'gemini-2.0-flash-exp',
          temperature: 0.7,
        }
      );
      
      console.log('✅ [API-V2] Campaign generated successfully');
      console.log('📊 [API-V2] Result structure:', {
        hasEmail: !!result.email,
        hasCampaignMetadata: !!result.campaignMetadata,
        hasMetadata: !!result.metadata,
        blocksGenerated: result.metadata.blocksGenerated,
      });
    } catch (error: any) {
      console.error('❌ [API-V2] Generation error:', error);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: error.message || 'Failed to generate campaign',
          code: 'GENERATION_FAILED',
        },
        { status: 500 }
      );
    }
    
    // 7. Render email to HTML for preview
    console.log('📧 [API-V2] Rendering email to HTML...');
    let htmlContent: string;
    try {
      const renderResult = await renderEmailComponent(result.email, globalSettings, {
        pretty: false,
      });
      htmlContent = renderResult.html;
      console.log('✅ [API-V2] Email rendered successfully');
    } catch (error: any) {
      console.error('❌ [API-V2] Render error:', error);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Failed to render email HTML',
          code: 'RENDER_FAILED',
        },
        { status: 500 }
      );
    }
    
    // 8. Extract subject and preview text from email component tree
    const previewComponent = result.email.children?.find(
      (child: any) => child.component === 'Head'
    )?.children?.find((child: any) => child.component === 'Preview');
    
    const previewText = previewComponent?.content || 'Email preview';
    
    // Generate subject line from campaign name or prompt
    const subjectLine = result.campaignMetadata.campaignName.includes('Campaign - ')
      ? validatedInput.prompt.substring(0, 60)
      : result.campaignMetadata.campaignName;
    
    // 9. Save to database
    console.log('💾 [API-V2] Saving to database...');
    
    const startTime = Date.now();
    
    // Save AI usage tracking - wrap V2 data in V1-compatible format
    const generationId = await saveAIGeneration({
      userId: user.id,
      prompt: validatedInput.prompt,
      companyName: validatedInput.companyName,
      productDescription: validatedInput.productDescription,
      targetAudience: validatedInput.targetAudience,
      tone: validatedInput.tone,
      campaignType: validatedInput.campaignType,
      generatedContent: {
        // V1-compatible wrapper
        campaignName: result.campaignMetadata.campaignName,
        campaignType: validatedInput.campaignType || 'one-time',
        emails: [
          {
            subject: subjectLine,
            previewText: previewText,
            blocks: [], // V2 uses component tree, not blocks
          },
        ],
        design: {
          template: 'custom',
          ctaColor: globalSettings.primaryColor,
          accentColor: globalSettings.secondaryColor || globalSettings.primaryColor,
        },
        // Store V2 data in metadata
        v2Data: {
          email: result.email,
          campaignMetadata: result.campaignMetadata,
          globalSettings: globalSettings,
        },
      } as any,
      model: result.metadata.model,
      tokensUsed: result.metadata.tokens,
      promptTokens: Math.floor(result.metadata.tokens * 0.3), // Estimate
      completionTokens: Math.floor(result.metadata.tokens * 0.7), // Estimate
      costUsd: result.metadata.tokens * 0.000001, // Rough estimate for Gemini
      generationTimeMs: result.metadata.timeMs,
    });
    
    console.log('✅ [API-V2] AI generation saved:', { generationId });
    
    // Create campaign record with V2 data
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        id: generationId,
        user_id: user.id,
        name: result.campaignMetadata.campaignName,
        type: validatedInput.campaignType || 'one-time',
        status: 'draft',
        ai_generated: true,
        ai_prompt: validatedInput.prompt,
        subject_line: subjectLine,
        preview_text: previewText,
        from_name: validatedInput.companyName || 'My Company',
        from_email: 'noreply@example.com',
        html_content: htmlContent,
        // V2-specific fields
        version: 'v2',
        root_component: result.email,
        global_settings: globalSettings,
        ai_metadata: {
          campaignMetadata: result.campaignMetadata,
          generationMetadata: result.metadata,
        },
      })
      .select()
      .single();
    
    if (campaignError) {
      console.error('❌ [API-V2] Error creating campaign:', campaignError);
      throw new Error(`Failed to create campaign: ${campaignError.message}`);
    }
    
    console.log('✅ [API-V2] Campaign record created:', { campaignId: campaign.id });
    console.log(`⏱️  [API-V2] Total time: ${Date.now() - startTime}ms`);
    
    // 10. Return success response
    const responseData: SuccessResponse = {
      success: true,
      data: {
        id: generationId,
        campaign: {
          id: campaign.id,
          name: campaign.name,
          type: campaign.type,
          status: campaign.status,
          version: 'v2',
          subjectLine,
          previewText,
        },
        metadata: {
          model: result.metadata.model,
          tokens: result.metadata.tokens,
          timeMs: result.metadata.timeMs,
          blocksGenerated: result.metadata.blocksGenerated,
          recommendedSegment: result.campaignMetadata.recommendedSegment,
          sendTimeSuggestion: result.campaignMetadata.sendTimeSuggestion,
        },
      },
    };
    
    console.log('✅ [API-V2] Returning success response\n');
    return NextResponse.json<SuccessResponse>(responseData, { status: 200 });
    
  } catch (error: any) {
    // Catch-all error handler
    console.error('❌ [API-V2] Unhandled error:', error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: error.message || 'An unexpected server error occurred',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// OPTIONS Handler (CORS preflight)
// ============================================================================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  });
}

