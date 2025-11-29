/**
 * Streaming Email Refiner
 * 
 * Handles AI-powered email refinements with real-time streaming responses
 * Supports two modes:
 * 1. Consultation: Answer questions and provide suggestions (no code changes)
 * 2. Execution: Modify code based on commands (with validation and diff generation)
 */

import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { detectIntent } from './intent-detector';
import { resolveImage, extractImageKeyword } from './image-resolver';
import { validateTsxCode } from './code-validator';
import { generateDiff, type CodeChange } from './diff-generator';
import type { ComponentMap } from './tsx-parser';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export interface RefineStreamRequest {
  currentTsxCode: string;
  userMessage: string;
  componentMap?: ComponentMap;
  selectedComponentId?: string | null;
  selectedComponentType?: string | null;
}

export interface RefineStreamResult {
  stream: ReturnType<typeof streamText>;
  intent: 'question' | 'command';
}

/**
 * Consultation system prompt - for answering questions
 */
const CONSULTATION_PROMPT = `You are an expert email designer and marketing consultant.
The user is working on an email campaign and has asked you a question.

Your role:
- Provide specific, actionable suggestions
- Be conversational and friendly (like a helpful colleague)
- Reference the actual email content when making suggestions
- Give 2-3 concrete ideas they can implement
- Keep responses concise (2-4 sentences max)

Style:
- Professional but warm
- Use "you" and "your" (not "the user")
- Give examples when helpful
- Don't apologize or be overly formal`;

/**
 * Execution system prompt - for modifying code
 */
const EXECUTION_PROMPT = `You are an expert React Email developer modifying email components based on user requests.

# CRITICAL RULES

1. **PRESERVE STRUCTURE**
   - Keep overall layout unless explicitly asked to change it
   - Maintain existing content unless told to modify/remove it
   - Keep imports from '@react-email/components'

2. **STATIC CONTENT ONLY**
   - ❌ NEVER use: {variables}, {props.text}, .map(), .forEach()
   - ✅ Write all text directly in JSX
   - ✅ If asked for "3 buttons", write 3 separate <Button> components

3. **STYLING - MIXED APPROACH**
   
   **TAILWIND (className) - SAFE for:**
   - Colors: bg-blue-500, text-gray-600
   - Typography: text-sm, text-lg, font-bold, text-center
   - Basic spacing: p-4, px-6, py-3, m-0, mt-4

   **INLINE STYLES (style prop) - REQUIRED for:**
   - Layout gaps: style={{display: 'flex', gap: '12px'}}
   - Spacing between siblings: style={{marginBottom: '16px'}}
   - Complex positioning

   **FORBIDDEN CLASSES**:
   - ❌ space-x-*, space-y-*, gap-*, divide-*
   - ❌ hover:, focus:, active:, group-, dark:

4. **IMAGES**
   - ONLY use image URLs that are explicitly provided
   - NEVER generate or make up image URLs
   - If no image URL is provided, keep the existing src attribute

# OUTPUT FORMAT
Return ONLY the complete modified TSX code. No explanations, no markdown, just code.`;

/**
 * Main streaming refiner function
 */
export async function refineEmailStreaming(
  request: RefineStreamRequest
): Promise<RefineStreamResult> {
  const { currentTsxCode, userMessage, selectedComponentId, selectedComponentType, componentMap } = request;

  // Detect user intent
  const intent = detectIntent(userMessage);
  
  console.log(`[REFINER-STREAM] Intent: ${intent}, Message: "${userMessage}"`);

  // CONSULTATION MODE - Answer questions
  if (intent === 'question') {
    const stream = streamText({
      model: google('gemini-2.0-flash-exp'),
      system: CONSULTATION_PROMPT,
      prompt: buildConsultationPrompt(currentTsxCode, userMessage),
      temperature: 0.8,
    });

    return { stream, intent: 'question' };
  }

  // EXECUTION MODE - Modify code
  
  // Resolve images if this is an image change request
  let imageUrl: string | null = null;
  const msg = userMessage.toLowerCase();
  const isImageRequest = selectedComponentType === 'Img' && 
    (msg.includes('change') || msg.includes('replace') || msg.includes('different') || 
     msg.includes('photo') || msg.includes('picture'));

  if (isImageRequest) {
    console.log('[REFINER-STREAM] Image change detected, resolving image...');
    try {
      const keyword = extractImageKeyword(userMessage);
      const result = await resolveImage(keyword, {
        orientation: 'landscape',
        width: 600,
        height: 300,
      });
      imageUrl = result.url;
      console.log(`[REFINER-STREAM] Resolved image: ${imageUrl.substring(0, 60)}... (source: ${result.source})`);
    } catch (error) {
      console.warn('[REFINER-STREAM] Image resolution failed:', error);
    }
  }

  const stream = streamText({
    model: google('gemini-2.0-flash-exp'),
    system: EXECUTION_PROMPT,
    prompt: buildExecutionPrompt({
      currentTsxCode,
      userMessage,
      imageUrl,
      selectedComponentId,
      selectedComponentType,
      componentMap,
    }),
    temperature: 0.7,
  });

  return { stream, intent: 'command' };
}

