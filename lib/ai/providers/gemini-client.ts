/**
 * Google Gemini 2.5 Flash Client
 * 
 * Prompt-based generation with Zod validation for complex schemas
 * 33x cheaper and 2-4x faster than OpenAI GPT-4o
 * 
 * Pricing (gemini-2.5-flash): $0.075 per 1M input tokens, $0.30 per 1M output tokens
 */

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { z } from 'zod';
import { zodToGoogleAISchema } from './zod-to-gemini-schema';
import { AIGenerationError } from '../types';

// Lazy initialization of Gemini client
let geminiClient: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AIGenerationError(
        'GEMINI_API_KEY environment variable is not set',
        'INVALID_API_KEY',
        false
      );
    }
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

/**
 * Pricing per 1M tokens (as of Nov 2024)
 * Gemini 2.5 Flash is 33x cheaper than GPT-4o
 */
const PRICING = {
  'gemini-2.5-flash': {
    input: 0.075, // $0.075 per 1M tokens
    output: 0.30,  // $0.30 per 1M tokens
  },
  'gemini-2.0-flash-exp': {
    input: 0, // FREE during preview
    output: 0, // FREE during preview
  },
  'gemini-1.5-flash': {
    input: 0.075, // $0.075 per 1M tokens
    output: 0.30,  // $0.30 per 1M tokens
  },
  'gemini-1.5-pro': {
    input: 1.25,
    output: 5.00,
  },
} as const;

export type GeminiModel = keyof typeof PRICING;

/**
 * Calculate cost based on token usage
 */
