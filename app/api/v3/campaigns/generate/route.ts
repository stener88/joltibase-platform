/**
 * Generate Campaign API Route (V3)
 * 
 * POST /api/v3/campaigns/generate
 * Creates a new wrapper-free email campaign using Gemini + RAG
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { generateEmail } from '@/lib/email-v3/generator';
import { renderEmail } from '@/lib/email-v3/renderer';
import { fromDbRow, type BrandIdentity, type BrandKitDbRow } from '@/lib/types/brand';
import { z } from 'zod';

const GenerateRequestSchema = z.object({
  prompt: z.string().min(10).max(500),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
    
    // Parse and validate request
    const body = await request.json();
    const { prompt, name } = GenerateRequestSchema.parse(body);
    
    console.log(`📧 [GENERATE-V3] User ${user.id}: "${prompt}"`);
    
    // Fetch user's brand settings
    let brand: BrandIdentity | null = null;
    try {
      const { data: brandData } = await supabase
        .from('brand_kits')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (brandData) {
        brand = fromDbRow(brandData as BrandKitDbRow);
        console.log(`🎨 [GENERATE-V3] Using brand: ${brand.companyName}`);
      }
    } catch (error) {
      // Brand not found is OK - user hasn't set one up yet
      console.log(`[GENERATE-V3] No brand settings found`);
    }
    
    // Generate wrapper-free component with RAG and brand (TIMED)
    const genStart = Date.now();
    const generated = await generateEmail(prompt, brand);
    console.log(`⏱️ [GENERATE-V3] Total generation: ${((Date.now() - genStart) / 1000).toFixed(1)}s`);
    
    // Render to HTML (applies wrappers at render time) (TIMED)
    const renderStart = Date.now();
    const renderResult = await renderEmail(generated.filename);
    console.log(`⏱️ [GENERATE-V3] Render: ${((Date.now() - renderStart) / 1000).toFixed(1)}s`);
    
    if (renderResult.error) {
      throw new Error(`Render failed: ${renderResult.error}`);
    }
    
    // Extract subject from prompt (basic heuristic)
    const subject = extractSubjectFromPrompt(prompt);
    
    // Determine status based on validation
    const status = !generated.isValid ? 'needs_review' : 'ready';
    
    // Save to database with validation metadata (TIMED)
    const dbStart = Date.now();
    const { data: campaign, error: dbError } = await supabase
      .from('campaigns_v3')
      .insert({
        user_id: user.id,
        name: name || `Email: ${prompt.substring(0, 50)}`,
        subject_line: subject,
        component_filename: generated.filename,
        component_code: generated.code,
        html_content: renderResult.html,
        design_system_used: generated.designSystemUsed,
        generation_prompt: prompt,
        generation_attempts: generated.attempts,
        validation_issues: generated.validationIssues,
        status,
      })
      .select()
      .single();
    
    console.log(`⏱️ [GENERATE-V3] DB insert: ${((Date.now() - dbStart) / 1000).toFixed(1)}s`);
    
    if (dbError) throw dbError;
    
    console.log(`✅ [GENERATE-V3] Campaign created: ${campaign.id} (${status})`);
    
    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        subject_line: campaign.subject_line,
        html: renderResult.html,
        filename: generated.filename,
        designSystemUsed: generated.designSystemUsed,
        created_at: campaign.created_at,
        status,
        attempts: generated.attempts,
        validationIssues: generated.validationIssues,
        isValid: generated.isValid,
      },
    });
    
  } catch (error: any) {
    console.error('❌ [GENERATE-V3] Error:', error);
    
    // Handle validation errors
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
        error: error.message || 'Campaign generation failed',
      },
      { status: 500 }
    );
  }
}

/**
 * Extract subject line from prompt
 */
function extractSubjectFromPrompt(prompt: string): string {
  // Try to extract explicit subject
  if (prompt.toLowerCase().includes('subject:')) {
    const match = prompt.match(/subject:\s*(.+?)(?:\n|$)/i);
    if (match) return match[1].trim();
  }
  
  // Look for quoted subject
  const quotedMatch = prompt.match(/"([^"]{10,60})"/);
  if (quotedMatch) return quotedMatch[1];
  
  // Fallback: first 50 chars of prompt
  return prompt.substring(0, 50).trim();
}

