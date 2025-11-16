import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { errorResponse, CommonErrors } from '@/lib/api/responses';
import { generateCompletion, type AIProvider } from '@/lib/ai/client';
import { 
  GlobalEmailSettingsSchema,
  type EmailBlockType,
  type GlobalEmailSettingsType 
} from '@/lib/email/blocks/schemas';
import { BlockSchema } from '@/lib/email/blocks/schemas-v2'; // Flexible schema for input validation
import { renderBlocksToEmail } from '@/lib/email/blocks';
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

// Request validation schema (use flexible schema for input)
const RefineCampaignInputSchema = z.object({
  campaignId: z.string().uuid(),
  message: z.string().min(1).max(500),
  currentEmail: z.object({
    subject: z.string(),
    previewText: z.string().optional(),
    blocks: z.array(BlockSchema), // Use flexible BlockSchema for existing blocks
    globalSettings: GlobalEmailSettingsSchema.partial(), // Allow partial settings
  }),
});

type RefineCampaignInput = z.infer<typeof RefineCampaignInputSchema>;

/**
 * Schema for AI refine response (use flexible schema for AI output)
 */
const RefineResponseSchema = z.object({
  subject: z.string().min(1).max(100),
  previewText: z.string().max(150).optional(),
  blocks: z.array(BlockSchema).min(1), // Use flexible BlockSchema for AI-generated blocks
  globalSettings: GlobalEmailSettingsSchema.optional(),
  changes: z.array(z.string()).optional(), // Technical tracking
  conversationalMessage: z.string().min(20).max(500), // Natural, colleague-like response for chat UI
});

type RefineResponse = z.infer<typeof RefineResponseSchema>;

/**
 * Get Zod schema for refine response (native Gemini support!)
 */
function getRefineSchema(): z.ZodType<any> {
  return RefineResponseSchema;
}

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
 * Detect if a user request is a major redesign vs minor refinement
 */
function detectRequestType(message: string): 'major' | 'minor' | 'ambiguous' {
  const lowerMessage = message.toLowerCase();
  
  // Major redesign keywords
  const majorKeywords = [
    'remake',
    'redesign',
    'completely',
    'start over',
    'rebuild',
    'whole',
    'entire',
    'from scratch',
    'new design',
    'completely new',
    'totally',
    'entirely',
  ];
  
  // Check for major keywords
  const hasMajorKeyword = majorKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check for explicit major requests
  const explicitMajorPatterns = [
    /remake\s+(the\s+)?(whole|entire)/i,
    /redesign\s+(the\s+)?(whole|entire)/i,
    /completely\s+(remake|redesign|rebuild)/i,
    /start\s+over/i,
    /from\s+scratch/i,
  ];
  
  const hasExplicitMajor = explicitMajorPatterns.some(pattern => pattern.test(message));
  
  if (hasMajorKeyword || hasExplicitMajor) {
    return 'major';
  }
  
  // Ambiguous requests (questions, vague statements)
  const ambiguousPatterns = [
    /^(what|how|can you|could you|would you)/i,
    /^(maybe|perhaps|i think|i feel)/i,
    /\?$/,
  ];
  
  const isAmbiguous = ambiguousPatterns.some(pattern => pattern.test(message.trim()));
  
  if (isAmbiguous && !hasMajorKeyword) {
    return 'ambiguous';
  }
  
  // Default to minor refinement
  return 'minor';
}

/**
 * Build the block-based refinement prompt for the AI
 */
