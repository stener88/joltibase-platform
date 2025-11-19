/**
 * AI Element Refinement API
 * 
 * Endpoint for refining individual elements within blocks using AI.
 * Scoped to single element changes for precise, focused edits.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/api/auth';
import { generateCompletion, type AIProvider } from '@/lib/ai/client';

// ============================================================================
// Request Schema
// ============================================================================

const RefineElementInputSchema = z.object({
  campaignId: z.string().min(1),
  blockId: z.string().min(1),
  elementId: z.string().min(1),
  elementType: z.enum([
    'block',
    'title',
    'header',
    'paragraph',
    'text',
    'button',
    'image',
    'divider',
    'logo',
    'spacer',
    'social-link',
    'footer-text',
    'footer-link',
    'stat-value',
    'stat-title',
    'stat-description',
    'subtitle',
    'badge',
  ]),
  currentValue: z.record(z.string(), z.any()),
  currentSettings: z.record(z.string(), z.any()).optional(), // ADD: Include settings
  prompt: z.string().min(1).max(500),
});

type RefineElementInput = z.infer<typeof RefineElementInputSchema>;

// ============================================================================
// Response Schema
// ============================================================================

const RefineElementResponseSchema = z.object({
  changes: z.record(z.string(), z.any()),
  explanation: z.string(),
});

// ============================================================================
// API Handler
// ============================================================================

export async function POST(request: NextRequest) {
  console.log('🔄 [REFINE-ELEMENT-API] Received POST request');
  
  try {
    // 1. Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    
    const { user, supabase } = authResult;
    console.log('✅ [REFINE-ELEMENT-API] User authenticated:', user.id);

    // 2. Parse and validate request body
    const body = await request.json();
    let validatedInput: RefineElementInput;
    
    try {
      validatedInput = RefineElementInputSchema.parse(body);
      console.log('✅ [REFINE-ELEMENT-API] Input validated');
    } catch (error) {
      console.error('❌ [REFINE-ELEMENT-API] Validation error:', error);
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
      console.error('❌ [REFINE-ELEMENT-API] Campaign not found');
      return NextResponse.json(
        { success: false, error: 'Campaign not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (campaign.user_id !== user.id) {
      console.error('❌ [REFINE-ELEMENT-API] Unauthorized access');
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    console.log('✅ [REFINE-ELEMENT-API] Campaign ownership verified');

    // 4. Build element-specific prompt
    console.log('📝 [REFINE-ELEMENT-API] User prompt:', validatedInput.prompt);
    console.log('🎯 [REFINE-ELEMENT-API] Element type:', validatedInput.elementType);
    console.log('📋 [REFINE-ELEMENT-API] Current value:', JSON.stringify(validatedInput.currentValue, null, 2));
    console.log('⚙️ [REFINE-ELEMENT-API] Current settings:', JSON.stringify(validatedInput.currentSettings || {}, null, 2));
    
    const elementPrompt = buildElementRefinementPrompt(validatedInput);
    
    // 5. Call AI with element-specific context
    // Detect if simple change for token optimization
    const isSimple = isSimplePropertyChange(validatedInput.prompt);
    const maxTokens = isSimple ? 400 : 1000;
    console.log(`🎯 [REFINE-ELEMENT-API] Request type: ${isSimple ? 'SIMPLE' : 'COMPLEX'} (maxTokens: ${maxTokens})`);
    
    const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';
    
    const aiResult = await generateCompletion(
      [
        {
          role: 'system',
          content: isSimple 
            ? `You are a precise email element editor. Make the requested change using correct camelCase property names. Respond concisely in JSON format.`
            : `You are a focused email element editor. You only modify the specific element the user requests. Be concise and explain what you changed.`,
        },
        {
          role: 'user',
          content: elementPrompt,
        },
      ],
      {
        provider,
        model: provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o',
        temperature: 0.7,
        maxTokens,
        zodSchema: RefineElementResponseSchema,
      }
    );

    console.log(`✅ [REFINE-ELEMENT-API] ${aiResult.provider.toUpperCase()} response received`);

    // 6. Parse AI response
    let refinedElement;
    try {
      refinedElement = RefineElementResponseSchema.parse(JSON.parse(aiResult.content));
      console.log('✅ [REFINE-ELEMENT-API] Response validated');
    } catch (error) {
      console.error('❌ [REFINE-ELEMENT-API] Failed to parse AI response:', error);
      return NextResponse.json(
        { success: false, error: 'AI response parsing failed', code: 'PARSE_ERROR' },
        { status: 500 }
      );
    }

    // 7. Track usage
    try {
      await supabase.from('ai_usage').insert({
        user_id: user.id,
        feature: 'element_refinement',
        tokens_used: aiResult.tokensUsed,
        cost_usd: aiResult.costUsd || 0,
      });
      console.log('✅ [REFINE-ELEMENT-API] Usage tracked');
    } catch (usageError) {
      console.error('⚠️  [REFINE-ELEMENT-API] Failed to track usage (non-critical)');
    }

    // 8. Return refined element
    return NextResponse.json({
      success: true,
      data: {
        changes: refinedElement.changes,
        explanation: refinedElement.explanation,
        tokensUsed: aiResult.tokensUsed,
        costUsd: aiResult.costUsd,
      },
    });

  } catch (error: unknown) {
    console.error('❌ [REFINE-ELEMENT-API] Unexpected error:', error);
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

// Element-Specific Prompt Templates
// Each template provides focused guidance for optimal AI refinement
const ELEMENT_PROMPT_TEMPLATES: Record<string, {
  role: string;
  focus: string[];
  examples: string[];
}> = {
  title: {
    role: "You're editing a headline/title",
    focus: ["Clarity", "Brevity (aim for < 60 chars)", "Impact", "Emotional resonance"],
    examples: [
      "'Make it punchier' → Use shorter words, stronger verbs, remove filler",
      "'More urgent' → Add time pressure words like 'Now', 'Today', 'Limited'",
      "'Professional' → Remove casual language, use industry terms"
    ]
  },
  button: {
    role: "You're editing a CTA (call-to-action) button",
    focus: ["Action verbs", "Urgency", "Clear value proposition", "3-5 words max"],
    examples: [
      "'More urgent' → 'Get Started Now', 'Claim Your Spot', 'Start Free Trial Today'",
      "'Softer' → 'Learn More', 'See How It Works', 'Explore Options'",
      "'Add value' → Include benefit: 'Save 50% Today', 'Get Free Access'"
    ]
  },
  paragraph: {
    role: "You're editing body paragraph text",
    focus: ["Clarity", "Readability", "Persuasiveness", "Scanability"],
    examples: [
      "'Make it shorter' → Cut to 2-3 sentences, remove redundancy",
      "'More conversational' → Use 'you', contractions, rhetorical questions",
      "'Add benefits' → Focus on outcomes, not features"
    ]
  },
  image: {
    role: "You're editing an image element",
    focus: ["Alt text accessibility", "URL validity", "Descriptive text"],
    examples: [
      "'Better alt text' → Describe what's in the image for screen readers",
      "'Change image' → Update imageUrl to the new URL",
      "'Add link' → Set linkUrl to make image clickable"
    ]
  },
  logo: {
    role: "You're editing a logo image",
    focus: ["Brand representation", "Alt text", "Consistent sizing"],
    examples: [
      "'Update logo' → Change imageUrl to new logo asset",
      "'Better alt text' → Use company name for accessibility",
      "'Make it clickable' → Add linkUrl to homepage"
    ]
  },
  'stat-value': {
    role: "You're editing a statistic number/value",
    focus: ["Numerical impact", "Format (%, $, etc)", "Specificity"],
    examples: [
      "'Make it bigger' → Increase number to be more impressive",
      "'Add context' → Change '500' to '500+' or '500K'",
      "'Round it' → '127' → '130' or '100+'"
    ]
  },
  'stat-title': {
    role: "You're editing a statistic label",
    focus: ["Clarity", "Unit description", "Impact"],
    examples: [
      "'More specific' → 'Users' → 'Active Monthly Users'",
      "'Shorter' → 'Customer Satisfaction Rate' → 'Satisfaction'",
      "'Action-oriented' → 'Downloads' → 'Downloaded by'"
    ]
  },
  badge: {
    role: "You're editing a badge/label",
    focus: ["Brevity (1-2 words)", "Attention-grabbing", "Status/category"],
    examples: [
      "'More exciting' → 'New' → 'Just Launched', 'Hot'",
      "'Clearer' → 'Sale' → 'Limited Time', '50% Off'",
      "'Professional' → 'NEW!' → 'Latest'"
    ]
  },
  subtitle: {
    role: "You're editing a subtitle/subheading",
    focus: ["Support main title", "Add detail", "Maintain hierarchy"],
    examples: [
      "'Add context' → Explain the headline more",
      "'Shorter' → Condense to one clear statement",
      "'More benefit-focused' → Highlight what user gets"
    ]
  }
};

// ============================================================================
// Simple Request Detection
// ============================================================================

// Patterns that indicate simple property changes
const SIMPLE_CHANGE_PATTERNS = [
  /change.*color/i,
  /update.*color/i,
  /set.*color/i,
  /make.*(green|blue|red|yellow|orange|purple|pink|black|white|gray)/i,  // "make it green", "make this blue"
  /make it.*#[0-9a-f]{3,6}/i,  // Color hex codes
  /change.*to #[0-9a-f]{3,6}/i,
  /color.*to.*#[0-9a-f]{3,6}/i,
  /background.*to/i,
  /padding|margin|spacing/i,
  /width|height|size/i,
  /url|link|href/i,
  /bold|bolder|font.*weight/i,  // "make it bold", "bolder", "change font weight"
  /font.*size|bigger|smaller|larger/i,  // "make font bigger", "increase size"
  /change.*(text|words|wording|copy)/i,  // "change the words", "update text", "change copy"
  /^(add|set|update|change)\s+(to\s+)?[\w#]+$/i,  // "change to X", "set X"
];

function isSimplePropertyChange(prompt: string): boolean {
  return SIMPLE_CHANGE_PATTERNS.some(pattern => pattern.test(prompt));
}

// ============================================================================
// Prompt Builders
// ============================================================================

function buildMinimalPrompt(input: RefineElementInput): string {
  const { elementType, currentValue, currentSettings, prompt } = input;
  
  // Import the editable properties to show ALL properties (even if not set)
  // This is a workaround since we can't import from element-descriptor in API route
  const editablePropertyKeys = getEditablePropertyKeysForElement(elementType);
  
  // Start with currentValue
  const allProperties: Record<string, any> = { ...currentValue };
  
  // Add ALL editable properties from settings (show undefined for unset properties)
  editablePropertyKeys.forEach(key => {
    if (key !== 'text' && key !== 'url') {  // Don't override content properties
      allProperties[key] = currentSettings?.[key];
    }
  });
  
  return `You're editing a ${elementType} element. Make the requested change using the correct property names.

All editable properties (undefined = not set):
${JSON.stringify(allProperties, null, 2)}

User request: "${prompt}"

IMPORTANT: 
- Use camelCase property names (e.g., backgroundColor, textColor, fontWeight)
- For headers/titles/paragraphs, use "color" not "textColor"
- For buttons, use "textColor" and "backgroundColor"
- For bold text, set fontWeight: "bold" or fontWeight: "700"
- Do NOT use HTML tags like <b>, <strong>, <i>, etc.
- Only include properties that actually change in the "changes" object
- Return JSON with changed properties and a brief 1-sentence explanation

Format: {"changes": {...}, "explanation": "..."}`;
}

// Helper to get editable property keys for an element type
function getEditablePropertyKeysForElement(elementType: string): string[] {
  switch (elementType) {
    case 'title':
    case 'header':
    case 'paragraph':
      return ['text', 'color', 'fontSize', 'fontWeight', 'align'];
    case 'button':
      return ['text', 'url', 'backgroundColor', 'textColor', 'fontSize', 'fontWeight', 'borderRadius', 'padding'];
    case 'image':
      return ['imageUrl', 'altText', 'linkUrl', 'borderRadius', 'align', 'width', 'height', 'padding'];
    case 'subtitle':
    case 'badge':
      return ['text', 'color', 'backgroundColor', 'fontSize', 'fontWeight'];
    default:
      return ['text', 'color', 'fontSize', 'fontWeight'];
  }
}

function buildElementRefinementPrompt(input: RefineElementInput): string {
  // Use minimal prompt for simple property changes
  if (isSimplePropertyChange(input.prompt)) {
    return buildMinimalPrompt(input);
  }
  
  const { elementType, currentValue, currentSettings, prompt } = input;
  
  // Show ALL editable properties (even if not set)
  const editablePropertyKeys = getEditablePropertyKeysForElement(elementType);
  const allProperties: Record<string, any> = { ...currentValue };
  
  editablePropertyKeys.forEach(key => {
    if (key !== 'text' && key !== 'url') {
      allProperties[key] = currentSettings?.[key];
    }
  });
  
  // Get element-specific template (with fallback for generic types)
  const template = ELEMENT_PROMPT_TEMPLATES[elementType] || 
                  ELEMENT_PROMPT_TEMPLATES[
                    ['header', 'text'].includes(elementType) ? 'paragraph' : 'title'
                  ];
  
  if (!template) {
    // Generic fallback
    return `You are editing a ${elementType} element in an email.

Current ${elementType} properties:
${JSON.stringify(allProperties, null, 2)}

User request: "${prompt}"

Return ONLY the changed properties in the "changes" object and provide a brief explanation.`;
  }
  
  return `${template.role} in an email campaign.

**What to focus on:**
${template.focus.map(f => `• ${f}`).join('\n')}

**Example transformations:**
${template.examples.map(e => `• ${e}`).join('\n')}

**Current properties:**
\`\`\`json
${JSON.stringify(allProperties, null, 2)}
\`\`\`

**User request:** "${prompt}"

**Your task:**
1. Understand the user's intent
2. Apply changes that match the focus areas above
3. Maintain email-appropriate tone and length
4. Return ONLY changed properties in "changes" object
5. Provide brief explanation of what you changed and why

**Output format:**
{
  "changes": { "property": "new value" },
  "explanation": "Brief description of changes"
}`;
}

