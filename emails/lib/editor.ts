/**
 * Full-File Rewrite Email Editor
 * 
 * Core innovation: Instead of merging blocks, AI reads current code
 * and generates complete new code with changes applied.
 * 
 * This solves the intelligent merge problem by avoiding it entirely.
 */

import { generateCompletion, type AIProvider } from '@/lib/ai/client';
import { 
  validateGeneratedCode, 
  extractCodeFromMarkdown, 
  cleanGeneratedCode,
  detectPlaceholders,
  type ValidationResult 
} from './validator';
import fs from 'fs';
import path from 'path';

const GENERATED_DIR = path.join(process.cwd(), 'emails/generated');
const MAX_REFINEMENT_ATTEMPTS = 3;

export interface RefinementResult {
  code: string;
  attempts: number;
  validation: ValidationResult;
}

/**
 * Refine an existing email component using full-file rewrite
 */
export async function refineEmailComponent(
  filename: string,
  refinementPrompt: string,
  maxRetries: number = MAX_REFINEMENT_ATTEMPTS
): Promise<RefinementResult> {
  
  console.log(`✏️ [EDITOR] Refining ${filename}: "${refinementPrompt}"`);
  
  const filepath = path.join(GENERATED_DIR, filename);
  
  // Read current code
  if (!fs.existsSync(filepath)) {
    throw new Error(`Email file not found: ${filename}`);
  }
  
  const currentCode = fs.readFileSync(filepath, 'utf-8');
  
  // SAFETY NET: Backup before refining
  const backupPath = filepath.replace('.tsx', '.backup.tsx');
  fs.copyFileSync(filepath, backupPath);
  console.log(`💾 [EDITOR] Created backup: ${path.basename(backupPath)}`);
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 [EDITOR] Attempt ${attempt}/${maxRetries}...`);
      
      // Generate refined code with escalating strictness
      const newCode = await generateRefinedCode(
        currentCode,
        refinementPrompt,
        attempt
      );
      
      // Clean and validate
      const cleaned = cleanGeneratedCode(newCode);
      const validation = validateGeneratedCode(cleaned);
      
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Check for placeholders
      const placeholders = detectPlaceholders(cleaned);
      if (placeholders.length > 0) {
        throw new Error(`Contains placeholders: ${placeholders.join(', ')}`);
      }
      
      // Check not identical to current
      if (cleaned.trim() === currentCode.trim()) {
        throw new Error('AI returned identical code - no changes made');
      }
      
      // Check not too short (likely incomplete)
      if (cleaned.length < currentCode.length * 0.7) {
        throw new Error(`Code too short (${cleaned.length} vs ${currentCode.length}) - likely incomplete`);
      }
      
      // SUCCESS: Save new code
      fs.writeFileSync(filepath, cleaned, 'utf-8');
      console.log(`✅ [EDITOR] Refinement successful on attempt ${attempt}`);
      
      // Clean up backup
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
      
      return {
        code: cleaned,
        attempts: attempt,
        validation,
      };
      
    } catch (error: any) {
      lastError = error;
      console.error(`❌ [EDITOR] Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        // RESTORE BACKUP on final failure
        console.error(`🔙 [EDITOR] Restoring backup after ${maxRetries} failed attempts`);
        fs.copyFileSync(backupPath, filepath);
        
        throw new Error(
          `Refinement failed after ${maxRetries} attempts. ` +
          `Last error: ${error.message}. Original file restored from backup.`
        );
      }
      
      console.log(`🔄 [EDITOR] Retrying with stricter prompt...`);
    }
  }
  
  throw lastError || new Error('Refinement failed for unknown reason');
}

/**
 * Generate refined code using AI with full-file rewrite
 */
