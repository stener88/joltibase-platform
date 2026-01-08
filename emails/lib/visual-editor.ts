/**
 * Visual Editor - Dual-Path Implementation
 * 
 * Simple edits → String replacement → No reload
 * Complex edits → AI regeneration → Iframe reload
 */

import { generateCompletion, type AIProvider } from '@/lib/ai/client';
import { 
  validateGeneratedCode, 
  extractCodeFromMarkdown, 
  cleanGeneratedCode,
  detectPlaceholders,
} from './validator';
import { AI_MODEL } from '@/lib/ai/config';
import fs from 'fs';
import path from 'path';

const GENERATED_DIR = path.join(process.cwd(), 'emails/generated');

export interface ComponentContext {
  type: 'text' | 'button' | 'heading' | 'section' | 'image' | 'container';
  id?: string;
  editId?: string;  // data-edit-id for precise element targeting
  propName?: string;  // Detected component prop name (e.g., "headline", "ctaText")
  currentText?: string;
  currentStyles?: Record<string, string>;
  tagName?: string;
  className?: string;
  fullContent?: string;
  parentContext?: string;
}

export interface EditResult {
  success: boolean;
  method: 'simple' | 'ai' | 'failed';
  code: string;
  message?: string;
  tokensUsed?: number;
  duration: number;
}

type EditComplexity = 'SIMPLE' | 'COMPLEX';

interface EditIntent {
  type: 'color' | 'text' | 'size' | 'layout' | 'style' | 'structure';
  action: 'change' | 'add' | 'remove' | 'replace';
  confidence: number;
  patterns: string[];
}

/**
 * Main visual edit handler - determines simple vs complex and routes accordingly
 */
export async function handleVisualEdit(
  filename: string,
  componentContext: ComponentContext,
  message: string
): Promise<EditResult> {
  const startTime = Date.now();
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 [VISUAL-EDIT] Starting edit for ${filename}`);
    console.log(`📝 [VISUAL-EDIT] Message: "${message}"`);
    console.log(`🎨 [VISUAL-EDIT] Context:`, componentContext);
  }

  try {
    // Step 1: Read current file
    const filepath = path.join(GENERATED_DIR, filename);
    if (!fs.existsSync(filepath)) {
      throw new Error(`File not found: ${filename}`);
    }
    
    const currentCode = fs.readFileSync(filepath, 'utf-8');

    // Step 2: Analyze edit complexity
    const intent = analyzeEditIntent(message);
    const complexity = determineComplexity(intent, componentContext);

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 [VISUAL-EDIT] Intent:`, intent);
      console.log(`📊 [VISUAL-EDIT] Complexity: ${complexity}`);
    }

    // Step 3: Choose path based on complexity
    if (complexity === 'SIMPLE' && intent.confidence >= 0.6) {
      // FAST PATH: String replacement
      console.log('⚡ [VISUAL-EDIT] Using FAST PATH (string replacement)');
      return await applySimpleEdit(
        filename,
        currentCode,
        componentContext,
        message,
        intent,
        startTime
      );
    } else {
      // SLOW PATH: AI regenerationreturn await applyAIEdit(
        filename,
        currentCode,
        componentContext,
        message,
        startTime
      );
    }
  } catch (error) {
    return {
      success: false,
      method: 'failed',
      code: '',
      message: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime
    };
  }
}

/**
 * Analyze user message to determine edit intent
 */
