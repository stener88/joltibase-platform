/**
 * AI-Powered Image Keyword Extraction
 * 
 * Uses Gemini to extract optimal 1-2 word Unsplash search keywords
 * from email prompts. Runs in parallel with email generation (zero added latency).
 */

import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import type { DesignSystem } from '@/emails/lib/design-system-selector';
import { AI_MODEL_FAST, AI_PROVIDER, KEYWORDS_TEMPERATURE, AI_KEYWORDS_TIMEOUT_MS } from '@/lib/ai/config';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const aiProvider = AI_PROVIDER === 'anthropic' ? anthropic : google;

/**
 * Schema for AI-generated keywords
 * Strict 1-2 word limit enforced via description
 */
const KeywordsSchema = z.object({
  hero: z.string().describe('1-2 words ONLY: main visual keyword for hero image'),
  feature: z.string().describe('1-2 words ONLY: supporting visual keyword'),
  accent: z.string().describe('1-2 words ONLY: abstract/background keyword'),
});

export type ImageKeywords = z.infer<typeof KeywordsSchema>;

/**
 * Enforce 1-2 word limit by truncating verbose output
 */
function enforceWordLimit(keyword: string, maxWords: number = 2): string {
  const words = keyword.trim().split(/\s+/);
  if (words.length <= maxWords) return keyword.trim();
  return words.slice(0, maxWords).join(' ');
}

/**
 * Extract image keywords using AI
 * Optimized for speed: small prompt, structured output, low temperature
 * 
 * @param prompt - User's email generation prompt
 * @param designSystem - Detected design system for context
 * @returns 3 keywords (hero, feature, accent) or null on failure
 */
export async function extractKeywordsWithAI(
  prompt: string,
  designSystem: DesignSystem
): Promise<ImageKeywords | null> {
  try {
    const result = await generateObject({
      model: aiProvider(AI_MODEL_FAST),
      schema: KeywordsSchema,
      prompt: `Extract 3 Unsplash search keywords for this email.

Email prompt: "${prompt}"
Design style: ${designSystem.name}

RULES (CRITICAL):
- Each keyword: 1-2 words MAXIMUM
- Use concrete, visual nouns that photograph well
- NO abstract concepts ("innovation" → "technology")
- NO possessives ("company's" → "office")
- NO long phrases

GOOD examples: "office", "teamwork", "laptop", "sunset", "coffee"
BAD examples: "digital transformation journey", "company's vision for 2025"

Return exactly 3 keywords:
- hero: Main visual (1-2 words)
- feature: Supporting visual (1-2 words)  
- accent: Background/detail (1-2 words)`,
      temperature: KEYWORDS_TEMPERATURE,
    });
    
    // Enforce word limit (AI sometimes ignores instructions)
    const keywords: ImageKeywords = {
      hero: enforceWordLimit(result.object.hero),
      feature: enforceWordLimit(result.object.feature),
      accent: enforceWordLimit(result.object.accent),
    };return keywords;
    
  } catch (error) {return null;
  }
}

/**
 * Extract keywords with timeout
 * Returns null if AI takes longer than timeout (fallback will be used)
 */
export async function extractKeywordsWithTimeout(
  prompt: string,
  designSystem: DesignSystem,
  timeoutMs: number = AI_KEYWORDS_TIMEOUT_MS
): Promise<ImageKeywords | null> {
  const startTime = Date.now();
  
  const aiPromise = extractKeywordsWithAI(prompt, designSystem)
    .then(result => {
      const duration = Date.now() - startTime;return result;
    });
    
  const timeoutPromise = new Promise<null>(resolve => 
    setTimeout(() => {resolve(null);
    }, timeoutMs)
  );
  
  return Promise.race([aiPromise, timeoutPromise]);
}

