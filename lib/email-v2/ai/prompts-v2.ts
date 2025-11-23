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
export const STRUCTURE_GENERATION_SYSTEM_PROMPT = `Email structure only. previewText ≤140 chars. 2-12 blocks: header,hero,heading,text,features,testimonial,gallery,stats,pricing,ecommerce,article,articles,list,marketing,feedback,buttons,image,avatars,link,code,markdown,cta,footer. Each: blockType+purpose (≤150). Order: header→content→cta→footer. Return JSON.`;

/**
 * Pass 2 content generation - ULTRA-COMPACT for max token efficiency
 */
export const SEMANTIC_GENERATION_SYSTEM_PROMPT = `Generate semantic email JSON with exact field names and character limits.

CRITICAL LIMITS (schema will reject if exceeded):
- headline: MAX 80 chars
- subheadline: MAX 140 chars (hero, cta)
- subheading: MAX 140 chars (features, articles, gallery, marketing, feedback)
- description: MAX 90 chars
- title: MAX 40 chars
- ctaText/buttonText: MAX 30 chars
- imageKeyword: MAX 60 chars
- URLs: Must be valid https://

ICON SELECTION (for features block - use EXACTLY one of these):
- check: Completed items, verified features, checkmarks
- star: Premium features, highlights, ratings
- heart: User favorites, loved features, liked items
- lightning: Fast features, speed, power, energy
- shield: Security, protection, safety features
- lock: Privacy, access control, secure features
- clock: Time-saving, scheduling, time features
- globe: Global, worldwide, international features

DO NOT invent icon names like "moon", "sun", "eye", "dark", "light". ONLY use: check, star, heart, lightning, shield, lock, clock, globe.

OPTIONAL FIELDS (can be omitted):
- imageUrl: NEVER generate URLs. Leave blank or omit entirely. Images are fetched separately.
- imageKeyword: Only for blocks with images (hero, features, testimonial, gallery, etc.)

EXAMPLES (count chars carefully):
✅ GOOD description (78 chars): "Automate repetitive tasks and focus on what matters most to your business success"
✅ GOOD subheading (118 chars): "Experience powerful tools designed to streamline your workflow and boost team productivity across all departments"
✅ GOOD icon: "check" (for verified features), "lightning" (for fast features), "shield" (for secure features)
❌ TOO LONG description (93 chars): "Protect your sensitive information with robust encryption and advanced security protocols today"
❌ TOO LONG subheading (141 chars): "Experience unparalleled efficiency and innovation designed to streamline your operations and elevate your productivity to new heights overall"
❌ INVALID icon: "moon", "sun", "eye", "dark" (not in the valid list)

FIELD NAMES (use exact names):
- Hero: headline, subheadline, ctaText, ctaUrl, imageKeyword
- Features: heading, subheading, features[]{title, description, icon, imageKeyword}
- CTA: headline, subheadline, buttonText, buttonUrl
- List: heading, items[]{title, description}

STYLE: 8px grid. Hero:80px pad. h1:56-64px/800. h2:36-40px/700. body:17-18px/400. Active voice. Benefits-first. "you/your" language. Images:1-3 nouns,generic. No placeholders. Brand:{primaryColor},{fontFamily}.`;

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
    let contentTypeGuidance = '';
    if (campaignOptions?.contentType === 'press-release') {
      contentTypeGuidance = `Press release: header+hero(centered)+content(2-3¶)+features+cta+footer. Formal tone, 3rd person, who/what/when/where/why.`;
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
    
    guidance = `Marketing: ${contentTypeGuidance}${toneGuidance} Product launch→hero+features(icons-2col)+gallery+pricing+cta. Welcome→hero(split)+features(numbered)+cta. Sale→hero+ecommerce(grid)+cta. Use split hero for images, icons-2col for features, gallery for products.`;
  } else if (emailType === 'transactional') {
    guidance = `Transactional: content+list(numbered)+cta+footer. Max 1-2 blocks. Skip hero/gallery/testimonials. Simple variants only.`;
  } else if (emailType === 'newsletter') {
    guidance = `Newsletter: hero+article(image-right|two-cards)+list+content+footer. Mix article variants. Use numbered lists for steps.`;
  } else {
    guidance = `General: 2-6 blocks. Ecommerce→ecommerce+gallery. B2B/SaaS→features+stats+testimonial+pricing. Content→article+content+list. Event→hero+content+stats. Vary length & variants.`;
  }

  // Campaign context
  let ctx = '';
  if (campaignOptions) {
    if (campaignOptions.campaignType) ctx += ` Type: ${campaignOptions.campaignType}.`;
    if (campaignOptions.companyName) ctx += ` Co: ${campaignOptions.companyName}.`;
    if (campaignOptions.targetAudience) ctx += ` Audience: ${campaignOptions.targetAudience}.`;
  }

  const systemPrompt = SEMANTIC_GENERATION_SYSTEM_PROMPT
    .replace('{primaryColor}', settings.primaryColor)
    .replace('{fontFamily}', settings.fontFamily);

  return `${systemPrompt}
${guidance}${ctx}

Request: "${userPrompt}"${campaignOptions?.structureHints ? `
Hints:${campaignOptions.structureHints.gridLayout ? ` Grid ${campaignOptions.structureHints.gridLayout.columns}×${campaignOptions.structureHints.gridLayout.rows} (${campaignOptions.structureHints.itemCount} items).` : ''}${campaignOptions.structureHints.itemCount && !campaignOptions.structureHints.gridLayout ? ` ${campaignOptions.structureHints.itemCount} items.` : ''}${campaignOptions.structureHints.needsTable ? ` Table/grid required.` : ''}${campaignOptions.structureHints.needsLogo ? ` Logo in header.` : ''}` : ''}

⚠️ previewText ≤140 chars. Return JSON.`;
}

/**
 * Block variant guidance - condensed for token efficiency
 */
export function getBlockVariantGuidance(blockType: string): string {
  const g: Record<string, string> = {
    articles: 'with-image|image-right|image-background|two-cards|single-author',
    features: 'list-items|numbered-list|four-paragraphs|four-paragraphs-two-columns|three-centered-paragraphs',
    testimonial: 'simple-centered(short)|large-avatar(emphasis)',
    ecommerce: 'checkout|four-cards|one-product|one-product-left|three-cards-row',
    gallery: 'four-images-grid|horizontal-grid|three-columns|vertical-grid',
    stats: 'simple|stepped(dramatic)',
    list: 'simple-list|image-left',
    marketing: 'bento-grid',
    feedback: 'simple-rating|survey-section',
    buttons: 'single-button|two-buttons|download-buttons',
    image: 'simple-image|rounded-image|varying-sizes',
    avatars: 'group-stacked|with-text|circular',
    link: 'simple-link|inline-link',
    code: 'inline-simple|inline-colors|block-no-theme|predefined-theme|line-numbers',
    markdown: 'simple|container-styles|custom-styles',
    heading: 'simple-heading|multiple-headings',
    text: 'simple-text|text-with-styling',
    header: 'centered-menu',
    pricing: 'simple-pricing-table',
    hero: 'simple',
    cta: 'simple',
    footer: 'simple|one-column|two-column',
  };
  
  return g[blockType] ? `Variants: ${g[blockType]}` : '';
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