function analyzeEditIntent(message: string): EditIntent {
  const msg = message.toLowerCase().trim();
  
  // Pattern matching for different edit types
  const patterns = {
    color: [
      /make.*?(red|blue|green|yellow|purple|orange|pink|black|white|gray|#[0-9a-f]{6})/i,
      /change.*?color.*?to/i,
      /(red|blue|green|yellow|purple|orange|pink|black|white|gray|#[0-9a-f]{6}).*?background/i,
      /background.*?(red|blue|green|yellow|purple|orange|pink|black|white|gray|#[0-9a-f]{6})/i
    ],
    text: [
      /change.*?text.*?to/i,
      /replace.*?with/i,
      /update.*?text/i,
      /say ["']([^"']+)["']/i,
      /text should (say|be|read)/i
    ],
    size: [
      /make.*?(bigger|larger|smaller|tiny|huge)/i,
      /increase.*?size/i,
      /decrease.*?size/i,
      /(larger|smaller|bigger).*?font/i
    ],
    layout: [
      /add.*?(padding|margin|spacing)/i,
      /move.*?(up|down|left|right)/i,
      /center/i,
      /align/i,
      /position/i
    ],
    style: [
      /make.*?(bold|italic|underline)/i,
      /add.*?border/i,
      /rounded.*?corner/i,
      /shadow/i,
      /gradient/i
    ],
    structure: [
      /add.*?(section|button|text|image)/i,
      /remove.*?(section|button|text|image)/i,
      /delete/i,
      /create.*?new/i,
      /split.*?into/i
    ]
  };

  // Check each pattern type
  for (const [type, typePatterns] of Object.entries(patterns)) {
    for (const pattern of typePatterns) {
      if (pattern.test(msg)) {
        const matchedPatterns = typePatterns.filter(p => p.test(msg));
        return {
          type: type as EditIntent['type'],
          action: determineAction(msg),
          confidence: calculateConfidence(msg, matchedPatterns),
          patterns: matchedPatterns.map(p => p.source)
        };
      }
    }
  }

  // Unknown intent
  return {
    type: 'style',
    action: 'change',
    confidence: 0.3,
    patterns: []
  };
}

function determineAction(message: string): EditIntent['action'] {
  const msg = message.toLowerCase();
  if (msg.includes('add') || msg.includes('create')) return 'add';
  if (msg.includes('remove') || msg.includes('delete')) return 'remove';
  if (msg.includes('replace') || msg.includes('swap')) return 'replace';
  return 'change';
}

function calculateConfidence(message: string, matchedPatterns: RegExp[]): number {
  // More patterns matched = higher confidence
  const patternScore = Math.min(matchedPatterns.length * 0.3, 0.6);
  
  // Specific values mentioned = higher confidence
  const hasColorName = /\b(red|blue|green|yellow|purple|orange|pink|black|white|gray)\b/i.test(message);
  const hasSpecificValue = /["']|#[0-9a-f]{6}|\d+px/.test(message) || hasColorName;
  const specificityScore = hasSpecificValue ? 0.3 : 0;
  
  // Simple sentence structure = higher confidence
  const wordCount = message.trim().split(/\s+/).length;
  const simplicityScore = wordCount <= 10 ? 0.2 : 0;
  
  return Math.min(patternScore + specificityScore + simplicityScore, 1.0);
}

function determineComplexity(
  intent: EditIntent,
  context: ComponentContext
): EditComplexity {
  // Structure changes are always complex
  if (intent.type === 'structure') return 'COMPLEX';
  
  // Layout changes are complex
  if (intent.type === 'layout' && intent.action !== 'change') return 'COMPLEX';
  
  // Low confidence = use AI to be safe
  if (intent.confidence < 0.6) return 'COMPLEX';
  
  // Multiple actions in one message = complex
  const message = context.fullContent || '';
  if ((message.match(/and|also|then/gi) || []).length > 1) return 'COMPLEX';
  
  // Simple color, text, or size changes = simple
  if (['color', 'text', 'size'].includes(intent.type)) return 'SIMPLE';
  
  return 'COMPLEX';
}

/**
 * SIMPLE EDIT PATH - Fast string replacement
 */
async function applySimpleEdit(
  filename: string,
  currentCode: string,
  context: ComponentContext,
  message: string,
  intent: EditIntent,
  startTime: number
): Promise<EditResult> {
  try {
    let newCode = currentCode;
    let changesMade = false;

    // Extract what to change based on intent
    const changes = extractSimpleChanges(message, intent, context);// Apply changes based on type
    switch (intent.type) {
      case 'color':
        newCode = applyColorChange(currentCode, context, changes.color!, message);
        changesMade = true;
        break;
      
      case 'text':
        newCode = applyTextChange(currentCode, context, changes.text!);
        changesMade = true;
        break;
      
      case 'size':
        newCode = applySizeChange(currentCode, context, changes.size!);
        changesMade = true;
        break;
      
      default:
        throw new Error(`Cannot apply simple edit for type: ${intent.type}`);
    }

    if (!changesMade) {
      throw new Error('No changes could be applied');
    }

    // Validate the new code
    if (!validateSyntax(newCode)) {
      throw new Error('Generated code has syntax errors');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`💾 [SIMPLE] Original code length: ${currentCode.length} chars`);
      console.log(`💾 [SIMPLE] New code length: ${newCode.length} chars`);
      console.log(`💾 [SIMPLE] Code actually changed? ${currentCode !== newCode}`);
    }

    // Save the file
    const filepath = path.join(GENERATED_DIR, filename);fs.writeFileSync(filepath, newCode, 'utf-8');
    
    // Verify the file was written
    const savedCode = fs.readFileSync(filepath, 'utf-8');
    if (process.env.NODE_ENV === 'development') {
      console.log(`💾 [SIMPLE] Saved code length: ${savedCode.length} chars`);
      console.log(`💾 [SIMPLE] Save successful? ${savedCode === newCode}`);
    }

    return {
      success: true,
      method: 'simple',
      code: newCode,
      message: 'Applied simple edit successfully',
      duration: Date.now() - startTime
    };
  } catch (error) {
    // Fallback to AI if simple edit fails
    return await applyAIEdit(filename, currentCode, context, message, startTime);
  }
}

interface SimpleChanges {
  color?: string;
  text?: string;
  size?: string;
}

function extractSimpleChanges(
  message: string,
  intent: EditIntent,
  context: ComponentContext
): SimpleChanges {
  const changes: SimpleChanges = {};

  // Extract color
  const colorMatch = message.match(/\b(red|blue|green|yellow|purple|orange|pink|black|white|gray|#[0-9a-f]{6})\b/i);
  if (colorMatch) {
    changes.color = colorMatch[1].toLowerCase();
  }

  // Extract text (look for quotes or "to X")
  const textMatch = message.match(/["']([^"']+)["']|to\s+([a-zA-Z0-9\s]+)(?:\s|$)/i);
  if (textMatch) {
    changes.text = textMatch[1] || textMatch[2];
  }

  // Extract size
  const sizeMatch = message.match(/\b(bigger|larger|smaller|huge|tiny|\d+px)\b/i);
  if (sizeMatch) {
    changes.size = sizeMatch[1].toLowerCase();
  }

  return changes;
}

function applyColorChange(code: string, context: ComponentContext, color: string, message?: string): string {
  console.log('🎨 [COLOR] Applying color change:', { color, message, context: context.currentText });
  
  // Normalize color names to hex
  const colorMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#fbbf24',
    purple: '#a855f7',
    orange: '#f97316',
    pink: '#ec4899',
    black: '#000000',
    white: '#ffffff',
    gray: '#6b7280'
  };

  const hexColor = color.startsWith('#') ? color : colorMap[color] || color;
  
  // Determine if this is text color or background color
  const msgLower = message?.toLowerCase() || '';
  const isTextColor = msgLower.includes('text color') || msgLower.includes('font color') || msgLower.includes('color of the letters');
  const isBackgroundColor = msgLower.includes('background') || msgLower.includes('bg');
  
  // Default logic: If ambiguous, prefer text color over background color
  let colorProperty: 'color' | 'backgroundColor';
  if (isTextColor) {
    colorProperty = 'color';
  } else if (isBackgroundColor) {
    colorProperty = 'backgroundColor';
  } else {
    // Ambiguous - default to text color (most common case)
    colorProperty = 'color';
  }let changesMade = false;
  const originalCode = code;

  // PRIORITY 1: Check if element has INLINE style={{...}} and update that FIRST
  // This is critical because inline styles override style object references
  if (context.editId) {// Match multiline style objects with 's' flag
    const editIdPattern = new RegExp(
      `(<\\w+[^>]*data-edit-id="${context.editId}"[^>]*)(style=\\{\\{[\\s\\S]*?\\}\\})([^>]*>)`,
      'is'
    );
    const inlineMatch = code.match(editIdPattern);
    
    if (inlineMatch) {
      console.log('🎨 [COLOR] Found inline style on element - updating inline style');
      const beforeStyle = inlineMatch[1];
      const inlineStyleAttr = inlineMatch[2];
      const afterStyle = inlineMatch[3];
      
      // Extract style content (handles multiline)
      const styleContentMatch = inlineStyleAttr.match(/style=\{\{([\s\S]*?)\}\}/i);
      const styleContent = styleContentMatch?.[1] || '';
      
      console.log('🎨 [COLOR] Inline style content:', styleContent.substring(0, 200));
      
      const propertyRegex = new RegExp(`${colorProperty}:\\s*['"]?[^,'"}]*['"]?`, 'g');
      
      if (propertyRegex.test(styleContent)) {
        // Property exists - update itconst updatedStyle = styleContent.replace(propertyRegex, `${colorProperty}: '${hexColor}'`);
        const updatedInlineStyle = `style={{${updatedStyle}}}`;
        const updatedTag = beforeStyle + updatedInlineStyle + afterStyle;
        
        const fullTag = inlineMatch[0];
        code = code.replace(fullTag, updatedTag);
        changesMade = true;// Return early - inline style takes precedence
        return code;
      } else {
        // Add property to inline styleconst separator = styleContent.trim().endsWith(',') ? ' ' : ', ';
        const updatedStyle = styleContent.trim() 
          ? `${styleContent}${separator}${colorProperty}: '${hexColor}'`
          : ` ${colorProperty}: '${hexColor}' `;
        const updatedInlineStyle = `style={{${updatedStyle}}}`;
        const updatedTag = beforeStyle + updatedInlineStyle + afterStyle;
        
        const fullTag = inlineMatch[0];
        code = code.replace(fullTag, updatedTag);
        changesMade = true;// Return early
        return code;
      }
    } else {
      console.log('🎨 [COLOR] No inline style found on element, checking style object references...');
    }
  }

  // Strategy 1: Find and replace color in style objects (React Email TSX style)
  // React Email uses: <Heading style={h1}>{text}</Heading>
  // We need to find which style object is used, then update it
  if (context.currentText && context.tagName) {
    console.log(`🎨 [COLOR] Strategy 1: Looking for <${context.tagName}> with text "${context.currentText}"`);
    
    // Find the JSX element with this text
    const escapedText = escapeRegex(context.currentText);
    // Match: <Heading style={styleName}>text</Heading> or <h1 style={styleName}>text</h1>
    const jsxPattern = new RegExp(
      `<\\w+[^>]*style=\\{(\\w+)\\}[^>]*>[^<]*${escapedText}[^<]*<\\/\\w+>`,
      'i'
    );
    const jsxMatch = code.match(jsxPattern);
    
    if (jsxMatch) {
      const styleVarName = jsxMatch[1];// Find the style object definition: const h1 = { ... };
      const styleObjPattern = new RegExp(
        `(const\\s+${styleVarName}\\s*=\\s*\\{[^}]*${colorProperty}:\\s*['"][^'"]*['"][^}]*\\})`,
        's'
      );
      const styleObjMatch = code.match(styleObjPattern);
      
      if (styleObjMatch) {
        const styleBlock = styleObjMatch[1];
        console.log(`🎨 [COLOR] Found style object for ${styleVarName}`);
        console.log(`🎨 [COLOR] Original style block:`, styleBlock);
        
        // Replace the color property
        const colorPattern = new RegExp(`${colorProperty}:\\s*['"]([^'"]*)['"]`);
        const updatedBlock = styleBlock.replace(
          colorPattern,
          `${colorProperty}: '${hexColor}'`
        );
        
        console.log(`🎨 [COLOR] Updated style block:`, updatedBlock);
        console.log(`🎨 [COLOR] Code length before replace: ${code.length}`);
        
        code = code.replace(styleBlock, updatedBlock);
        
        console.log(`🎨 [COLOR] Code length after replace: ${code.length}`);
        console.log(`🎨 [COLOR] Did code change? ${code !== originalCode}`);
        
        changesMade = true;
        console.log('✅ [COLOR] Strategy 1 succeeded');
      }
    }
  }

  // Strategy 2: Find style object by tagName (e.g., const h1 = { ... })
  if (!changesMade && context.tagName) {// Try to find a style object with the tag name
    const stylePattern = new RegExp(
      `(const\\s+${context.tagName}\\s*=\\s*\\{[^}]*${colorProperty}:\\s*['"][^'"]*['"][^}]*\\})`,
      's'
    );
    const match = code.match(stylePattern);
    
    if (match) {
      const styleBlock = match[1];
      const colorPattern = new RegExp(`${colorProperty}:\\s*['"]([^'"]*)['"]`);
      const updatedBlock = styleBlock.replace(
        colorPattern,
        `${colorProperty}: '${hexColor}'`
      );
      
      code = code.replace(styleBlock, updatedBlock);
      changesMade = true;}
  }

  // Strategy 3: Find ANY style object with the color property (last resort)
  if (!changesMade) {// Find all style object definitions
    const allStylesPattern = new RegExp(
      `(const\\s+\\w+\\s*=\\s*\\{[^}]*${colorProperty}:\\s*['"][^'"]*['"][^}]*\\})`,
      'gs'
    );
    const matches = [...code.matchAll(allStylesPattern)];
    
    if (matches.length > 0) {
      // Update the first match (or we could be smarter and match by context)
      const styleBlock = matches[0][1];
      const colorPattern = new RegExp(`${colorProperty}:\\s*['"]([^'"]*)['"]`);
      const updatedBlock = styleBlock.replace(
        colorPattern,
        `${colorProperty}: '${hexColor}'`
      );
      
      code = code.replace(styleBlock, updatedBlock);
      changesMade = true;
      console.log('✅ [COLOR] Strategy 3 succeeded (first match)');
    }
  }

  if (!changesMade) {
    console.warn('⚠️ [COLOR] No color changes were applied!');
  } else {
    console.log('✅ [COLOR] Color change applied successfully');
  }

  return code;
}

function applyTextChange(code: string, context: ComponentContext, newText: string): string {
  if (!context.currentText) {
    throw new Error('No current text to replace');
  }

  // Escape special regex characters
  const escapedOldText = escapeRegex(context.currentText);
  
  // Find and replace the text
  // Look for text between JSX tags
  const textRegex = new RegExp(`(>[^<]*?)${escapedOldText}([^<]*?<)`, 'g');
  code = code.replace(textRegex, `$1${newText}$2`);

  return code;
}

function applySizeChange(code: string, context: ComponentContext, sizeChange: string): string {
  // Map size words to actual values
  const sizeMap: Record<string, string> = {
    tiny: '12px',
    small: '14px',
    normal: '16px',
    larger: '20px',
    bigger: '24px',
    huge: '32px'
  };

  let newSize = sizeMap[sizeChange] || sizeChange;

  // If relative size (bigger/smaller), adjust current size
  if (['bigger', 'larger', 'smaller', 'tiny'].includes(sizeChange)) {
    const currentSize = extractCurrentFontSize(code, context);
    if (currentSize) {
      const currentPx = parseInt(currentSize);
      const multiplier = ['bigger', 'larger'].includes(sizeChange) ? 1.25 : 0.8;
      newSize = `${Math.round(currentPx * multiplier)}px`;
    }
  }

  // Replace fontSize in styles
  const fontSizeRegex = /fontSize:\s*["']([^"']+)["']/g;
  
  if (context.currentText) {
    // Replace in component containing this text
    const componentRegex = new RegExp(
      `<(\\w+)[^>]*>[^<]*${escapeRegex(context.currentText)}[^<]*<\\/\\1>`,
      'g'
    );
    code = code.replace(componentRegex, (match) => {
      return match.replace(fontSizeRegex, `fontSize: "${newSize}"`);
    });
  } else if (context.tagName) {
    // Replace in nearest tag
    code = replaceInNearestTag(code, context.tagName, (tagContent) => {
      return tagContent.replace(fontSizeRegex, `fontSize: "${newSize}"`);
    });
  }

  return code;
}

/**
 * AI EDIT PATH - Full-file rewrite
 */
async function applyAIEdit(
  filename: string,
  currentCode: string,
  context: ComponentContext,
  message: string,
  startTime: number
): Promise<EditResult> {
  try {
    console.log('🤖 [AI] Generating edit with AI...');

    // Build context-aware prompt
    const prompt = buildEditPrompt(currentCode, context, message);

    // Call AI with retry logic
    const result = await generateWithRetry(prompt, 3);

    if (!result.success) {
      throw new Error(result.error || 'AI generation failed');
    }

    // Validate generated code
    if (!validateSyntax(result.code!)) {
      throw new Error('AI generated invalid code');
    }

    // Save the file
    const filepath = path.join(GENERATED_DIR, filename);
    fs.writeFileSync(filepath, result.code!, 'utf-8');

    return {
      success: true,
      method: 'ai',
      code: result.code!,
      message: 'Applied AI edit successfully',
      tokensUsed: result.tokensUsed,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      method: 'failed',
      code: currentCode,
      message: error instanceof Error ? error.message : 'AI edit failed',
      duration: Date.now() - startTime
    };
  }
}

function buildEditPrompt(
  currentCode: string,
  context: ComponentContext,
  message: string
): string {
  // Build element identification info
  let elementInfo = `- Type: ${context.type}`;
  
  if (context.editId) {
    // If we have editId, this is the most reliable identifier
    elementInfo += `\n- Element ID: ${context.editId} (IMPORTANT: Target the ${context.editId.split('-')[0]} at index ${context.editId.split('-')[1]})`;
  }
  
  elementInfo += `\n- Tag: ${context.tagName || 'N/A'}`;
  
  if (context.currentText) {
    elementInfo += `\n- Current Text: "${context.currentText}"`;
  }
  
  if (context.parentContext) {
    elementInfo += `\n- Parent: ${context.parentContext}`;
  }
  
  // Detect if this is a deletion request
  const isDeletion = /delete|remove|get rid of/i.test(message);
  const deletionInstruction = isDeletion 
    ? '\n\n⚠️ DELETION REQUEST: Completely REMOVE the target element and its entire JSX block from the code. Do not leave empty tags or placeholders.' 
    : '';
  
  return `You are editing a React Email component. Apply the following edit to the code.

CURRENT CODE:

\`\`\`tsx
${currentCode}
\`\`\`

TARGET ELEMENT:
${elementInfo}

USER REQUEST:
"${message}"${deletionInstruction}

REQUIREMENTS:
1. Apply ONLY the requested change to the TARGET ELEMENT
2. ${isDeletion ? 'REMOVE the entire element - delete the complete JSX block, including opening and closing tags' : 'Keep all other code exactly the same'}
3. Maintain existing structure and formatting
4. Do not add comments or explanations
5. Return only the complete, valid TypeScript React component
6. Keep all imports and exports
7. Ensure the code is production-ready
8. ${isDeletion ? 'After removal, ensure no empty containers or broken layout structure remains' : 'Preserve all existing functionality'}

Return ONLY the complete modified code, nothing else.`;
}

interface AIGenerationResult {
  success: boolean;
  code?: string;
  error?: string;
  tokensUsed?: number;
}

async function generateWithRetry(
  prompt: string,
  maxRetries: number
): Promise<AIGenerationResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 [AI] Attempt ${attempt}/${maxRetries}`);

      const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';
      
      const result = await generateCompletion(
        [
          { role: 'system', content: 'You are an expert React Email developer. Generate complete, production-ready code.' },
          { role: 'user', content: prompt },
        ],
        {
          provider,
          model: provider === 'gemini' ? AI_MODEL : 'gpt-4o',
          temperature: 0.3,
          maxTokens: 8000, // Increased for full component regeneration
        }
      );

      // Extract code from markdown if present
      let code = result.content.trim();
      const codeMatch = code.match(/```(?:tsx?|typescript|javascript)?\n([\s\S]*?)\n```/);
      if (codeMatch) {
        code = codeMatch[1];
      }

      // Clean and validate
      code = cleanGeneratedCode(code);

      // Validate it's actual code
      if (!code.includes('export default') && !code.includes('export function')) {
        throw new Error('AI did not return valid component code');
      }

      console.log('✅ [AI] Generation successful');
      return {
        success: true,
        code,
        tokensUsed: result.tokensUsed
      };
    } catch (error) {
      lastError = error as Error;
      console.warn(`⚠️ [AI] Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'All retry attempts failed'
  };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function validateSyntax(code: string): boolean {
  // Basic validation checks
  const checks = [
    code.includes('export default') || code.includes('export function'),
    code.includes('return'),
    code.trim().length > 50,
    !code.includes('undefined'),
    !code.includes('null as any')
  ];

  return checks.every(check => check === true);
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceInNearestTag(
  code: string,
  tagName: string,
  replacer: (content: string) => string
): string {
  const tagRegex = new RegExp(`<${tagName}[^>]*>.*?<\\/${tagName}>`, 'gs');
  return code.replace(tagRegex, (match) => replacer(match));
}

function extractCurrentFontSize(code: string, context: ComponentContext): string | null {
  if (context.currentText) {
    const componentRegex = new RegExp(
      `<(\\w+)[^>]*>[^<]*${escapeRegex(context.currentText)}[^<]*<\\/\\1>`,
      'g'
    );
    const match = componentRegex.exec(code);
    if (match) {
      const fontSizeMatch = match[0].match(/fontSize:\s*["']([^"']+)["']/);
      if (fontSizeMatch) {
        return fontSizeMatch[1];
      }
    }
  }
  return null;
}


