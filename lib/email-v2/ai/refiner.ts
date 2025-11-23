/**
 * Component Refinement
 * 
 * AI-powered refinement of individual EmailComponents
 */

import type { EmailComponent, GlobalEmailSettings } from '../types';
import { generateCompletion, type AIProvider } from '@/lib/ai/client';
import { componentRefinementSchema } from './schemas';

/**
 * Context for AI component refinement
 * Uses existing campaign data stored during generation
 */
export interface RefinementContext {
  // Existing campaign data (already stored during generation)
  emailSubject?: string;
  emailPreviewText?: string;
  campaignName?: string;
  originalPrompt?: string; // What the email is about
  
  // Component location
  componentPath?: string;
  siblingComponents?: EmailComponent[]; // Nearby content for coherence
  componentPosition?: string; // e.g., "Heading #2 (of 3 total Headings)"
  
  // Design settings
  globalSettings?: GlobalEmailSettings;
}

/**
 * Component-specific guidance for common edits
 */
const COMPONENT_EDIT_PATTERNS: Record<string, string> = {
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
function buildRefinementPrompt(
  component: string,
  currentProps: Record<string, any>,
  currentContent: string | undefined,
  userPrompt: string
): string {
  // For text/content changes, we don't need full props - just relevant ones
  // Extract only essential props to keep prompt lean
  const essentialProps: Record<string, any> = {};
  
  // Include 'as' prop for Heading (h1, h2, etc)
  if (component === 'Heading' && currentProps.as) {
    essentialProps.as = currentProps.as;
  }
  
  // Include href for Button/Link
  if ((component === 'Button' || component === 'Link') && currentProps.href) {
    essentialProps.href = currentProps.href;
  }
  
  // Include src/alt for Img
  if (component === 'Img') {
    if (currentProps.src) essentialProps.src = currentProps.src;
    if (currentProps.alt) essentialProps.alt = currentProps.alt;
    if (currentProps.width) essentialProps.width = currentProps.width;
    if (currentProps.height) essentialProps.height = currentProps.height;
  }
  
  // Only include style if it looks like the user wants to change styling
  // (check if prompt mentions color, size, bold, align, etc)
  const styleKeywords = ['color', 'size', 'bold', 'align', 'font', 'padding', 'margin', 'background'];
  const promptMentionsStyle = styleKeywords.some(kw => userPrompt.toLowerCase().includes(kw));
  
  if (promptMentionsStyle && currentProps.style) {
    essentialProps.style = currentProps.style;
  }

  const propsStr = Object.keys(essentialProps).length > 0
    ? JSON.stringify(essentialProps, null, 2)
    : 'None';
    
  const contentStr = currentContent || 'N/A';

  return `You are editing a ${component} component in a React Email.

CURRENT STATE:
Component type: ${component}
${contentStr !== 'N/A' ? `Current content: "${contentStr}"` : ''}
${propsStr !== 'None' ? `Current props: ${propsStr}` : ''}

RULES:
1. Return ONLY the props/content that need to CHANGE
2. All colors must be hex codes (#ffffff, #000000)
3. For style changes, include the complete style object with updates merged
4. If only changing text content, just return {"content": "new text"}

USER REQUEST: "${userPrompt}"

Return a JSON object with only what needs to change:
{
  "content": "updated content",  // if content changed
  "props": { /* updated props */ }  // if props changed
}`;
}

/**
 * Get enhanced refinement prompt with component-specific guidance and context
 */
function buildEnhancedRefinementPrompt(
  component: string,
  currentProps: Record<string, any>,
  currentContent: string | undefined,
  userPrompt: string,
  context?: RefinementContext
): string {
  const basePrompt = buildRefinementPrompt(component, currentProps, currentContent, userPrompt);
  const pattern = COMPONENT_EDIT_PATTERNS[component];
  
  // Add context section
  let contextSection = '';
  if (context) {
    contextSection = '\n\nEMAIL CONTEXT (Use for vague requests, respect explicit user instructions):';
    
    // Add component position first - critical for understanding which instance
    if (context.componentPosition) {
      contextSection += `\nComponent position: ${context.componentPosition}`;
    }
    
    if (context.emailSubject) {
      contextSection += `\nSubject: "${context.emailSubject}"`;
    }
    
    if (context.emailPreviewText) {
      contextSection += `\nPreview: "${context.emailPreviewText}"`;
    }
    
    if (context.originalPrompt) {
      contextSection += `\nPurpose: "${context.originalPrompt}"`;
    }
    
    // Add nearby components for coherence
    if (context.siblingComponents && context.siblingComponents.length > 0) {
      const nearby = context.siblingComponents
        .filter(c => c.content && c.content.length < 100) // Short content only
        .map(c => `"${c.content}"`)
        .slice(0, 2) // Max 2 siblings
        .join(', ');
      
      if (nearby) {
        contextSection += `\nNearby: ${nearby}`;
      }
    }
    
    contextSection += `

INSTRUCTIONS FOR CONTENT CHANGES:
    
1. VAGUE REQUESTS (generate contextually relevant content):
   - Questions: "Can you change this?", "Update this?", "and this text?", "What about this?"
   - Generic commands: "update", "improve", "change", "make it better", "fix this"
   → Use the email context (Subject/Purpose) to generate relevant content
   → IMPORTANT: Maintain the context of THIS specific component position (e.g., if it's Heading #2, keep it relevant to that section, not the main hero heading)
   
2. EXPLICIT CONTENT (use exactly what user specifies):
   - Quoted text: "change to 'Welcome Back'", "say 'Limited Offer'"
   - Direct content: "make it say Welcome", "change to Hello"
   - Specific instructions: "add the word Premium", "say 50% Off"
   → Use the user's exact words/intent
   
EXAMPLES:
✅ "Can you change the text?" → Generate from context (e.g., "Start Your Free Trial" for welcome email)
✅ "and this text?" → Generate from context (follow-up question, not literal content)
✅ "update this heading" → Generate from context
❌ "change to 'Limited Time'" → Use "Limited Time" (user specified exact content)
❌ "make it say Welcome Back" → Use "Welcome Back" (user specified exact content)

Do NOT use generic placeholders like "New Text Here" or echo the user's question back.`;
  }
  
  return basePrompt + contextSection + (pattern ? `\n\n${pattern}` : '');
}

/**
 * Refine a component using AI
 * 
 * @param component - The component to refine
 * @param prompt - User's refinement request
 * @param context - Optional context about the email (subject, purpose, etc.)
 * @returns Changes to apply (props and/or content)
 */
export async function refineComponent(
  component: EmailComponent,
  prompt: string,
  context?: RefinementContext
): Promise<{ props?: Record<string, any>; content?: string }> {
  console.log('🔄 [REFINE-COMPONENT] Refining component:', component.component);
  console.log('📝 [REFINE-COMPONENT] User prompt:', prompt);
  
  // Build refinement prompt with context
  const refinementPrompt = buildEnhancedRefinementPrompt(
    component.component,
    component.props || {},
    component.content,
    prompt,
    context
  );
  
  // Determine provider
  const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';
  const model = provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o';
  
  // Call AI with structured output
  const aiResult = await generateCompletion(
    [
      {
        role: 'system',
        content: `You are a precise email component editor. Follow the rules exactly and return only the changes needed.

CRITICAL RULES:
1. All colors MUST be hex codes (#ffffff, #000000) - never use color names
2. Use camelCase property names (backgroundColor, textColor, fontSize, fontWeight)
3. For style changes, include the complete style object with updates merged
4. Only return props/content that actually change
5. Preserve existing props unless explicitly changing them`,
      },
      {
        role: 'user',
        content: refinementPrompt,
      },
    ],
    {
      provider,
      model,
      temperature: 0.7,
      maxTokens: 1000,
      zodSchema: componentRefinementSchema,
    }
  );
  
  console.log(`✅ [REFINE-COMPONENT] ${provider.toUpperCase()} response received`);
  
  // Parse AI response
  let changes;
  try {
    const parsed = JSON.parse(aiResult.content);
    changes = componentRefinementSchema.parse(parsed);
    console.log('✅ [REFINE-COMPONENT] Response validated');
  } catch (error) {
    console.error('❌ [REFINE-COMPONENT] Failed to parse AI response:', error);
    throw new Error('Failed to parse AI refinement response');
  }
  
  // Normalize color values (convert color names to hex codes)
  if (changes.props) {
    normalizeColorsInProps(changes.props);
  }
  
  console.log('✅ [REFINE-COMPONENT] Refinement complete');
  
  return {
    props: changes.props,
    content: changes.content,
  };
}

/**
 * Normalize color values in props (convert color names to hex codes)
 */
function normalizeColorsInProps(props: Record<string, any>): void {
  const colorMap: Record<string, string> = {
    'white': '#ffffff',
    'black': '#000000',
    'light green': '#90ee90',
    'dark green': '#006400',
    'green': '#00ff00',
    'blue': '#0000ff',
    'light blue': '#add8e6',
    'red': '#ff0000',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'purple': '#800080',
    'pink': '#ffc0cb',
    'gray': '#808080',
    'grey': '#808080',
  };
  
  // Recursively normalize colors in props
  function normalizeValue(value: any): any {
    if (typeof value === 'string') {
      // Check if it's a color property
      if (value.startsWith('#')) {
        return value; // Already hex
      }
      // Check if it's a color name
      const lowerValue = value.toLowerCase();
      if (colorMap[lowerValue]) {
        return colorMap[lowerValue];
      }
      return value;
    }
    
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(normalizeValue);
      }
      const normalized: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        normalized[key] = normalizeValue(val);
      }
      return normalized;
    }
    
    return value;
  }
  
  // Normalize all color-related properties
  for (const [key, value] of Object.entries(props)) {
    if (key.includes('Color') || key === 'color' || key === 'backgroundColor' || key === 'textColor') {
      props[key] = normalizeValue(value);
    } else if (key === 'style' && typeof value === 'object') {
      // Normalize colors in style object
      props[key] = normalizeValue(value);
    }
  }
}

