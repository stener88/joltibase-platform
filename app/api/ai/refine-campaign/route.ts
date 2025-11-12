import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCompletion } from '@/lib/ai/client';
import { 
  EmailBlockSchema, 
  GlobalEmailSettingsSchema,
  validateBlocks,
  type EmailBlockType,
  type GlobalEmailSettingsType 
} from '@/lib/email/blocks/schemas';
import { renderBlocksToEmail } from '@/lib/email/blocks/renderer';
import { sanitizeBlocks } from '@/lib/ai/blocks/sanitizer';
import { z } from 'zod';

/**
 * API Route: POST /api/ai/refine-campaign
 * 
 * Iterative refinement of email campaigns using conversational AI
 * 
 * This endpoint allows users to refine their generated campaigns by
 * describing changes in natural language. The AI will update the campaign's
 * block structure based on the user's instructions while maintaining consistency 
 * with the original design and brand kit.
 */

// Request validation schema
const RefineCampaignInputSchema = z.object({
  campaignId: z.string().uuid(),
  message: z.string().min(1).max(500),
  currentEmail: z.object({
    subject: z.string(),
    previewText: z.string().optional(),
    blocks: z.array(EmailBlockSchema), // Block-based structure
    globalSettings: GlobalEmailSettingsSchema.partial(), // Allow partial settings
  }),
});

type RefineCampaignInput = z.infer<typeof RefineCampaignInputSchema>;

interface RefinedEmail {
  subject: string;
  previewText?: string;
  blocks: EmailBlockType[]; // Modified blocks
  globalSettings: GlobalEmailSettingsType;
  html: string; // Rendered HTML for display
  changes: string[];
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
 * Validate refined blocks structure
 */
function validateRefinedBlocks(blocks: unknown[]): {
  valid: boolean;
  errors?: string[];
} {
  try {
    const validation = validateBlocks(blocks);
    if (!validation.success) {
      // validation.error can be a ZodError or string
      const errorMsg = typeof validation.error === 'string' 
        ? validation.error 
        : validation.error?.message || 'Validation failed';
      return {
        valid: false,
        errors: [errorMsg],
      };
    }
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Unknown validation error'],
    };
  }
}

/**
 * Build the block-based refinement prompt for the AI
 */
