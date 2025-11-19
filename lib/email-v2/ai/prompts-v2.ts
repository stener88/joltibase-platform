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

Available block types:

1. **hero** - Main headline section with CTA
   - Required: headline, ctaText, ctaUrl
   - Optional: subheadline, imageUrl

2. **features** - Grid of 2-4 features/benefits
   - Required: features array (2-4 items, each with title and description)
   - Optional: heading, subheading, layout

3. **content** - Text paragraphs with optional image
   - Required: paragraphs array (1-5 paragraphs)
   - Optional: heading, imageUrl, imageAlt, imagePosition

4. **testimonial** - Customer quote with author
   - Required: quote, authorName
   - Optional: authorTitle, authorCompany, authorImage, rating

5. **cta** - Call-to-action section
   - Required: headline, buttonText, buttonUrl
   - Optional: subheadline, style, backgroundColor

6. **footer** - Company info and links
   - Required: companyName, unsubscribeUrl
   - Optional: address, preferenceUrl, socialLinks, additionalLinks

Email structure guidelines:
- Always include a hero (unless transactional email)
- Always include a footer
- Include 2-8 total blocks
- Order logically: hero → content/features → cta → footer
- Keep content concise and scannable

Content best practices:
- Headlines: 5-10 words, action-oriented
- Descriptions: 10-30 words, benefit-focused
- CTAs: Clear, specific actions
- Use realistic example URLs (https://example.com/...)
- Keep paragraphs short (2-3 sentences max)

Brand voice:
- Primary color: {primaryColor}
- Font family: {fontFamily}
- Professional but approachable tone
- Focus on value proposition

Generate content that is:
1. Specific to user's request
2. Appropriate for email format
3. Action-oriented with clear CTAs
4. Properly structured

CRITICAL: Return valid JSON matching the EmailContent schema:
{
  "previewText": "string (1-140 chars)",
  "blocks": [
    { "blockType": "hero", ... },
    { "blockType": "features", ... },
    { "blockType": "cta", ... },
    { "blockType": "footer", ... }
  ]
}`;

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
  }
): string {
  let guidance = '';

  if (emailType === 'marketing') {
    guidance = `

Email type: Marketing campaign
Focus on: Compelling value proposition, clear CTA, social proof
Suggested blocks: hero, features, testimonial, cta, footer
Goal: Drive conversions and engagement`;
  } else if (emailType === 'transactional') {
    guidance = `

Email type: Transactional
Focus on: Clear information, next steps, helpful links
Suggested blocks: content, cta, footer
Note: Skip the hero section - get straight to the point`;
  } else if (emailType === 'newsletter') {
    guidance = `

Email type: Newsletter
Focus on: Multiple content sections, varied information, engagement
Suggested blocks: hero, content (multiple), cta, footer
Goal: Inform and engage subscribers`;
  } else {
    guidance = `

Email type: General
Recommended: Start with hero, include relevant content, end with CTA and footer`;
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

User request: "${userPrompt}"

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
- blocks array: 2-8 blocks total
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

