/**
 * AI Prompts for Semantic Email Generation
 * 
 * System prompts that instruct AI to generate semantic content blocks
 * (not React Email components directly)
 */

import type { GlobalEmailSettings } from '../types';

/**
 * Minimal system prompt for Pass 1 (structure generation only)
 * Reduced from ~2,000 tokens to ~300 tokens
 */
export const STRUCTURE_GENERATION_SYSTEM_PROMPT = `You are an email structure strategist. Generate email structure (block types + order), NOT content.

Rules:
- previewText: ≤140 chars
- Choose 2-12 blocks from: header, hero, heading, text, features, testimonial, gallery, stats, pricing, ecommerce, article, articles, list, marketing, feedback, buttons, image, avatars, link, code, markdown, cta, footer
- Each block needs: blockType + purpose (max 150 chars)
- Order: header→content→cta→footer
- Return valid JSON with previewText and blocks array`;

/**
 * Full system prompt for Pass 2 (content generation)
 * Condensed from ~2,000 tokens to ~800 tokens by removing verbose examples
 */
export const SEMANTIC_GENERATION_SYSTEM_PROMPT = `You are an expert email content strategist. Generate email content as semantic blocks, NOT HTML or React components.

⚠️ VALIDATION:
- previewText: ≤140 chars
- URLs: Valid https:// format
- JSON: Valid schema match

Block types: hero, features, content, testimonial, cta, footer, gallery, stats, pricing, article, articles, list, ecommerce, marketing, header, feedback, heading, text, link, buttons, image, avatars, code, markdown.

## Design System

**Spacing:** 8px grid (8,16,24,32,40,48,64,80). Hero: 80px padding. Sections: 40-48px padding.

**Typography:** Hero: 56-64px/800-900/1.1. Headers: 36-40px/700-800/1.2. Subheads: 20-24px/600/#6b7280. Body: 17-18px/400/1.7. Headings ≥1.5x body size.

**Colors:** Text: #1f2937 (headlines), #374151 (body), #6b7280 (secondary). CTAs: {primaryColor}. Backgrounds: #f9fafb (page), #ffffff (content). Never use #6b7280 as primary text.

**Accessibility:** Buttons ≥44px height. Text contrast 4.5:1 minimum.

## Content Quality

**Writing:** Conversational, brand-specific. Include specifics/numbers. Active voice. Paragraphs: 2-3 sentences max.

**Headlines:** 8-15 words, action-oriented. ❌ "Welcome" → ✅ "Your analytics dashboard is ready. Here's what's new."

**Body:** Lead with benefits. Use "you/your" > "we/our". Descriptions: 15-30 words minimum.

**Image Keywords:** 1-3 core words (nouns only), max 60 chars. Generic terms: "coffee shop", "team meeting", "mountains forest". Avoid adjectives.

## Content Requirements

**Minimum Lengths:**
- Headlines: 8+ words
- Subheadlines: 15+ words (if field exists, REQUIRED)
- Descriptions: 15+ words
- CTA text: 2+ words

**Required Fields:**
- Hero: headline, subheadline, ctaText, ctaUrl, imageKeyword
- Features: heading, subheading, features[3-4] each: title, description, imageKeyword
- List: heading, items[4+] each: title, description
- CTA: headline, subheadline, buttonText, buttonUrl

**DO NOT:** Empty strings, placeholders, generic content ("Welcome", "Check it out"), single-word headlines.

**Brand:** Primary color: {primaryColor}. Font: {fontFamily}. Tone: Professional but approachable.

**Visual Focus:** Prioritize visual blocks (gallery, stats, features with images, ecommerce) over text-heavy blocks. Use images, icons, and visual elements. Keep text concise and impactful.

Generate: 1) Specific to request, 2) Email-appropriate, 3) Action-oriented, 4) Visual and styled, 5) Complete with all fields populated.`;

/**
 * Build semantic generation prompt with user request and settings
 */