function buildBlockRefinementPrompt(
  input: RefineCampaignInput
): string {
  const requestType = detectRequestType(input.message);
  
  // Build request-specific instructions
  let requestTypeInstructions = '';
  
  if (requestType === 'major') {
    requestTypeInstructions = `
**🚨 MAJOR REDESIGN REQUEST DETECTED**

The user has requested a major redesign (keywords: "remake", "redesign", "completely", "whole", etc.).

**CRITICAL INSTRUCTIONS FOR MAJOR REQUESTS:**
1. **EXECUTE THE FULL REDESIGN FIRST** - Don't just suggest improvements, actually remake/redesign the email as requested
2. **Create a fresh structure** - You can significantly change the block layout, add/remove blocks, reorganize content
3. **Maintain email best practices** - Keep footer, ensure proper spacing, maintain readability
4. **After executing the redesign**, you can suggest additional improvements in your conversational message
5. **DO NOT** keep the structure "largely intact" - that's for minor requests only

Example: User says "remake the whole newsletter"
✅ CORRECT: Create a completely new newsletter structure with different blocks, layout, and content flow
❌ WRONG: Keep existing structure and just suggest improvements

**Remember**: For major requests, EXECUTION comes first, suggestions come second.`;
  } else if (requestType === 'ambiguous') {
    requestTypeInstructions = `
**❓ AMBIGUOUS REQUEST DETECTED**

The user's request is unclear or asks a question. 

**INSTRUCTIONS FOR AMBIGUOUS REQUESTS:**
1. **Ask clarifying questions** in your conversational message before making changes
2. **Suggest what you think they might want** and ask for confirmation
3. **Only make changes** if you're confident about the intent
4. **If unsure**, ask: "I'd love to help! Could you clarify what you'd like me to change? For example, are you looking to [suggestion 1] or [suggestion 2]?"`;
  } else {
    requestTypeInstructions = `
**✅ MINOR REFINEMENT REQUEST DETECTED**

This is a specific, surgical change request. Follow the surgical refinement rules below.`;
  }
  
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

${requestTypeInstructions}

**CRITICAL: Block-Based Refinement Rules**

1. **MODIFY BLOCKS, NOT HTML**
   - Change block content, settings, or add/remove blocks
   - DO NOT generate HTML directly
   - Follow the same block structure as shown above
   - Return COMPLETE blocks array (not excerpts)

${requestType === 'major' ? '' : `2. **SURGICAL CHANGES ONLY** (for minor requests)
   - Change ONLY what the user explicitly requested
   - Preserve all other blocks, settings, and content EXACTLY
   - If changing text, ONLY change the specific text requested
   - If changing colors, ONLY change the specific color requested
   - Maintain positions sequential (0, 1, 2...) after any add/remove`}

${requestType === 'major' ? `2. **MAJOR REDESIGN EXECUTION** (for major requests)
   - Execute the full redesign as requested
   - You can significantly change block structure, layout, and content
   - Create a fresh, improved version based on the user's request
   - Maintain email best practices (footer, spacing, readability)
   - After executing, suggest additional improvements in conversational message` : ''}

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
     Example: "content": {"features": [{"icon": "⚡", "title": "Fast", "description": "Lightning fast performance"}, {"icon": "🔒", "title": "Secure", "description": "Bank-level security"}]}
     ❌ WRONG: Do NOT create "icon-url-1", "icon-url-2", "icon-url-3" at block level - icons belong in the features array
   - **image/logo/hero**: Must have "imageUrl" and "altText" in content
   - **button**: Must have "containerPadding" in settings
   - **social-links**: Must have in content: "links" (array of objects with "platform" and "url"). Platform must be one of: "twitter", "linkedin", "facebook", "instagram", "youtube", "github", "tiktok". URLs must be valid (e.g., "https://twitter.com/company") or merge tag placeholders (e.g., "{{twitter_url}}")
   - **footer**: Always keep at end with position = last

5. **VALIDATION CHECK (Before responding):**
   ${requestType === 'major' ? '- Did I execute the full redesign as requested?' : '- Did I change ONLY what was requested?'}
   - Are all required fields present for each block?
   - Are positions sequential (0, 1, 2...)?
   - Are data types correct (lineHeight=STRING, fontWeight=NUMBER)?
   ${requestType === 'major' ? '' : '- Did I preserve everything else exactly?'}

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

User: "add social media icons to the footer"
Response: Insert new social-links block before footer → include links array with platform and valid URLs (e.g., [{"platform": "twitter", "url": "https://twitter.com/company"}, {"platform": "linkedin", "url": "https://linkedin.com/company/company"}]) → include ALL required settings fields

${requestType === 'major' ? `User: "remake the whole newsletter"
Response: Create a completely new newsletter structure with different blocks, layout, and content flow. Execute the full redesign, don't just suggest improvements.` : ''}

**CONVERSATIONAL MESSAGE (Required):**
Write a natural, colleague-like message (20-500 characters) that:
${requestType === 'major' ? `- Explains what you redesigned and why ("I've completely remade the newsletter with a fresh structure because...")
- After executing the redesign, suggest 1-2 additional improvements ("Now that we've redesigned it, we could also...")
- Ask if they want any adjustments ("Want me to tweak anything else?")` : requestType === 'ambiguous' ? `- Ask clarifying questions if the request is unclear
- Suggest what you think they might want and ask for confirmation
- Only make changes if you're confident about the intent` : `- Explains what you changed and why ("I updated the headline to be more action-oriented because...")
- Proactively suggests 1-2 related improvements ("While we're at it, we could also...")
- Asks a clarifying question or invites iteration ("Want me to adjust the spacing too?")`}
- Feels enthusiastic and collaborative, not robotic

Examples of good conversational messages:
${requestType === 'major' ? `- "Perfect! I've completely remade the newsletter with a fresh, modern layout. The new structure flows much better. Want me to add a stats section to boost credibility?"
- "Done! I've redesigned the whole newsletter from scratch - new blocks, better spacing, and a more engaging flow. What do you think? Should we add more visual elements?"` : `- "Perfect! I've made the headline bigger and bolder - it'll really grab attention. I also noticed the CTA button could use a bit more contrast. Want me to tweak that too?"
- "Done! Changed the button text to 'Start Free Trial' and made it more prominent. I'm thinking we could add a bit more urgency with a limited-time offer. Should I add that?"
- "Great idea! I've added the testimonial section after the features. It flows nicely now. What do you think about adding a stats section too?"`}

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
  ],
  "conversationalMessage": "Your natural, colleague-like response here (20-500 chars)"
}

