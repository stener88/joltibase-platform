import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCompletion } from '@/lib/ai/client';
import { getBrandGuidelines } from '@/lib/ai/brand-guidelines';
import { validateEmailHtml, EMAIL_HTML_GUIDELINES } from '@/lib/email/html-validator';
import { z } from 'zod';

/**
 * API Route: POST /api/ai/refine-campaign
 * 
 * Iterative refinement of email campaigns using conversational AI
 * 
 * This endpoint allows users to refine their generated campaigns by
 * describing changes in natural language. The AI will update the campaign
 * based on the user's instructions while maintaining consistency with the
 * original design and brand kit.
 */

// Request validation schema
const RefineCampaignInputSchema = z.object({
  campaignId: z.string().uuid(),
  message: z.string().min(1).max(500),
  currentEmail: z.object({
    subject: z.string(),
    previewText: z.string().optional(),
    html: z.string(), // Full HTML for AI to edit
    plainText: z.string(),
    ctaText: z.string(),
    ctaUrl: z.string(),
  }),
});

type RefineCampaignInput = z.infer<typeof RefineCampaignInputSchema>;

interface RefinedEmail {
  subject: string;
  previewText?: string;
  html: string; // Updated HTML
  plainText: string;
  ctaText: string;
  ctaUrl: string;
  changes: string[]; // List of changes made
}

