/**
 * Email Refinement System - AI-Native Approach
 * 
 * Pure AI-driven refinements using Gemini with full context awareness.
 * The AI handles everything from simple color changes to complex restructuring.
 */

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
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
  changesApplied: string[];
}

/**
 * Main AI refinement function - handles all types of changes
 */
export async function refineEmail(request: RefineRequest): Promise<RefineResult> {
  const { currentTsxCode, userMessage, selectedComponentId, selectedComponentType, componentMap } = request;
  
  console.log('[REFINER] Refining with AI:', userMessage);
  if (selectedComponentId) {
    console.log('[REFINER] Context: User selected', selectedComponentType, 'component');
  }
  
  const systemPrompt = `You are an expert React Email developer. You modify existing email components based on natural language requests.

# YOUR CAPABILITIES
You can handle ANY request:
- Simple changes: "make it blue", "bigger font", "add spacing"
- Multi-property changes: "center these and add spacing between them"
- Complex changes: "add a new section", "change layout to two columns"
- Image changes: "change this to a headset photo"
- Content changes: "make this more professional", "add a call-to-action"

# CRITICAL RULES

1. **PRESERVE WHAT WORKS**
   - Keep overall structure unless explicitly asked to change it
   - Keep existing content unless asked to modify/remove it
   - Maintain imports from '@react-email/components'
   - Keep Html/Head/Body/Container/Tailwind structure

2. **STATIC CONTENT ONLY**
   - ❌ NEVER use: {variables}, {props.text}, .map(), .forEach()
   - ✅ Write all text directly in JSX
   - ✅ If user wants "3 buttons", write 3 separate <Button> components

3. **STYLING - MIXED APPROACH**
   
   **TAILWIND (className) - SAFE for:**
   - Colors: bg-blue-500, text-gray-600, border-gray-300
   - Typography: text-sm, text-lg, font-bold, text-center
   - Basic spacing: p-4, px-6, py-3, m-0, mt-4, mb-8
   - Simple layout: flex, flex-col, items-center, justify-center, max-w-xl
   
   **INLINE STYLES (style prop) - REQUIRED for:**
   - Layout gaps: style={{display: 'flex', gap: '12px'}} NOT gap-3 or space-x-3
   - Spacing between siblings: style={{marginBottom: '16px'}} NOT space-y-4
   - Multiple properties: style={{display: 'flex', justifyContent: 'center', gap: '16px'}}
   - Complex positioning: Use inline styles for precise control
   
   **FORBIDDEN CLASSES** (will cause rendering errors):
   - ❌ space-x-*, space-y-*, gap-*, divide-*, grid-cols-*, grid-rows-*
   - ❌ hover:, focus:, active:, group-, dark: (no pseudo-classes)
   - ❌ Any class that requires <style> tag rules

4. **MULTI-PROPERTY CHANGES**
   - "center and add spacing" = TWO properties: justifyContent + gap
   - Use inline styles when multiple layout properties needed
   - Example: style={{display: 'flex', justifyContent: 'center', gap: '16px'}}

5. **ADDING NEW ELEMENTS**
   - Match existing style and tone
   - Use React Email components (Section, Heading, Text, Button, Img, etc.)
   - For buttons side-by-side: <div style={{display: 'flex', gap: '12px'}}>
   - For stacked elements: Add marginBottom to each

6. **IMAGES**
   - Keep width, height, and alt attributes
   - Use provided Unsplash URLs (when available)
   - Update alt text to describe new images

# OUTPUT FORMAT
Return ONLY the complete modified TSX code. No explanations, no markdown, just code.`;

  // Build comprehensive user prompt with context
  let userPrompt = `# CURRENT EMAIL CODE

\`\`\`tsx
${currentTsxCode}
\`\`\`

`;

  // Add selected component context (if user clicked something)
  if (selectedComponentId && selectedComponentType && componentMap) {
    const componentLocation = componentMap[selectedComponentId];
    
    // Extract the actual component code
    let componentCode = '';
    if (componentLocation) {
      componentCode = currentTsxCode.substring(
        componentLocation.startChar,
        componentLocation.endChar
      );
    }
    
    userPrompt += `# SELECTED COMPONENT

The user has selected a **${selectedComponentType}** component.

**The selected component's code:**
\`\`\`tsx
${componentCode}
\`\`\`

When they say:
- "this" / "it" / "the ${selectedComponentType.toLowerCase()}" → They mean THIS EXACT component shown above
- "delete this" → Remove THIS EXACT component from the code
- "change this" → Modify THIS EXACT component only
${selectedComponentType === 'Img' ? `
**For image changes:**
- Update the src attribute of THIS EXACT image only
- DO NOT add new images unless explicitly asked
- Keep the same width/height (or scale proportionally)
` : ''}
${selectedComponentType === 'Row' || selectedComponentType === 'Section' ? `
**For layout changes:**
- Apply layout properties (justifyContent, alignItems, gap) to THIS EXACT container
- Use inline styles for multi-property changes
` : ''}

`;
  }

  userPrompt += `# USER REQUEST

"${userMessage}"

`;

  // Detect and fetch images if needed

  const msg = userMessage.toLowerCase();
  const isImageChangeRequest = selectedComponentType === 'Img' && 
    (msg.includes('change') || msg.includes('replace') || msg.includes('different') || 
     msg.includes('photo') || msg.includes('picture'));

  if (isImageChangeRequest) {
    console.log('[REFINER] Fetching new image for:', userMessage);
    try {
      const keyword = extractImageKeyword(userMessage);
      console.log('[REFINER] Extracted image keyword:', keyword);
      
      const imageResult = await fetchUnsplashImage({
        query: keyword,
        orientation: 'landscape',
        width: 600,
        height: 300,
      });
      
      if (imageResult) {
        console.log('[REFINER] Fetched image:', imageResult.url.substring(0, 60));
        userPrompt += `# NEW IMAGE AVAILABLE

Use this Unsplash image:
- **URL**: ${imageResult.url}
- **Alt text**: "${imageResult.alt}"

Update the selected <Img> component's src to this URL.

`;
      }
    } catch (error) {
      console.warn('[REFINER] Failed to fetch image, AI will proceed without:', error);
    }
  }

  userPrompt += `# YOUR TASK

Modify the code above based on the user's request.
Return ONLY the complete modified TSX code, nothing else.`;


  // Generate modified code with AI
  try {
    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    });
    
    // Log token usage and cost (Gemini 2.0 Flash pricing)
    if (result.usage) {
      const usage = result.usage as any;
      const inputTokens = usage.inputTokens || 0;
      const outputTokens = usage.outputTokens || 0;
      const totalTokens = usage.totalTokens || 0;
      
      const inputCost = (inputTokens / 1000) * 0.00001875;
      const outputCost = (outputTokens / 1000) * 0.000075;
      const totalCost = inputCost + outputCost;
      
      console.log(`💰 [REFINER] Tokens: ${totalTokens} (in: ${inputTokens}, out: ${outputTokens}) | Cost: $${totalCost.toFixed(6)}`);
    }
    
    // Extract code from markdown if present
    let newCode = result.text.trim();
    const codeMatch = newCode.match(/```(?:tsx|typescript)?\n([\s\S]*?)\n```/);
    if (codeMatch) {
      newCode = codeMatch[1].trim();
    }
    
    console.log('[REFINER] ✅ AI successfully modified code');
    
    return {
      newTsxCode: newCode,
      message: `Applied changes: ${userMessage}`,
      changesApplied: ['AI-generated modification'],
    };
    
  } catch (error) {
    console.error('[REFINER] ❌ AI refinement failed:', error);
    throw new Error(`Failed to apply changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper: Extract image keyword from user message
 */
function extractImageKeyword(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // Look for keyword after prepositions "to", "of", "with", "showing"
  const prepositionMatch = msg.match(/(?:to|of|with|showing)\s+(?:a\s+)?(\w+(?:\s+\w+)?)/);
  if (prepositionMatch) {
    return prepositionMatch[1].trim();
  }
  
  // Remove common words and extract meaningful nouns
  const stopWords = /\b(can|you|please|change|replace|update|photo|image|picture|to|the|this|it|with|a|an|make|show|use)\b/gi;
  const words = msg
    .replace(stopWords, ' ')
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 2); // Filter out very short words
  
  if (words.length > 0) {
    // Prefer last word (usually the subject: "change to headset" → "headset")
    return words[words.length - 1];
  }
  
  // Fallback to generic keyword
  return 'professional';
}