async function generateRefinedCode(
  currentCode: string,
  refinementPrompt: string,
  attempt: number
): Promise<string> {
  
  const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';
  
  const systemPrompt = buildRefinementSystemPrompt(attempt);
  const userPrompt = buildRefinementUserPrompt(currentCode, refinementPrompt);
  
  const result = await generateCompletion(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    {
      provider,
      model: provider === 'gemini' ? 'gemini-2.0-flash-exp' : 'gpt-4o',
      temperature: attempt === 1 ? 0.7 : 0.5, // Lower temperature on retries
      maxTokens: 4000,
    }
  );
  
  // Extract code from markdown if wrapped
  return extractCodeFromMarkdown(result.content);
}

/**
 * Build system prompt with escalating strictness on retries
 */
function buildRefinementSystemPrompt(attempt: number): string {
  const basePrompt = `You are refining an existing React Email component.

AVAILABLE COMPONENTS (import from '@react-email/components'):
Layout: Html, Head, Body, Container, Section, Row, Column
Typography: Heading, Text  
Interactive: Button (requires href), Link (requires href)
Media: Img (requires src, alt, width)
Visual: Hr

COMPONENT PATTERNS:
<Button href="url" style={{ backgroundColor: '#2563eb', color: '#fff', padding: '14px 28px', borderRadius: '6px' }}>Click Me</Button>
<Img src="url" alt="description" width="600" style={{ width: '100%', height: 'auto' }} />
<Section style={{ padding: '24px 48px', backgroundColor: '#f9fafb' }}>content</Section>
<Heading style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 16px' }}>Title</Heading>
<Text style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 16px' }}>Paragraph</Text>
<Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />

STYLE REQUIREMENTS:
- ALL styles MUST be inline objects: style={{ key: 'value' }}
- NO Tailwind classes, NO className prop
- Use email-safe fonts: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- Max width: 600px for containers
- Colors as hex values: #2563eb not 'blue'

EMAIL CLIENT LIMITATIONS (DO NOT USE):
- NO animations or transitions (animation, transition properties)
- NO flexbox or grid (use tables for layouts)
- NO JavaScript (onClick, onHover, etc)
- NO form elements (input, select, textarea, form)
- NO video players (use image with link to video instead)
- NO complex positioning (position: absolute, fixed)

CRITICAL - FULL FILE REWRITE:
⚠️ Return the COMPLETE updated component from imports to export
⚠️ NO placeholders like "// ... rest of code" or "// existing code"
⚠️ NO partial snippets - write out EVERYTHING
⚠️ Apply ONLY the user's requested change
⚠️ Keep everything else exactly the same

OUTPUT:
- Complete TSX code only
- No markdown blocks
- No explanations`;

  if (attempt === 2) {
    return basePrompt + `

⚠️ ATTEMPT 2 - PREVIOUS FAILED
Common mistakes to avoid:
- Using "// ..." to skip sections (FORBIDDEN)
- Returning partial code (FORBIDDEN)  
- Missing imports or styles (FORBIDDEN)
Write out EVERY line explicitly.`;
  }
  
  if (attempt === 3) {
    return basePrompt + `

🚨 FINAL ATTEMPT - LAST CHANCE
- ZERO placeholders anywhere
- ZERO shortcuts or omissions
- COMPLETE code from start to finish
- If you skip ANY section, you FAIL`;
  }
  
  return basePrompt;
}

/**
 * Build user prompt with current code and requested change
 */
function buildRefinementUserPrompt(
  currentCode: string,
  refinementPrompt: string
): string {
  return `CURRENT COMPONENT CODE:
\`\`\`tsx
${currentCode}
\`\`\`

USER'S REQUESTED CHANGE:
"${refinementPrompt}"

EXAMPLES OF CHANGES:
- "Change the heading text to 'Welcome Back'" → Update <Heading>Welcome Back</Heading>
- "Make button red" → Update button backgroundColor to #dc2626
- "Add padding to section" → Increase padding style value

INSTRUCTIONS:
1. Read and understand the current code above
2. Apply ONLY the user's requested change (be VERY specific about what changes)
3. Keep everything else exactly the same
4. Return the COMPLETE updated component

REMEMBER: 
- Return the FULL FILE from imports to export default
- NO placeholders like "// ... rest of code"
- NO partial code or snippets
- COMPLETE working code only`;
}