**Final Reminder:**
- Return COMPLETE blocks array (not partial)
${requestType === 'major' ? '- Execute the full redesign as requested' : '- Change ONLY what was requested'}
- Maintain all required fields
- Sequential positions (0, 1, 2...)
- Correct data types (STRING lineHeight, NUMBER fontWeight, OBJECT padding)`;
}

export async function POST(request: NextRequest) {
  console.log('🔄 [REFINE-API] Received POST request for /api/ai/refine-campaign');
  
  try {
    // 1. Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
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
      return CommonErrors.validationError('Invalid request data. Ensure you are sending blocks array and globalSettings.');
    }

    // 3. Verify campaign ownership (check campaigns table for both AI-generated and manually created campaigns)
    console.log('🔍 [REFINE-API] Verifying campaign ownership...');
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
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

    // 4. Get Zod Schema for Gemini (or JSON Schema for OpenAI fallback)
    const zodSchema = getRefineSchema();
    console.log('📐 [REFINE-API] Using native Zod schema with Gemini');
    
    // 5. Call AI to refine the blocks (Gemini primary, OpenAI fallback)
    console.log('🤖 [REFINE-API] Calling AI for block-based refinement...');
    const prompt = buildBlockRefinementPrompt(validatedInput);
    
    const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';
    
    const aiResult = await generateCompletion(
      [
        {
          role: 'system',
          content: `You're a creative email design partner - think of yourself as a colleague who's genuinely excited about crafting amazing emails. You're collaborative, proactive, and always looking for ways to optimize.

When refining emails:
- Explain your reasoning ("I changed X because...")
- Proactively suggest improvements ("While we're at it, consider...")
- Ask clarifying questions ("Should we also...?")
- Share ideas enthusiastically ("What if we tried...?")

Be conversational, enthusiastic, and helpful - like you're brainstorming with a teammate. Return COMPLETE blocks array with ALL required fields.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      {
        provider,
        model: provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o',
        temperature: 0.7,
        maxTokens: 8192,
        zodSchema, // Passed for OpenAI fallback
      }
    );

    console.log(`✅ [REFINE-API] ${aiResult.provider.toUpperCase()} response received:`, {
      provider: aiResult.provider,
      model: aiResult.model,
      tokens: aiResult.tokensUsed,
      cost: `$${aiResult.costUsd.toFixed(6)}`,
      contentLength: aiResult.content.length,
    });

    // 6. Parse structured response (Gemini/OpenAI guarantee schema compliance)
    let aiResponse: RefineResponse;

    try {
      const parsed = JSON.parse(aiResult.content);
      // Validate with Zod (mainly for type checking since structured outputs guarantee compliance)
      aiResponse = RefineResponseSchema.parse(parsed);
      console.log('✅ [REFINE-API] Structured response parsed and validated');
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

    // 7. Blocks already validated by RefineResponseSchema (using flexible BlockSchema)
    console.log('✅ [REFINE-API] Blocks validated successfully');

    // 8. Render blocks to HTML
    console.log('📧 [REFINE-API] Rendering blocks to HTML...');
    const globalSettings = aiResponse.globalSettings || validatedInput.currentEmail.globalSettings as GlobalEmailSettingsType;
    const renderedHtml = renderBlocksToEmail(
      aiResponse.blocks as EmailBlockType[],
      globalSettings
    );

    console.log('✅ [REFINE-API] Blocks rendered to HTML');

    // 9. Construct refined email response
    const refinedEmail: RefinedEmail = {
      subject: aiResponse.subject || validatedInput.currentEmail.subject,
      previewText: aiResponse.previewText || validatedInput.currentEmail.previewText,
      blocks: aiResponse.blocks as EmailBlockType[],
      globalSettings: globalSettings,
      html: renderedHtml,
      changes: Array.isArray(aiResponse.changes) ? aiResponse.changes : ['Email refined based on your request'],
    };

    // 10. Track usage
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

    // 11. Return refined email
    const responseData: SuccessResponse = {
      success: true,
      data: {
        refinedEmail,
        message: aiResponse.conversationalMessage || `I've made ${refinedEmail.changes.length} change${refinedEmail.changes.length !== 1 ? 's' : ''} to your email: ${refinedEmail.changes.join(', ')}`,
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