function buildBlockRefinementPrompt(
  input: RefineCampaignInput
): string {
  return `You are an expert email designer. Refine this email campaign by modifying its block structure.

**Current Email Structure:**

Subject: ${input.currentEmail.subject}
Preview Text: ${input.currentEmail.previewText || 'N/A'}

**Current Blocks (JSON):**
${JSON.stringify(input.currentEmail.blocks, null, 2)}

**Global Settings:**
${JSON.stringify(input.currentEmail.globalSettings, null, 2)}

---

**User's Refinement Request:**
"${input.message}"

---

**CRITICAL: Block-Based Refinement Rules**

1. **MODIFY BLOCKS, NOT HTML**
   - Change block content, settings, or add/remove blocks
   - DO NOT generate HTML directly
   - Follow the same block structure as shown above
   - Return COMPLETE blocks array (not excerpts)

2. **SURGICAL CHANGES ONLY**
   - Change ONLY what the user explicitly requested
   - Preserve all other blocks, settings, and content EXACTLY
   - If changing text, ONLY change the specific text requested
   - If changing colors, ONLY change the specific color requested
   - Maintain positions sequential (0, 1, 2...) after any add/remove

3. **COMMON REFINEMENT PATTERNS:**

   **a) Change text content:**
      - Find the text/heading block with matching content
      - Update ONLY the "content.text" field
      - Preserve ALL settings exactly as they are
      Example: User says "change headline to Welcome Back"
      → Find heading block, change content.text to "Welcome Back"
   
   **b) Change button text/URL:**
      - Find the button block
      - Update "content.text" or "content.url" ONLY
      - Preserve ALL other settings
      Example: User says "make button say Get Started"
      → Find button block, change content.text to "Get Started"
   
   **c) Change colors:**
      - Find the specific block mentioned
      - Update ONLY "settings.color" or "settings.backgroundColor"
      - Use hex colors (#rrggbb format)
      Example: User says "make CTA button green"
      → Find button block, change settings.color to "#16a34a"
   
   **d) Add a block:**
      - Insert new block with proper structure: id, type, position, content, settings
      - ALL fields must be present and valid
      - Renumber positions of blocks after insertion point
      - Use unique ID (e.g., "new-block-1", "testimonial-added")
   
   **e) Remove a block:**
      - Remove the specified block from array
      - Renumber positions of all remaining blocks to be sequential
   
   **f) Change spacing:**
      - For spacer blocks: update "settings.height" (number)
      - For other blocks: update "settings.padding" (object with top/bottom/left/right)

4. **VALIDATION REQUIREMENTS (CRITICAL):**
   - Every block MUST have: id (string), type (string), position (number), content (object), settings (object)
   - Positions MUST be sequential integers starting at 0 (0, 1, 2, 3...)
   - **ALL blocks (except spacer) MUST have "padding" in settings**: OBJECT with { top: number, bottom: number, left: number, right: number }
   - lineHeight = STRING (e.g., "1.6", not 1.6)
   - fontWeight = NUMBER (e.g., 700, not "700")
   - align = STRING ("left", "center", or "right")
   
   **Special Requirements by Block Type:**
   - **stats**: Must have "layout" ("2-col", "3-col", "4-col") and "labelFontWeight" (number)
   - **testimonial**: Must have in content: "quote" (string) and "author" (string, person's name); optional: "role", "company", "avatarUrl". Must have in settings: "quoteFontSize" (string like "20px"), "quoteColor" (hex), "quoteFontStyle" ("normal" or "italic"), "authorFontSize" (string like "15px"), "authorColor" (hex), and "authorFontWeight" (number)
   - **feature-grid**: Must have in settings: "layout" ("2-col", "3-col", "single-col"), "align" ("left", "center", "right"), "iconSize" (string like "48px"), "titleFontSize" (string like "19px"), "titleFontWeight" (number like 700), "titleColor" (hex), "descriptionFontSize" (string like "15px"), "descriptionColor" (hex), "padding" (object), "spacing" (number). Must have in content: "features" (array of objects with icon (single emoji character, optional), title, description)
   - **image/logo/hero**: Must have "imageUrl" and "altText" in content
   - **button**: Must have "containerPadding" in settings
   - **footer**: Always keep at end with position = last

5. **VALIDATION CHECK (Before responding):**
   - Did I change ONLY what was requested?
   - Are all required fields present for each block?
   - Are positions sequential (0, 1, 2...)?
   - Are data types correct (lineHeight=STRING, fontWeight=NUMBER)?
   - Did I preserve everything else exactly?

**Examples of CORRECT Refinements:**

User: "make the headline bigger"
Response: Find heading block → change fontSize from "32px" to "44px" → keep everything else identical

User: "change button to say Start Free Trial"
Response: Find button block → change content.text to "Start Free Trial" → keep everything else identical

User: "add more spacing after hero"
Response: Find spacer after hero block → increase settings.height from 40 to 60 → keep everything else identical

User: "make CTA button purple"
Response: Find button block → change settings.color to "#7c3aed" → keep everything else identical

User: "add a testimonial after the features"
Response: Insert new testimonial block after features → renumber subsequent positions → include ALL required fields

**Respond with valid JSON ONLY:**
{
  "subject": "Updated subject (or keep current: ${input.currentEmail.subject})",
  "previewText": "Updated preview (or keep current: ${input.currentEmail.previewText || ''})",
  "blocks": [
    /* COMPLETE array of ALL blocks with changes applied */
  ],
  "globalSettings": {
    /* COMPLETE globalSettings object (usually unchanged) */
  },
  "changes": [
    "List specific changes made. Be precise: 'Changed button text from X to Y', 'Increased hero padding from 60px to 80px'"
  ]
}

**Final Reminder:**
- Return COMPLETE blocks array (not partial)
- Change ONLY what was requested
- Maintain all required fields
- Sequential positions (0, 1, 2...)
- Correct data types (STRING lineHeight, NUMBER fontWeight, OBJECT padding)`;
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
          error: 'Invalid request data. Ensure you are sending blocks array and globalSettings.',
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

    // 4. Call AI to refine the blocks
    console.log('🤖 [REFINE-API] Calling AI for block-based refinement...');
    const prompt = buildBlockRefinementPrompt(validatedInput);
    
    const aiResult = await generateCompletion(
      [
        {
          role: 'system',
          content: 'You are an expert email designer. You modify email block structures based on user requests. Always respond with valid JSON only, no additional text. Return COMPLETE blocks array with ALL required fields.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      {
        temperature: 0.7,
        maxTokens: 4000,
        jsonMode: true,
      }
    );

    console.log('✅ [REFINE-API] AI response received:', {
      model: aiResult.model,
      tokens: aiResult.tokensUsed,
      contentLength: aiResult.content.length,
    });

    // 6. Parse AI response
    let aiResponse: {
      subject: string;
      previewText?: string;
      blocks: unknown[];
      globalSettings: unknown;
      changes: string[];
    };

    try {
      aiResponse = JSON.parse(aiResult.content);
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

    // 7. Sanitize blocks (add missing required fields with sensible defaults)
    console.log('🧹 [REFINE-API] Sanitizing refined blocks...');
    const sanitizedBlocks = sanitizeBlocks(aiResponse.blocks);
    console.log('✅ [REFINE-API] Blocks sanitized');

    // 8. Validate blocks with Zod
    console.log('🔍 [REFINE-API] Validating refined blocks...');
    const blockValidation = validateRefinedBlocks(sanitizedBlocks);
    
    if (!blockValidation.valid) {
      console.error('❌ [REFINE-API] Block validation failed:', blockValidation.errors);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Invalid block structure returned by AI: ' + (blockValidation.errors?.join(', ') || 'Unknown error'),
          code: 'BLOCK_VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    console.log('✅ [REFINE-API] Blocks validated successfully');

    // 9. Render blocks to HTML (use sanitized blocks)
    console.log('📧 [REFINE-API] Rendering blocks to HTML...');
    const renderedHtml = renderBlocksToEmail(
      sanitizedBlocks as EmailBlockType[],
      aiResponse.globalSettings as GlobalEmailSettingsType
    );

    console.log('✅ [REFINE-API] Blocks rendered to HTML');

    // 10. Construct refined email response
    const refinedEmail: RefinedEmail = {
      subject: aiResponse.subject || validatedInput.currentEmail.subject,
      previewText: aiResponse.previewText || validatedInput.currentEmail.previewText,
      blocks: sanitizedBlocks as EmailBlockType[],
      globalSettings: aiResponse.globalSettings as GlobalEmailSettingsType,
      html: renderedHtml,
      changes: Array.isArray(aiResponse.changes) ? aiResponse.changes : ['Email refined based on your request'],
    };

    // 11. Track usage
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
      console.error('⚠️  [REFINE-API] Failed to track usage (non-critical):', error);
    }

    // 12. Return refined email
    const responseData: SuccessResponse = {
      success: true,
      data: {
        refinedEmail,
        message: `I've made ${refinedEmail.changes.length} change${refinedEmail.changes.length !== 1 ? 's' : ''} to your email: ${refinedEmail.changes.join(', ')}`,
      },
    };

    console.log('✅ [REFINE-API] Returning success response');
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
