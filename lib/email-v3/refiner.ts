/**
 * Email Refinement System
 * 
 * Two-tier approach:
 * - Tier 1: Small changes (colors, fonts, spacing) → Direct TSX manipulation
 * - Tier 2: Large changes (add sections, restructure) → AI regeneration with context
 */

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { updateComponentText, updateInlineStyle } from './tsx-manipulator';
import { fetchUnsplashImage } from '@/lib/unsplash/client';
import type { ComponentMap } from './tsx-parser';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export interface RefineRequest {
  currentTsxCode: string;
  userMessage: string;
  componentMap?: ComponentMap;
  selectedComponentId?: string | null;
  selectedComponentType?: string | null;
}

export interface RefineResult {
  newTsxCode: string;
  message: string;
  changeType: 'small' | 'large';
  changesApplied: string[];
}

/**
 * Classify user intent as small or large change
 */
export function classifyIntent(userMessage: string, selectedComponentType?: string | null): 'small' | 'large' {
  const msg = userMessage.toLowerCase();
  
  // Image change detection - if user clicked an image and wants to change it
  if (selectedComponentType === 'Img') {
    // Image changes always need AI to fetch new image or update src
    if (msg.includes('change') || msg.includes('replace') || msg.includes('different') || 
        msg.includes('photo') || msg.includes('image') || msg.includes('picture')) {
      return 'large'; // AI will handle image replacement
    }
  }
  
  // Small change keywords
  const smallChangeKeywords = [
    // Color changes
    'color', 'blue', 'red', 'green', 'yellow', 'orange', 'purple', 'pink', 'gray', 'black', 'white',
    // Size/spacing
    'bigger', 'smaller', 'larger', 'font size', 'padding', 'margin', 'spacing',
    // Typography
    'bold', 'italic', 'underline', 'font', 'text align', 'center', 'left', 'right',
  ];
  
  // Large change keywords
  const largeChangeKeywords = [
    // Structural
    'add section', 'add a section', 'new section', 'insert', 'create',
    'add button', 'add image', 'add heading', 'add text',
    'remove section', 'delete section', 'take out',
    // Layout
    'rearrange', 'reorder', 'move', 'restructure', 'layout',
    'two columns', 'three columns', 'grid',
    // Content
    'add content', 'more content', 'additional', 'include',
    'list of', 'multiple', 'several',
    // Images
    'change photo', 'change image', 'replace photo', 'different image',
  ];
  
  // Check for large changes first (more specific)
  if (largeChangeKeywords.some(keyword => msg.includes(keyword))) {
    return 'large';
  }
  
  // Then check for small changes
  if (smallChangeKeywords.some(keyword => msg.includes(keyword))) {
    return 'small';
  }
  
  // If user selected a component and says "make it/this [color/style]", it's probably small
  if (selectedComponentType && (msg.includes('make it') || msg.includes('make this') || msg.includes('change it'))) {
    return 'small';
  }
  
  // Default to large for safety (AI can handle anything)
  return 'large';
}

/**
 * Tier 1: Handle small changes with direct TSX manipulation
 */
