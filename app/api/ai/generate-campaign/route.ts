/**
 * AI Campaign Generation API Route
 * POST /api/ai/generate-campaign
 * 
 * Generates complete email campaigns using AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCampaign } from '@/lib/ai/generator';
import { validateCampaignInput } from '@/lib/ai/validator';
import { RateLimitError } from '@/lib/ai/rate-limit';
import { AIGenerationError } from '@/lib/ai/types';

// ============================================================================
// API Response Types
// ============================================================================

interface SuccessResponse {
  success: true;
  data: {
    id: string;
    campaign: any;
    renderedEmails: any[];
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
    let validatedInput;
    try {
      validatedInput = validateCampaignInput({
        ...body,
        userId: user.id,
      });
    } catch (error: any) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: error.message || 'Invalid input',
          code: 'INVALID_INPUT',
          details: error.errors || undefined,
        },
        { status: 400 }
      );
    }
    
    // 4. Generate campaign
    console.log('🎨 [API] Calling generateCampaign...');
    let result;
    try {
      result = await generateCampaign(validatedInput);
      console.log('✅ [API] Campaign generated successfully');
      console.log('📊 [API] Result structure:', {
        hasId: !!result.id,
        hasCampaign: !!result.campaign,
        hasRenderedEmails: !!result.renderedEmails,
        emailCount: result.renderedEmails?.length || 0,
        hasMetadata: !!result.metadata
      });
    } catch (error: any) {
      // Handle rate limit errors
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
      
      // Handle AI generation errors
      if (error instanceof AIGenerationError) {
        console.error('AI Generation Error:', error);
        return NextResponse.json<ErrorResponse>(
          {
            success: false,
            error: error.message,
            code: 'GENERATION_FAILED',
            details: {
              aiError: error.code,
              retryable: error.retryable,
            },
          },
          { status: 500 }
        );
      }
      
      // Handle unexpected errors
      console.error('Unexpected error in campaign generation:', error);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'An unexpected error occurred during campaign generation',
          code: 'INTERNAL_ERROR',
        },
        { status: 500 }
      );
    }
    
    // 5. Return success response
    console.log('📤 [API] Preparing success response...');
    const responseData = {
      success: true,
      data: {
        id: result.id,
        campaign: result.campaign,
        renderedEmails: result.renderedEmails,
        metadata: result.metadata,
      },
    };
    console.log('📊 [API] Response data structure:', {
      success: responseData.success,
      hasData: !!responseData.data,
      dataId: responseData.data.id,
      emailCount: responseData.data.renderedEmails?.length || 0,
      campaignName: responseData.data.campaign?.campaignName
    });
    console.log('✅ [API] Returning 200 success response\n');
    return NextResponse.json<SuccessResponse>(responseData, { status: 200 });
    
  } catch (error: any) {
    // Catch-all error handler
    console.error('Unhandled error in API route:', error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: 'An unexpected server error occurred',
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