/**
 * Build consultation prompt (for questions)
 */
function buildConsultationPrompt(currentTsxCode: string, userMessage: string): string {
  return `# THE EMAIL CODE

\`\`\`tsx
${currentTsxCode}
\`\`\`

# USER'S QUESTION

"${userMessage}"

Provide 2-3 specific, actionable suggestions to improve the email or answer their question. Be conversational and reference the actual email content.`;
}

/**
 * Build execution prompt (for commands)
 */
function buildExecutionPrompt(params: {
  currentTsxCode: string;
  userMessage: string;
  imageUrl: string | null;
  selectedComponentId?: string | null;
  selectedComponentType?: string | null;
  componentMap?: ComponentMap;
}): string {
  let prompt = `# CURRENT EMAIL CODE

\`\`\`tsx
${params.currentTsxCode}
\`\`\`

`;

  // Add selected component context
  if (params.selectedComponentId && params.selectedComponentType && params.componentMap) {
    const componentLocation = params.componentMap[params.selectedComponentId];
    
    if (componentLocation) {
      const componentCode = params.currentTsxCode.substring(
        componentLocation.startChar,
        componentLocation.endChar
      );
      
      prompt += `# SELECTED COMPONENT

The user has selected a **${params.selectedComponentType}** component.

**The selected component's code:**
\`\`\`tsx
${componentCode}
\`\`\`

When they say:
- "this" / "it" / "the ${params.selectedComponentType.toLowerCase()}" → They mean THIS EXACT component
- "delete this" → Remove THIS EXACT component
- "change this" → Modify THIS EXACT component only

`;
    }
  }

  // Add image URL if available
  if (params.imageUrl) {
    prompt += `# NEW IMAGE AVAILABLE

Use this image URL (already validated and working):
- **URL**: ${params.imageUrl}
- **Alt text**: "${extractImageKeyword(params.userMessage)}"

Update the selected <Img> component's src to this URL.

`;
  }

  prompt += `# USER REQUEST

"${params.userMessage}"

# YOUR TASK

Modify the code above based on the user's request.
Return ONLY the complete modified TSX code, nothing else.`;

  return prompt;
}

/**
 * Validate and generate diff for code changes
 * Called after streaming completes
 */
export function processCodeChanges(params: {
  oldCode: string;
  newCode: string;
  userMessage: string;
}): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  changes: CodeChange[];
  conversationalResponse: string;
} {
  // Validate the new code
  const validation = validateTsxCode(params.newCode);
  
  // Generate diff
  const changes = generateDiff(params.oldCode, params.newCode);
  
  // Generate conversational response
  const conversationalResponse = generateConversationalResponse(
    params.userMessage,
    changes
  );
  
  return {
    valid: validation.valid,
    errors: validation.errors,
    warnings: validation.warnings,
    changes,
    conversationalResponse,
  };
}

/**
 * Generate a natural, conversational response based on changes
 */
function generateConversationalResponse(userMessage: string, changes: CodeChange[]): string {
  const msg = userMessage.toLowerCase();
  
  // Specific responses based on change types
  if (changes.length === 0) {
    return "Hmm, I'm not sure what to change. Can you be more specific?";
  }
  
  if (changes.some(c => c.type === 'removed')) {
    return "Done! I've removed that for you.";
  }
  
  if (changes.some(c => c.property === 'src')) {
    return "Great choice! I've updated the image.";
  }
  
  if (changes.some(c => c.property === 'color')) {
    const colorChange = changes.find(c => c.property === 'color');
    return `Perfect! Changed the color to ${colorChange?.newValue || 'your selection'}.`;
  }
  
  if (changes.some(c => c.property === 'text')) {
    return "Updated the text for you!";
  }
  
  if (changes.some(c => c.type === 'added')) {
    return "Done! I've added that to your email.";
  }
  
  // Contextual responses
  if (msg.includes('bigger') || msg.includes('larger')) {
    return "Made it bigger! Let me know if you'd like it even larger.";
  }
  
  if (msg.includes('smaller')) {
    return "Made it smaller for you!";
  }
  
  if (msg.includes('center') || msg.includes('align')) {
    return "Perfect! Adjusted the alignment.";
  }
  
  if (msg.includes('spacing') || msg.includes('padding')) {
    return "Nice! I've adjusted the spacing.";
  }
  
  // Generic friendly responses
  const genericResponses = [
    "Done! How does that look?",
    "All set! Let me know if you'd like any other adjustments.",
    "Perfect! Made those changes for you.",
  ];
  
  const index = changes.length % genericResponses.length;
  return genericResponses[index];
}