export async function applySmallChange(request: RefineRequest): Promise<RefineResult> {
  const { currentTsxCode, userMessage, componentMap, selectedComponentId, selectedComponentType } = request;
  
  console.log('[REFINER] Applying small change:', userMessage);
  if (selectedComponentId) {
    console.log('[REFINER] Targeting selected component:', selectedComponentType, selectedComponentId);
  }
  
  // Add selected component context to prompt
  let contextInfo = '';
  if (selectedComponentId && selectedComponentType) {
    contextInfo = `\nIMPORTANT CONTEXT: User has selected a ${selectedComponentType} component (ID: ${selectedComponentId}).
Words like "this", "it", "the ${selectedComponentType.toLowerCase()}" refer to ONLY this selected component.
Set "target" to "selected" to apply changes ONLY to this component.
`;
  }

  // Use AI to parse the intent and extract parameters
  const parsePrompt = `
You are a code modification assistant. Parse this user request and output ONLY valid JSON.
${contextInfo}
User request: "${userMessage}"

Extract:
1. What property to change (color, backgroundColor, fontSize, padding, margin, etc.)
2. The new value
3. Which component to change:
   - "selected" = apply to selected component only (use when user says "this", "it", or refers to the selected component)
   - "all" = apply to all matching components
   - "button", "heading", "text", etc. = apply to specific component type

Output format (JSON only, no other text):
{
  "property": "backgroundColor",
  "value": "#3b82f6",
  "target": "selected" | "all" | "button" | "heading" | "text" | etc
}

Common properties:
- color (text color): hex color like "#000000"
- backgroundColor: hex color like "#ffffff"  
- fontSize: value with unit like "18px" or "1.5rem"
- fontWeight: "bold" or "400", "500", "600", "700"
- padding: value like "16px"
- margin: value like "8px"

Examples:
${selectedComponentType ? `"make this blue" → {"property": "backgroundColor", "value": "#3b82f6", "target": "selected"}` : ''}
"make the text blue" → {"property": "color", "value": "#3b82f6", "target": "all"}
"change button color to red" → {"property": "backgroundColor", "value": "#ef4444", "target": "button"}
"make heading bigger" → {"property": "fontSize", "value": "2.5rem", "target": "heading"}
`;

  try {
    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: parsePrompt,
      temperature: 0.1,
    });
    
    // Parse AI response
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse intent');
    }
    
    const intent = JSON.parse(jsonMatch[0]);
    console.log('[REFINER] Parsed intent:', intent);
    
    // Apply the change
    let newTsxCode = currentTsxCode;
    const changesApplied: string[] = [];
    
    // Handle based on target
    if (intent.target === 'selected' && selectedComponentId && componentMap) {
      // Apply ONLY to selected component
      console.log('[REFINER] Applying to selected component:', selectedComponentId);
      newTsxCode = updateInlineStyle(
        newTsxCode,
        componentMap,
        selectedComponentId,
        intent.property,
        intent.value
      );
      changesApplied.push(`Updated ${intent.property} to ${intent.value} for selected ${selectedComponentType}`);
      
    } else if (componentMap && intent.target !== 'all') {
      // Find matching components by type
      const matchingComponents = Object.entries(componentMap).filter(([_, info]) => 
        info.type.toLowerCase() === intent.target.toLowerCase() ||
        info.type.toLowerCase().includes(intent.target.toLowerCase())
      );
      
      if (matchingComponents.length > 0) {
        for (const [componentId] of matchingComponents) {
          newTsxCode = updateInlineStyle(
            newTsxCode,
            componentMap,
            componentId,
            intent.property,
            intent.value
          );
        }
        changesApplied.push(`Updated ${intent.property} to ${intent.value} for ${matchingComponents.length} ${intent.target} component(s)`);
      } else {
        throw new Error(`No ${intent.target} components found`);
      }
      
    } else {
      // Apply globally - add inline style to all text/heading components
      if (componentMap) {
        const textComponents = Object.entries(componentMap).filter(([_, info]) => 
          ['Text', 'Heading', 'Button', 'Link'].includes(info.type)
        );
        
        for (const [componentId] of textComponents) {
          newTsxCode = updateInlineStyle(
            newTsxCode,
            componentMap,
            componentId,
            intent.property,
            intent.value
          );
        }
        changesApplied.push(`Updated ${intent.property} to ${intent.value} globally (${textComponents.length} components)`);
      }
    }
    
    return {
      newTsxCode,
      message: `Applied ${intent.property} change: ${intent.value}`,
      changeType: 'small',
      changesApplied,
    };
    
  } catch (error) {
    console.error('[REFINER] Small change failed, falling back to large change:', error);
    // Fallback to large change if small change parsing fails
    return applyLargeChange(request);
  }
}

/**
 * Tier 2: Handle large changes with AI regeneration
 */
