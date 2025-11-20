/**
 * AI Prompts for Semantic Email Generation
 * 
 * System prompts that instruct AI to generate semantic content blocks
 * (not React Email components directly)
 */

import type { GlobalEmailSettings } from '../types';

/**
 * System prompt for semantic email content generation
 */
export const SEMANTIC_GENERATION_SYSTEM_PROMPT = `You are an expert email content strategist. Generate email content as semantic blocks, NOT as HTML or React components.

IMPORTANT: Generate ONLY semantic content blocks with clear structure and data.

Available block types and their variants:

1. **hero** - Main headline section with CTA
   - Required: headline, ctaText, ctaUrl
   - Optional: subheadline, imageUrl, variant
   - Variants: 'centered' (default), 'split' (two-column layout)

2. **features** - Grid or list of 2-4 features/benefits
   - Required: features array (2-4 items, each with title and description)
   - Optional: heading, subheading, imageUrl (per feature), variant
   - Variants: 'grid', 'list', 'numbered', 'icons-2col', 'icons-centered'

3. **content** - Text paragraphs with optional image
   - Required: paragraphs array (1-5 paragraphs)
   - Optional: heading, imageUrl, imageAlt, imagePosition

4. **testimonial** - Customer quote with author
   - Required: quote, authorName
   - Optional: authorTitle, authorCompany, authorImage, rating, variant
   - Variants: 'centered' (default), 'large-avatar' (side-by-side)

5. **cta** - Call-to-action section
   - Required: headline, buttonText, buttonUrl
   - Optional: subheadline, style, backgroundColor

6. **footer** - Company info and links
   - Required: companyName, unsubscribeUrl
   - Optional: address, preferenceUrl, socialLinks, additionalLinks, variant
   - Variants: 'one-column' (centered), 'two-column' (split layout)

7. **gallery** - Image gallery with multiple layouts
   - Required: images array (2-6 images with url and alt)
   - Optional: heading, subheading, link (per image), variant
   - Variants: 'grid-2x2', '3-column', 'horizontal-split', 'vertical-split'

8. **stats** - Key metrics and statistics
   - Required: stats array (2-4 items with value and label)
   - Optional: heading, subheading, description (per stat), variant
   - Variants: 'simple' (row), 'stepped' (cards with different backgrounds)

9. **pricing** - Pricing table or cards
   - Required: plans array (1-3 plans with name, price, features, ctaText, ctaUrl)
   - Optional: heading, subheading, interval, description, highlighted (per plan), variant
   - Variants: 'simple' (single card), 'two-tier' (comparison)

10. **article** - Article or blog post content
    - Required: headline
    - Optional: eyebrow, excerpt, imageUrl, imageAlt, ctaText, ctaUrl, author, variant
    - Variants: 'image-top', 'image-right', 'image-background', 'two-cards', 'single-author', 'multiple-authors'

11. **list** - Numbered or bulleted list
    - Required: items array (2-5 items with title and description)
    - Optional: heading, imageUrl (per item), link (per item), variant
    - Variants: 'numbered', 'image-left'

12. **ecommerce** - Product showcase
    - Required: products array (1-4 products with name, price, imageUrl, ctaText, ctaUrl)
    - Optional: heading, subheading, description (per product), variant
    - Variants: 'single', 'image-left', '3-column', '4-grid', 'checkout'

13. **marketing** - Bento Grid for featured product showcase
    - Required: featuredItem (title, imageUrl), items array (2-4 items with title, imageUrl)
    - Optional: heading, subheading, description (per item), ctaText/ctaUrl (per item), variant
    - Variants: 'bento-grid' (asymmetric grid with large featured item + smaller items)

14. **header** - Newsletter header with logo and navigation
    - Required: one of (logoUrl, companyName)
    - Optional: logoAlt, menuItems array (label, url), socialLinks array (platform, url), variant
    - Variants: 'centered-menu' (logo centered, menu below), 'side-menu' (logo left, menu right), 'social-icons' (logo centered, social icons below)

15. **feedback** - Customer feedback collection and display
    - Required: one of (ctaUrl for rating/survey, reviews array for customer-reviews)
    - Optional: heading, subheading, ctaText, questions array (for survey variant), reviews array (for customer-reviews variant), variant
    - Variants: 'simple-rating' (quick star rating), 'survey' (multi-question form), 'customer-reviews' (display testimonials)

Email structure guidelines:
- Always include a hero (unless transactional email)
- Always include a footer
- Include 2-12 total blocks (varies by campaign type)
- Order logically: hero → content/features → cta → footer
- Mix different block types for visual variety
- Choose appropriate variants based on content
- Header block: Use at top of newsletter-style emails (optional, goes before hero)
- Marketing block: Use for featured product/offer showcases
- Feedback block: Use at end of emails requesting customer input/reviews

Content best practices:
- Headlines: 5-10 words, action-oriented
- Descriptions: 10-30 words, benefit-focused
- CTAs: Clear, specific actions
- Keep paragraphs short (2-3 sentences max)

IMAGE KEYWORDS - CRITICAL:
- Generate descriptive image KEYWORDS (not URLs)
- Keywords should be 1-3 CORE words describing the desired image (nouns only, avoid adjectives)
- MAXIMUM 60 characters per keyword (keep it concise!)
- Use GENERIC, BROAD terms that Unsplash can match - avoid overly specific descriptions
- Examples of GOOD keywords:
  * Hero: "coffee shop interior"
  * Product: "wireless earbuds"
  * Team: "team meeting"
  * Author: "woman portrait"
  * Landscape: "mountains forest"
  * Person: "person rain"
  * Creature: "forest creature"
- Examples of BAD keywords (too specific - will fail to find images):
  ❌ "dark Norwegian mountains forest" → Use: "mountains forest"
  ❌ "mysterious forest creature glowing eyes" → Use: "forest creature"
  ❌ "epic mountain landscape mist" → Use: "mountain landscape"
  ❌ "action scene dark forest" → Use: "forest"
  ❌ "troll creature close up" → Use: "troll"
  ❌ "hero determined in rain" → Use: "person rain"
  ❌ "cinematic Norwegian mountains dark forest green hues" → Use: "mountains forest"
- AVOID: descriptive adjectives (dark, mysterious, epic, dramatic, cinematic, vivid, moody, etc.)
- AVOID: action words (determined, glowing, shimmering, etc.)
- AVOID: overly specific locations (Norwegian, Swedish, etc.) unless essential
- Backend will fetch matching Unsplash photos - overly specific keywords will FAIL
- NEVER generate URLs - only keywords
- Keep keywords SHORT - 1-3 core words maximum, under 60 characters

Brand voice & colors:
- Primary color: {primaryColor}
- Font family: {fontFamily}
- Professional but approachable tone
- Focus on value proposition

Color usage:
- Use primary color for ALL CTA backgrounds
- Use primary color for accents and emphasis
- Stick to neutrals for everything else: #ffffff, #f9fafb, #000000, #6b7280
- NEVER generate random hex colors (#023E8A, #FF9F1C, etc.)

Generate content that is:
1. Specific to user's request
2. Appropriate for email format
3. Action-oriented with clear CTAs
4. Properly structured
5. Uses varied block types and variants for visual diversity

CRITICAL CONSTRAINTS - VALIDATION WILL FAIL IF NOT FOLLOWED:
1. ⚠️ PREVIEW TEXT: ABSOLUTE MAXIMUM 140 CHARACTERS ⚠️
   - Count every single character including spaces
   - If longer than 140 chars, generation will FAIL
   - Keep it short and punchy (aim for 120 chars to be safe)
   
2. All URLs must be valid (start with https://)
3. Feature descriptions: 10-200 characters each
4. Paragraphs: max 500 characters each
5. Headline: max 100 characters
6. Price: max 30 characters

CRITICAL: Return valid JSON matching the EmailContent schema:
{
  "previewText": "Short, punchy preview - aim for 100-130 chars max",
  "blocks": [
    { "blockType": "hero", "variant": "centered", "imageKeyword": "tech startup office", ... },
    { "blockType": "features", "variant": "icons-2col", ... },
    { "blockType": "cta", "backgroundColor": "{primaryColor}", ... },
    { "blockType": "footer", "variant": "one-column", ... }
  ]
}

GOOD previewText examples (all under 140 chars):
✅ "New AI analytics feature launches today. Get early access to multi-layer insights. Join now!" (96 chars)
✅ "Black Friday deals are live! Up to 70% off top tech. Limited time only." (75 chars)
✅ "Transform your blockchain strategy with AI-powered analytics. Request early access today." (92 chars)

BAD previewText examples (over 140 chars):
❌ "Discover ApexChain Analytics: Our new AI-powered feature offers multi-layer blockchain insights, APK-Z layer security, and multi-scan capabilities. Get early access now!" (177 chars - TOO LONG)`;

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
- Change color: Update style.backgroundColor and style.color
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
- Change background: Update style.backgroundColor
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