interface SuccessResponse {
  success: true;
  data: {
    refinedEmail: RefinedEmail;
    message: string;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}

/**
 * Build the refinement prompt for the AI
 */
function buildRefinementPrompt(
  input: RefineCampaignInput,
  brandGuidelines: string
): string {
  return `You are an expert email designer helping to refine an HTML email campaign.

**Current Email:**

Subject: ${input.currentEmail.subject}
Preview Text: ${input.currentEmail.previewText || 'N/A'}
CTA Text: ${input.currentEmail.ctaText}
CTA URL: ${input.currentEmail.ctaUrl}

**Current HTML:**
\`\`\`html
${input.currentEmail.html}
\`\`\`

**Plain Text Version:**
${input.currentEmail.plainText}

---

**User's Refinement Request:**
"${input.message}"

---

${brandGuidelines}

---

${EMAIL_HTML_GUIDELINES}

---

**🚨 CRITICAL: SURGICAL CHANGES ONLY 🚨**

You MUST follow these rules STRICTLY:

1. **EXTRACT EXACT VALUES FROM USER REQUEST**
   Step 1: Parse the user's request to find the EXACT new value
   Example: "change company name to Acme Corp" → Extract "Acme Corp" (exactly as written)
   Example: "make CTA say Start Free Trial" → Extract "Start Free Trial" (exactly as written)
   
   Step 2: Find ALL occurrences of what needs to change (everywhere: subject, body, footer)
   Step 3: Replace ALL of them with the extracted value (not just the first one)
   Step 4: Count how many replacements you made
   
   **WARNING:** Do NOT use example values from this prompt (like "TaskFlow" or "Acme"). 
   ONLY use the EXACT value the user specified in their request.

2. **CHANGE ONLY WHAT WAS EXPLICITLY REQUESTED**
   - If user says "change company name to Acme" → Change ALL company name occurrences to "Acme"
   - If user says "make button say Get Started" → Change ONLY button text to "Get Started"
   - If user says "add a testimonial" → Add ONLY the testimonial, nothing else

3. **DO NOT MAKE UNREQUESTED CHANGES**
   - DO NOT improve copy unless asked
   - DO NOT adjust colors unless asked
   - DO NOT change spacing/padding unless asked
   - DO NOT rewrite content unless asked
   - DO NOT reorganize sections unless asked
   - DO NOT change fonts or styles unless asked

4. **PRESERVE EVERYTHING ELSE EXACTLY**
   - All styles stay identical
   - All colors stay identical
   - All spacing stays identical
   - All other content stays identical
   - All structure stays identical

5. **VALIDATION CHECK (Ask yourself before each change):**
   - "Did the user explicitly request THIS specific change?"
   - "Did I extract the EXACT value they specified?"
   - "Did I replace ALL occurrences (not just one)?"
   - If NO to any → Don't change it
   - If MAYBE → Don't change it
   - If YES to all → Make the change

**Examples of CORRECT behavior:**

User: "change company name to Acme Corp"
Step 1: Extract "Acme Corp" (exactly as written)
Step 2: Find ALL occurrences: subject line (1), body text (2), footer (1) = 4 total
Step 3: Replace ALL 4 with "Acme Corp"
✅ CORRECT: Changed company name to "Acme Corp" in 4 places (subject, body x2, footer)
❌ WRONG: Changed to "TaskFlow" instead, or only changed 1 of 4 occurrences

User: "make CTA say Start Your Free Trial"
Step 1: Extract "Start Your Free Trial" (exactly as written)
Step 2: Find CTA button text (1 occurrence)
Step 3: Replace with "Start Your Free Trial"
✅ CORRECT: Changed CTA text to "Start Your Free Trial" (1 occurrence)
❌ WRONG: Also changed button color, padding, or surrounding text

User: "make CTA button blue"
Step 1: Understand "blue" means change background-color
Step 2: Find CTA button style (1 occurrence)
Step 3: Change background-color to blue (#2563eb or similar)
✅ CORRECT: Changed CTA button background-color to blue
❌ WRONG: Also changed CTA text, button size, or other colors

**Important Technical Rules:**
- Edit the ACTUAL HTML structure and content
- ALL styles must be INLINE (style="...")
- Use tables for layout, not divs with flexbox/grid
- Keep images as absolute HTTPS URLs
- Maintain responsive design (max-width: 600px)
- Preserve merge tags like {{firstName}}, {{companyName}}, {{ctaUrl}}
- Update plain text version to match HTML changes

**Respond with valid JSON:**
\`\`\`json
{
  "subject": "ONLY change if user explicitly requested subject change, otherwise use current: ${input.currentEmail.subject}",
  "previewText": "ONLY change if user explicitly requested preview change, otherwise use current: ${input.currentEmail.previewText || 'N/A'}",
  "html": "complete refined HTML email (FULL HTML with ONLY the requested changes)",
  "plainText": "complete plain text version (with ONLY the requested changes)",
  "ctaText": "ONLY change if user explicitly requested CTA text change, otherwise use current: ${input.currentEmail.ctaText}",
  "ctaUrl": "ONLY change if user explicitly requested URL change, otherwise use current: ${input.currentEmail.ctaUrl}",
  "changes": ["List ONLY the specific changes you made. Include: what changed, to what value, and how many occurrences. Example: 'Changed company name to Acme Corp in 4 places (subject, body x2, footer)'"]
}
\`\`\`

**Final Check Before Responding:**
- Review the user's request one more time
- Verify you changed ONLY what was requested
- Confirm you didn't "improve" unrequested areas
- Return COMPLETE HTML, not excerpts`;
}

export async function POST(request: NextRequest) {
  console.log('🔄 [REFINE-API] Received POST request for /api/ai/refine-campaign');
  
  try {
    // 1. Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('🔐 [REFINE-API] Authentication failed:', authError);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    console.log('✅ [REFINE-API] User authenticated:', user.id);

    // 2. Parse and validate request body
    const body = await request.json();
    console.log('📥 [REFINE-API] Request body parsed');

    let validatedInput: RefineCampaignInput;
    try {
      validatedInput = RefineCampaignInputSchema.parse(body);
      console.log('✅ [REFINE-API] Input validated');
    } catch (error) {
      console.error('❌ [REFINE-API] Validation error:', error);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Invalid request data',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // 3. Verify campaign ownership
    console.log('🔍 [REFINE-API] Verifying campaign ownership...');
    const { data: campaign, error: campaignError } = await supabase
      .from('ai_generations')
      .select('user_id')
      .eq('id', validatedInput.campaignId)
      .single();

    if (campaignError || !campaign) {
      console.error('❌ [REFINE-API] Campaign not found:', campaignError);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Campaign not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    if (campaign.user_id !== user.id) {
      console.error('❌ [REFINE-API] Unauthorized access attempt');
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'You do not have permission to refine this campaign',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    console.log('✅ [REFINE-API] Campaign ownership verified');

    // 4. Get brand guidelines
    console.log('🎨 [REFINE-API] Fetching brand guidelines...');
    const brandGuidelines = await getBrandGuidelines(user.id);
    console.log('✅ [REFINE-API] Brand guidelines retrieved:', brandGuidelines.companyName);

    // 5. Call AI to refine the email
    console.log('🤖 [REFINE-API] Calling AI for refinement...');
    const prompt = buildRefinementPrompt(validatedInput, brandGuidelines.formattedGuidelines);
    
    const aiResult = await generateCompletion(
      [
        {
          role: 'system',
          content: 'You are an expert email designer. You edit HTML emails based on user requests. Always respond with valid JSON only, no additional text. Return the COMPLETE HTML, not excerpts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      {
        temperature: 0.7,
        maxTokens: 4000, // Increased to handle full HTML
        jsonMode: true,
      }
    );

    console.log('✅ [REFINE-API] AI response received:', {
      model: aiResult.model,
      tokens: aiResult.tokensUsed,
      contentLength: aiResult.content.length,
    });

    // 6. Parse and validate AI response
    let refinedEmail: RefinedEmail;
    try {
      const parsed = JSON.parse(aiResult.content);
      refinedEmail = {
        subject: parsed.subject || validatedInput.currentEmail.subject,
        previewText: parsed.previewText || validatedInput.currentEmail.previewText,
        html: parsed.html || validatedInput.currentEmail.html, // Full HTML
        plainText: parsed.plainText || validatedInput.currentEmail.plainText,
        ctaText: parsed.ctaText || validatedInput.currentEmail.ctaText,
        ctaUrl: parsed.ctaUrl || validatedInput.currentEmail.ctaUrl,
        changes: Array.isArray(parsed.changes) ? parsed.changes : ['Email refined based on your request'],
      };
      console.log('✅ [REFINE-API] AI response parsed successfully');
    } catch (error) {
      console.error('❌ [REFINE-API] Failed to parse AI response:', error);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Failed to process AI response. Please try again.',
          code: 'AI_PARSE_ERROR',
        },
        { status: 500 }
      );
    }

    // 7. Validate and sanitize HTML
    console.log('🔍 [REFINE-API] Validating HTML...');
    const validation = validateEmailHtml(refinedEmail.html);
    
    if (!validation.isValid) {
      console.warn('⚠️  [REFINE-API] HTML validation found issues:', validation.errors);
      // Use sanitized version if validation failed
      refinedEmail.html = validation.sanitizedHtml || refinedEmail.html;
    }
    
    if (validation.warnings.length > 0) {
      console.warn('⚠️  [REFINE-API] HTML validation warnings:', validation.warnings);
    }
    
    console.log('✅ [REFINE-API] HTML validated and sanitized');

    // 8. Track usage (optional, for monitoring)
    console.log('📊 [REFINE-API] Tracking AI usage...');
    try {
      await supabase.from('ai_usage').insert({
        user_id: user.id,
        feature: 'campaign_refinement',
        tokens_used: aiResult.tokensUsed,
        cost_usd: aiResult.costUsd || 0,
      });
      console.log('✅ [REFINE-API] Usage tracked');
    } catch (error) {
      console.error('⚠️ [REFINE-API] Failed to track usage (non-critical):', error);
    }

    // 9. Return refined email
    const responseData: SuccessResponse = {
      success: true,
      data: {
        refinedEmail,
        message: `I've made ${refinedEmail.changes.length} change${refinedEmail.changes.length !== 1 ? 's' : ''} to your email: ${refinedEmail.changes.join(', ')}`,
      },
    };

    console.log('✅ [REFINE-API] Returning success response\n');
    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error('❌ [REFINE-API] Unhandled error:', error);
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