export function buildSemanticGenerationPrompt(
  userPrompt: string,
  settings: GlobalEmailSettings,
  emailType?: 'marketing' | 'transactional' | 'newsletter',
  campaignOptions?: {
    campaignType?: string;
    companyName?: string;
    targetAudience?: string;
    structureHints?: {
      gridLayout?: { columns: number; rows: number };
      itemCount?: number;
      needsTable?: boolean;
      needsLogo?: boolean;
    };
    tone?: 'formal' | 'casual' | 'friendly' | 'professional' | 'urgent' | 'playful';
    contentType?: 'press-release' | 'announcement' | 'sale' | 'update' | 'story' | 'product-launch' | 'event' | 'newsletter' | 'transactional';
  }
): string {
  let guidance = '';

  if (emailType === 'marketing') {
    // Content type specific guidance
    let contentTypeGuidance = '';
    if (campaignOptions?.contentType === 'press-release') {
      contentTypeGuidance = `
CONTENT TYPE: Press Release
STRUCTURE: Formal announcement format
- Recommended: header (with logo) + hero (centered, formal headline) + content (2-3 paragraphs) + features (key points) + cta + footer
- Tone: Professional, formal, newsworthy
- Use formal language, third-person perspective
- Include key facts: who, what, when, where, why
- Block selection: header + hero + content + features + cta + footer`;
    } else if (campaignOptions?.contentType === 'product-launch') {
      contentTypeGuidance = `
CONTENT TYPE: Product Launch
STRUCTURE: Excitement-building format
- Recommended: hero + features (icons-2col) + gallery + testimonial + pricing + cta + footer
- Tone: Exciting, benefit-focused
- Emphasize new features and benefits`;
    } else if (campaignOptions?.contentType === 'sale') {
      contentTypeGuidance = `
CONTENT TYPE: Sale/Promotion
STRUCTURE: Urgency-driven format
- Recommended: hero + ecommerce (3-column or 4-grid) + stats (discount highlights) + cta + footer
- Tone: Urgent, value-focused
- Emphasize savings and limited time`;
    }
    
    // Tone-specific guidance
    let toneGuidance = '';
    if (campaignOptions?.tone === 'formal') {
      toneGuidance = `
TONE: Formal
- Use professional language, avoid contractions
- Third-person perspective preferred
- Formal greetings and closings
- Structured, clear messaging`;
    } else if (campaignOptions?.tone === 'urgent') {
      toneGuidance = `
TONE: Urgent
- Emphasize time sensitivity
- Use action-oriented language
- Multiple CTAs acceptable
- Highlight scarcity/limited availability`;
    } else if (campaignOptions?.tone === 'playful') {
      toneGuidance = `
TONE: Playful
- Use casual, fun language
- Emojis acceptable in appropriate contexts
- Engaging, conversational style
- Creative, energetic messaging`;
    }
    
    guidance = `

Email type: Marketing campaign
${contentTypeGuidance}${toneGuidance}
BLOCK SELECTION: Choose structure that fits the message:
- Product launch: hero + features (icons-2col) + gallery + testimonial + pricing + cta + footer
- Welcome/onboarding: hero (split) + features (numbered) + cta + footer
- Announcement: hero + content + article + cta + footer
- Sale/promotion: hero + ecommerce (3-column or 4-grid) + cta + footer
- Feature highlight: hero + content + features (icons-centered) + stats + cta + footer

VARIANT USAGE:
- Use 'split' hero for emphasis on imagery
- Use 'icons-2col' or 'icons-centered' for features with visual emphasis
- Use 'gallery' for product showcases
- Use 'stats' to highlight metrics/achievements
- Use 'pricing' for upgrade/purchase campaigns

Goal: Drive conversions and engagement with visual variety`;
  } else if (emailType === 'transactional') {
    guidance = `

Email type: Transactional
BLOCK SELECTION: Keep it brief and direct
- Recommended: content + list (numbered) + cta + footer (one-column)
- Use 1-2 content/list blocks maximum
- Skip hero, gallery, testimonials, pricing
- Use simple variants only

Goal: Clear information and next steps`;
  } else if (emailType === 'newsletter') {
    guidance = `

Email type: Newsletter
BLOCK SELECTION: Multiple content sections with varied layouts
- Recommended: hero + article (image-right or two-cards) + list + content + footer
- Or: hero + content + gallery (3-column) + article (single-author) + footer
- Vary block types: mix articles, content, lists
- Use 'article' blocks for featured stories
- Use 'list' for quick updates or tips
- Vary paragraph counts (1-3 per content block)

VARIANT USAGE:
- Mix article variants: image-top, image-right, two-cards
- Use list variants: numbered for steps, image-left for feature updates
- Use centered hero with compelling headline

Goal: Inform and engage subscribers with varied content formats`;
  } else {
    guidance = `

Email type: General
BLOCK SELECTION: Choose blocks that best fit the user's request
- Use 2-6 blocks total (not always the same)
- Don't always include all block types
- Consider the context:
  * Ecommerce: use 'ecommerce' and 'gallery' blocks
  * B2B/SaaS: use 'features', 'stats', 'testimonial', 'pricing'
  * Content-focused: use 'article', 'content', 'list'
  * Event: use 'hero', 'content', 'stats' (attendees, speakers)
- Vary content length based on complexity
- Mix variants for visual interest`;
  }

  // Add campaign-specific context if provided
  let campaignContext = '';
  if (campaignOptions) {
    campaignContext = `

Campaign Context:`;
    
    if (campaignOptions.campaignType) {
      campaignContext += `
- Campaign Type: ${campaignOptions.campaignType}`;
    }
    
    if (campaignOptions.companyName) {
      campaignContext += `
- Company: ${campaignOptions.companyName}`;
    }
    
    if (campaignOptions.targetAudience) {
      campaignContext += `
- Target Audience: ${campaignOptions.targetAudience}`;
    }
    
    campaignContext += `

Please tailor the content, tone, and messaging to match this context.`;
  }

  const systemPrompt = SEMANTIC_GENERATION_SYSTEM_PROMPT
    .replace('{primaryColor}', settings.primaryColor)
    .replace('{fontFamily}', settings.fontFamily);

  return `${systemPrompt}

${guidance}${campaignContext}

VARIETY & INTELLIGENCE REQUIREMENTS:
1. BLOCK SELECTION:
   - Analyze user request to choose most appropriate blocks
   - Newsletter → Use article, content, list blocks
   - Promotional → Use ecommerce, gallery, pricing, stats
   - B2B/SaaS → Use features, testimonial, stats, pricing
   - Event/Webinar → Use stats (speakers, attendees), content, article
   
2. VARIANT SELECTION:
   - Choose variants that enhance the message:
     * Split hero when imagery is important
     * Numbered features for sequential benefits
     * Large-avatar testimonial for credibility emphasis
     * Grid galleries for product showcases
     * Stepped stats for dramatic metric presentation
   
3. STRUCTURAL VARIETY:
   - Vary the number of blocks based on campaign complexity:
     * Simple/Transactional: 3-6 blocks
     * Standard/Newsletter: 5-8 blocks  
     * Complex/Promotional: 8-12 blocks
   - Don't use the same structure every time
   - Mix block types based on content
   - For features: choose between 2, 3, or 4 items
   - For content: use 1-5 paragraphs as appropriate
   
4. VISUAL DIVERSITY:
   - Alternate between text-heavy and visual blocks
   - Use galleries/ecommerce for product-focused emails
   - Use articles for storytelling
   - Use stats for data-driven messaging
   - Mix variants within the same email

User request: "${userPrompt}"
${campaignOptions?.structureHints ? `

STRUCTURE REQUIREMENTS DETECTED:
${campaignOptions.structureHints.gridLayout ? `- Grid layout: ${campaignOptions.structureHints.gridLayout.columns} columns × ${campaignOptions.structureHints.gridLayout.rows} rows (${campaignOptions.structureHints.itemCount} total items)` : ''}
${campaignOptions.structureHints.itemCount && !campaignOptions.structureHints.gridLayout ? `- Item count: ${campaignOptions.structureHints.itemCount} items` : ''}
${campaignOptions.structureHints.needsTable ? `- Table/grid layout required for structured data` : ''}
${campaignOptions.structureHints.needsLogo ? `- Logo required in header section` : ''}

IMPORTANT: For grid layouts with many items, use multiple 'list' blocks (each can hold 2-5 items) or 'gallery' blocks (each can hold 2-6 images) to accommodate all items.
` : ''}

⚠️ REMINDER: previewText MUST be ≤140 characters. Count carefully before generating! ⚠️

Generate semantic content blocks as JSON following the EmailContent schema.`;
}