export function calculateGeminiCost(
  model: GeminiModel,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = PRICING[model];
  const inputCost = (promptTokens / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

/**
 * Message format compatible with OpenAI
 */
export interface GeminiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Gemini generation options
 */
export interface GeminiGenerationOptions {
  model?: GeminiModel;
  temperature?: number;
  maxTokens?: number;
  zodSchema?: z.ZodType<any>; // Direct Zod schema - no conversion needed!
  retries?: number;
}

/**
 * Gemini generation result
 */
export interface GeminiGenerationResult {
  content: string;
  tokensUsed: number;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  generationTimeMs: number;
  model: GeminiModel;
}

/**
 * Convert OpenAI-style messages to Gemini format
 */
function convertMessagesToGemini(messages: GeminiMessage[]): { systemInstruction?: string; contents: any[] } {
  const systemMessages = messages.filter(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');
  
  // Combine all system messages into one system instruction
  const systemInstruction = systemMessages.length > 0
    ? systemMessages.map(m => m.content).join('\n\n')
    : undefined;
  
  // Convert conversation messages to Gemini format
  const contents = conversationMessages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
  
  return { systemInstruction, contents };
}

/**
 * Generate completion with Gemini using native Zod support
 */
export async function generateGeminiCompletion(
  messages: GeminiMessage[],
  options: GeminiGenerationOptions = {}
): Promise<GeminiGenerationResult> {
  const {
    model = 'gemini-1.5-flash',
    temperature = 0.7,
    maxTokens = 8192,
    zodSchema,
    retries = 3,
  } = options;

  let lastError: Error | null = null;
  const startTime = Date.now();

  // Retry logic
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = getClient();
      const genModel = client.getGenerativeModel({ model });

      // Convert messages to Gemini format
      const { systemInstruction, contents } = convertMessagesToGemini(messages);

      // Build generation config
      const generationConfig: any = {
        temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: 'application/json',
      };

      // Use responseSchema with hybrid approach: strict for structure, flexible for settings/content
      // DISABLED: Gemini API requires non-empty properties for OBJECT types
      // Even with .loose()/.passthrough(), Gemini rejects empty object schemas
      // We validate with Zod after generation instead
      // if (zodSchema) {
      //   const geminiSchema = zodToGoogleAISchema(zodSchema);
      //   generationConfig.responseSchema = geminiSchema;
      //   console.log('✅ [GEMINI] Using responseSchema with passthrough objects for flexibility');
      // }
      console.log('📐 [GEMINI] Using JSON mode with explicit formatting instructions');
      console.log('⚙️ [GEMINI] Config:', { 
        temperature, 
        maxTokens, 
        responseMimeType: 'application/json'
      });

      // Generate content
      const result = await genModel.generateContent({
        systemInstruction: systemInstruction || undefined,
        contents,
        generationConfig,
      });

      const response = result.response;
      
      // Check if response has candidates
      if (!response.candidates || response.candidates.length === 0) {
        console.error('❌ [GEMINI] No candidates in response:', JSON.stringify(response, null, 2));
        throw new Error('Gemini API returned no candidates. Response may have been blocked by safety filters.');
      }
      
      const candidate = response.candidates[0];
      
      // Check for finish reason issues
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.error('❌ [GEMINI] Unexpected finish reason:', candidate.finishReason);
        console.error('📄 [GEMINI] Candidate details:', JSON.stringify(candidate, null, 2));
        
        if (candidate.finishReason === 'SAFETY') {
          throw new Error('Gemini API blocked response due to safety filters.');
        } else if (candidate.finishReason === 'MAX_TOKENS') {
          throw new Error('Gemini API response truncated due to max tokens limit.');
        } else if (candidate.finishReason === 'RECITATION') {
          throw new Error('Gemini API blocked response due to recitation detection.');
        } else {
          throw new Error(`Gemini API stopped with reason: ${candidate.finishReason}`);
        }
      }
      
      // Extract text from candidate parts
      let text = '';
      if (candidate.content?.parts) {
        text = candidate.content.parts
          .filter((part: any) => part.text)
          .map((part: any) => part.text)
          .join('');
      }
      
      // Fallback to response.text() if parts extraction failed
      if (!text) {
        try {
          text = response.text();
        } catch (textError) {
          console.error('❌ [GEMINI] Failed to extract text:', textError);
          console.error('📄 [GEMINI] Full response:', JSON.stringify(response, null, 2));
          throw new Error('Failed to extract text from Gemini response');
        }
      }

      // Post-process JSON to ensure it's valid
      // Gemini sometimes adds markdown code blocks or extra whitespace
      text = text.trim();
      
      if (!text) {
        console.error('❌ [GEMINI] Empty response text after extraction');
        console.error('📄 [GEMINI] Full response:', JSON.stringify(response, null, 2));
        throw new Error('Gemini API returned empty response');
      }
      
      // Remove markdown code blocks if present
      if (text.startsWith('```json')) {
        text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (text.startsWith('```')) {
        text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Trim again after removing code blocks
      text = text.trim();
      
      // Log a preview of what we're returning
      console.log('📄 [GEMINI] Response preview (first 500 chars):', text.substring(0, 500));
      console.log('📄 [GEMINI] Response preview (last 200 chars):', text.substring(text.length - 200));

      // Get token usage
      const usageMetadata = response.usageMetadata;
      const promptTokens = usageMetadata?.promptTokenCount || 0;
      const completionTokens = usageMetadata?.candidatesTokenCount || 0;
      const totalTokens = usageMetadata?.totalTokenCount || promptTokens + completionTokens;

      const generationTimeMs = Date.now() - startTime;
      const costUsd = calculateGeminiCost(model, promptTokens, completionTokens);

      console.log('✅ [GEMINI] Generation successful:', {
        model,
        tokens: totalTokens,
        cost: `$${costUsd.toFixed(6)}`,
        time: `${generationTimeMs}ms`,
      });

      return {
        content: text,
        tokensUsed: totalTokens,
        promptTokens,
        completionTokens,
        costUsd,
        generationTimeMs,
        model,
      };
    } catch (error: any) {
      lastError = error;

      console.error(`❌ [GEMINI] Attempt ${attempt}/${retries} failed:`, error.message);

      // Check error type and determine if retryable
      if (error.message?.includes('API_KEY')) {
        throw new AIGenerationError(
          'Invalid Gemini API key',
          'INVALID_API_KEY',
          false
        );
      }

      if (error.message?.includes('quota') || error.message?.includes('QUOTA')) {
        throw new AIGenerationError(
          'Gemini API quota exceeded. Please check your billing.',
          'INSUFFICIENT_QUOTA',
          true // Make retryable so it falls back to OpenAI
        );
      }

      if (error.message?.includes('rate limit') || error.status === 429) {
        // Rate limit is retryable with backoff
        if (attempt < retries) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000);
          console.log(`⏳ [GEMINI] Rate limited. Retrying in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        throw new AIGenerationError(
          'Gemini API rate limit exceeded. Please try again later.',
          'RATE_LIMIT',
          true
        );
      }

      // Network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        if (attempt < retries) {
          const backoffMs = 2000 * attempt;
          console.log(`⏳ [GEMINI] Network error. Retrying in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        throw new AIGenerationError(
          'Network error connecting to Gemini API.',
          'NETWORK_ERROR',
          true
        );
      }

      // Unknown error - retry if attempts remain
      if (attempt < retries) {
        const backoffMs = 1000 * attempt;
        console.log(`⏳ [GEMINI] Retrying in ${backoffMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }
    }
  }

  // All retries failed
  throw new AIGenerationError(
    lastError?.message || 'Failed to generate completion after multiple retries',
    'UNKNOWN',
    true
  );
}

/**
 * Test Gemini connection
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const TestSchema = z.object({
      status: z.literal('ok'),
      message: z.string(),
    });

    const result = await generateGeminiCompletion(
      [
        {
          role: 'user',
          content: 'Respond with JSON: {"status": "ok", "message": "Connection successful"}',
        },
      ],
      {
        model: 'gemini-1.5-flash',
        maxTokens: 100,
        zodSchema: TestSchema,
        retries: 1,
      }
    );

    const parsed = JSON.parse(result.content);
    return parsed.status === 'ok';
  } catch (error) {
    console.error('❌ [GEMINI] Connection test failed:', error);
    return false;
  }
}