export async function applyLargeChange(request: RefineRequest): Promise<RefineResult> {
  const { currentTsxCode, userMessage, selectedComponentId, selectedComponentType } = request;
  
  console.log('[REFINER] Applying large change with AI:', userMessage);
  if (selectedComponentId) {
    console.log('[REFINER] Context: User selected', selectedComponentType, 'component');
  }
  
  const systemPrompt = `You are an expert React Email developer. You modify existing email components based on user requests.

CRITICAL RULES:
1. Preserve the overall structure unless explicitly asked to change it
2. Keep existing content unless asked to modify/remove it
3. Write static content only (no {variables}, no .map() loops)
4. Keep imports from '@react-email/components'
5. Maintain the Html/Head/Body/Container/Tailwind structure

STYLING - MIXED APPROACH:
- **TAILWIND (className)** - OK for: colors, typography, basic spacing
  - Examples: bg-blue-500, text-gray-600, text-sm, font-bold, p-4, m-2
  
- **INLINE STYLES (style prop)** - REQUIRED for: layout gaps, spacing between elements
  - For flex gaps: style={{display: 'flex', gap: '12px'}} NOT gap-3 or space-x-3
  - For spacing: style={{marginBottom: '16px'}} on each child, NOT space-y-4
  - For positioning: Use inline styles, NOT complex grid utilities

- **FORBIDDEN CLASSES** (will cause rendering errors):
  - ❌ space-x-*, space-y-*, gap-*, divide-*, grid-cols-*
  - ❌ hover:, focus:, active:, group-, dark: (no pseudo-classes)

When adding new sections/elements:
- Match the existing style and tone
- Use appropriate React Email components (Section, Heading, Text, Button, etc.)
- Use inline styles for layout and spacing between elements
- For buttons side-by-side: Wrap in div with style={{display: 'flex', gap: '12px'}}
- For stacked elements: Add style={{marginBottom: '16px'}} to each element

When modifying images:
- Update the src URL to relevant Unsplash image
- Keep width and height attributes
- Update alt text to describe the new image

Output ONLY the complete modified TSX code, nothing else.`;

  let userPrompt = `Here is the current email component code:

\`\`\`tsx
${currentTsxCode}
\`\`\`
`;

  // Add selected component context
  if (selectedComponentId && selectedComponentType) {
    userPrompt += `\nIMPORTANT CONTEXT: The user has selected a ${selectedComponentType} component.
When the user says "this", "it", or refers to the current element, they mean this specific ${selectedComponentType}.
${selectedComponentType === 'Img' ? 'To change the image, update the src attribute with a new Unsplash URL. DO NOT add a new image, modify the existing one.' : ''}

`;
  }

  userPrompt += `User request: ${userMessage}

`;

  // If user wants to change an image, fetch a new one first
  if (selectedComponentType === 'Img' && (userMessage.toLowerCase().includes('change') || 
      userMessage.toLowerCase().includes('replace') || userMessage.toLowerCase().includes('different'))) {
    console.log('[REFINER] Fetching new image for:', userMessage);
    try {
      // Extract keyword from user message - smart extraction
      const msg = userMessage.toLowerCase();
      let keyword = 'professional';
      
      // Look for keyword after "to", "of", "with" prepositions
      const toMatch = msg.match(/(?:to|of|with|showing)\s+(?:a\s+)?(\w+(?:\s+\w+)?)/);
      if (toMatch) {
        keyword = toMatch[1].trim();
      } else {
        // Fallback: Remove common words and take last meaningful word
        const words = msg
          .replace(/can|you|please|change|replace|update|photo|image|picture|to|the|this|it|with|a|an|make/gi, ' ')
          .trim()
          .split(/\s+/)
          .filter(w => w.length > 2);
        
        if (words.length > 0) {
          keyword = words[words.length - 1]; // Take last word (usually the noun)
        }
      }
      
      console.log('[REFINER] Extracted image keyword:', keyword);
      
      const imageResult = await fetchUnsplashImage({
        query: keyword,
        orientation: 'landscape',
        width: 600,
        height: 300,
      });
      
      if (imageResult) {
        console.log('[REFINER] Fetched image:', imageResult.url.substring(0, 60));
        userPrompt += `\nNEW IMAGE TO USE: ${imageResult.url}
Update the selected Img component's src to this URL.
Alt text: "${imageResult.alt}"

`;
      }
    } catch (error) {
      console.warn('[REFINER] Failed to fetch image, proceeding without:', error);
    }
  }

  userPrompt += `Provide the COMPLETE modified code with the changes applied. Output only the TSX code, no explanations.`;

  try {
    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    });
    
    // Extract code from markdown if present
    let newCode = result.text;
    const codeMatch = newCode.match(/```(?:tsx|typescript)?\n([\s\S]*?)\n```/);
    if (codeMatch) {
      newCode = codeMatch[1];
    }
    
    console.log('[REFINER] AI generated modified code');
    
    return {
      newTsxCode: newCode,
      message: `Applied changes using AI: ${userMessage}`,
      changeType: 'large',
      changesApplied: ['AI-generated modification based on request'],
    };
    
  } catch (error) {
    console.error('[REFINER] Large change failed:', error);
    throw new Error(`Failed to apply changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Main refine function - automatically chooses tier
 */
export async function refineEmail(request: RefineRequest): Promise<RefineResult> {
  const changeType = classifyIntent(request.userMessage, request.selectedComponentType);
  
  console.log(`[REFINER] Classified as ${changeType} change`);
  
  if (changeType === 'small') {
    return applySmallChange(request);
  } else {
    return applyLargeChange(request);
  }
}