/**
 * Get block-specific variant guidance (for dynamic injection in Pass 2)
 * This reduces prompt size by only including relevant variant info per block
 */
export function getBlockVariantGuidance(blockType: string): string {
  const guidance: Record<string, string> = {
    articles: 'Variants: with-image, image-right, image-background, two-cards, single-author. Choose most appropriate.',
    article: 'Variants: multiple-authors. Use this variant.',
    features: 'Variants: list-items, numbered-list, four-paragraphs, four-paragraphs-two-columns, three-centered-paragraphs. Choose based on content structure.',
    testimonial: 'Variants: simple-centered, large-avatar. Use simple-centered for short quotes, large-avatar for emphasis.',
    ecommerce: 'Variants: checkout, four-cards, one-product, one-product-left, three-cards-row. Choose based on product count.',
    gallery: 'Variants: four-images-grid, horizontal-grid, three-columns, vertical-grid. Choose based on image count.',
    stats: 'Variants: simple, stepped. Use simple for basic stats, stepped for dramatic presentation.',
    list: 'Variants: simple-list, image-left. Use simple-list for text-only, image-left when images needed.',
    marketing: 'Variants: bento-grid. Use this variant.',
    feedback: 'Variants: simple-rating, survey-section. Use simple-rating for quick feedback, survey-section for detailed surveys.',
    buttons: 'Variants: single-button, two-buttons, download-buttons. Choose based on CTA count.',
    image: 'Variants: simple-image, rounded-image, varying-sizes. Use simple-image for standard, rounded-image for avatars/products.',
    avatars: 'Variants: group-stacked, with-text, circular. Use group-stacked for teams, with-text for testimonials.',
    link: 'Variants: simple-link, inline-link. Use simple-link for standalone, inline-link for text within paragraphs.',
    code: 'Variants: inline-simple, inline-colors, block-no-theme, predefined-theme, custom-theme, line-numbers. Use inline for short snippets.',
    markdown: 'Variants: simple, container-styles, custom-styles. Use simple for basic, container-styles for styled containers.',
    heading: 'Variants: simple-heading, multiple-headings, multiple-headings-alt. Use simple-heading for single headline.',
    text: 'Variants: simple-text, text-with-styling. Use simple-text for plain paragraphs.',
    header: 'Variants: centered-menu. Use this variant.',
    pricing: 'Variants: simple-pricing-table. Use this variant.',
    hero: 'Variants: simple. Use this variant.',
    cta: 'Variants: simple. Use this variant.',
    footer: 'Variants: simple, one-column, two-column. Use simple for basic, one-column for centered, two-column for split.',
  };
  
  return guidance[blockType] || '';
}

/**
 * Example prompts for different email types (for testing)
 */
export const EXAMPLE_PROMPTS = {
  marketing: 'Create a welcome email for a new SaaS product that helps teams collaborate better',
  transactional: 'Create a password reset confirmation email with clear next steps',
  newsletter: 'Create a monthly newsletter about productivity tips and new features',
  ecommerce: 'Create an order confirmation email with shipping details',
  event: 'Create an event invitation for a webinar about AI in marketing',
  announcement: 'Announce a new product feature launch with benefits',
};

/**
 * Validation guidance to include in prompts
 */
export const VALIDATION_RULES = `
Validation rules to follow:
- headline: 1-100 characters
- subheadline: max 200 characters
- ctaText/buttonText: 1-50 characters
- URLs: must be valid (https://...)
- features: 2-4 items required
- paragraphs: 1-3 items, each max 500 characters
- quote: 10-300 characters
- preview text: 1-140 characters
- blocks array: 2-12 blocks (varies by campaign type)
- price: max 30 characters (allows sale prices like "$99 (was $149)")
`;

/**
 * Component-specific guidance for common edits
 */
export const COMPONENT_EDIT_PATTERNS: Record<string, string> = {
  Button: `Common Button edits:
- Change color: Update style.color (colors applied globally via settings)
- Change text: Update content field
- Change link: Update href prop
- Make larger: Increase style.padding and style.fontSize
- Change shape: Update style.borderRadius`,
  
  Text: `Common Text edits:
- Change color: Update style.color
- Change size: Update style.fontSize
- Make bold: Set style.fontWeight to 600 or 700
- Change alignment: Update style.textAlign
- Add spacing: Update style.margin or style.padding`,
  
  Heading: `Common Heading edits:
- Change color: Update style.color
- Change size: Update style.fontSize or change 'as' prop (h1, h2, h3)
- Make bold: Set style.fontWeight to 600 or 700
- Change alignment: Update style.textAlign`,
  
  Section: `Common Section edits:
- Change background: Background colors are applied globally via settings
- Add padding: Update style.padding
- Center content: Set style.textAlign to "center"`,
  
  Img: `Common Image edits:
- Change source: Update src prop
- Resize: Update width and height props
- Round corners: Update style.borderRadius
- Change alt text: Update alt prop`,
};

/**
 * Build refinement prompt for component editing
 */
export function buildRefinementPrompt(
  component: string,
  currentProps: Record<string, any>,
  currentContent: string | undefined,
  userPrompt: string
): string {
  return `You are editing a ${component} component in a React Email.

CURRENT STATE:
Component type: ${component}
Current props: ${JSON.stringify(currentProps, null, 2)}
Current content: ${currentContent || 'N/A'}

RULES:
1. Return ONLY the props/content that need to CHANGE
2. All colors must be hex codes (#ffffff, #000000)
3. Do not return props that don't need to change
4. For style changes, include the complete style object with updates merged
5. Preserve existing props unless explicitly changing them

USER REQUEST: "${userPrompt}"

Return a JSON object with:
{
  "props": { /* updated props */ },
  "content": "updated content" // only if content changed
}

Only include "props" or "content" if they need to change.`;
}

/**
 * Get enhanced refinement prompt with component-specific guidance
 */
export function buildEnhancedRefinementPrompt(
  component: string,
  currentProps: Record<string, any>,
  currentContent: string | undefined,
  userPrompt: string
): string {
  const basePrompt = buildRefinementPrompt(component, currentProps, currentContent, userPrompt);
  const pattern = COMPONENT_EDIT_PATTERNS[component];
  
  if (pattern) {
    return basePrompt + `\n\n${pattern}`;
  }
  
  return basePrompt;
}

