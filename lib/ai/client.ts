/**
 * Multi-Provider AI Client
 * 
 * Unified interface supporting:
 * - Gemini 2.5 Flash (primary) - 33x cheaper, 2-4x faster
 * - OpenAI GPT-4o (fallback) - for compatibility
 * 
 * Handles API calls with error handling, retry logic, and cost tracking
 */

import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { z } from 'zod';
import { AIGenerationError } from './types';
import { 
  generateGeminiCompletion, 
  type GeminiMessage,
  type GeminiModel,
  calculateGeminiCost 
} from './providers/gemini-client';

// ============================================================================
// Provider Types
// ============================================================================

export type AIProvider = 'gemini' | 'openai';

export interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  jsonSchema?: Record<string, any>; // For OpenAI Structured Outputs
  zodSchema?: z.ZodType<any>; // For Gemini native Zod support
  retries?: number;
  provider?: AIProvider;
}

export interface GenerationResult {
  content: string;
  tokensUsed: number;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  generationTimeMs: number;
  model: string;
  provider: AIProvider;
}

// ============================================================================
// OpenAI Client (Legacy/Fallback)
// ============================================================================

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new AIGenerationError(
        'OPENAI_API_KEY environment variable is not set',
        'INVALID_API_KEY',
        false
      );
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * OpenAI Pricing per 1M tokens
 */
const OPENAI_PRICING = {
  'gpt-4o': {
    input: 2.50,
    output: 10.00,
  },
  'gpt-4-turbo-preview': {
    input: 10.00,
    output: 30.00,
  },
  'gpt-4': {
    input: 30.00,
    output: 60.00,
  },
} as const;

type OpenAIModel = keyof typeof OPENAI_PRICING;

function calculateOpenAICost(
  model: OpenAIModel,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = OPENAI_PRICING[model];
  const inputCost = (promptTokens / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

/**
 * Generate completion with OpenAI (fallback provider)
 */
async function generateOpenAICompletion(
  messages: ChatCompletionMessageParam[],
  options: GenerationOptions
): Promise<GenerationResult> {
  const {
    model = 'gpt-4o',
    temperature = 0.7,
    maxTokens = 2000,
    jsonMode = true,
    jsonSchema,
    retries = 3,
  } = options;

  let lastError: Error | null = null;
  const startTime = Date.now();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const responseFormat = jsonSchema
        ? {
            type: 'json_schema' as const,
            json_schema: {
              name: 'campaign_response',
              description: 'Generated email campaign with blocks structure',
              schema: jsonSchema,
              strict: true,
            },
          }
        : jsonMode
        ? { type: 'json_object' as const }
        : undefined;

      const completion = await getOpenAIClient().chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: responseFormat,
      });

      const usage = completion.usage;
      if (!usage) {
        throw new AIGenerationError(
          'No usage data returned from OpenAI',
          'INVALID_RESPONSE',
          false
        );
      }

      const generationTimeMs = Date.now() - startTime;
      const costUsd = calculateOpenAICost(
        model as OpenAIModel,
        usage.prompt_tokens,
        usage.completion_tokens
      );

      console.log('✅ [OPENAI] Generation successful:', {
        model,
        tokens: usage.total_tokens,
        cost: `$${costUsd.toFixed(4)}`,
        time: `${generationTimeMs}ms`,
      });

      return {
        content: completion.choices[0].message.content || '',
        tokensUsed: usage.total_tokens,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        costUsd,
        generationTimeMs,
        model,
        provider: 'openai',
      };
    } catch (error: any) {
      lastError = error;

      if (error.code === 'invalid_api_key') {
        throw new AIGenerationError(
          'Invalid OpenAI API key',
          'INVALID_API_KEY',
          false
        );
      }

      if (error.code === 'insufficient_quota') {
        throw new AIGenerationError(
          'Insufficient OpenAI quota',
          'INSUFFICIENT_QUOTA',
          false
        );
      }

      if (error.code === 'rate_limit_exceeded') {
        if (attempt < retries) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000);
          console.log(`⏳ [OPENAI] Rate limited. Retrying in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        throw new AIGenerationError(
          'OpenAI rate limit exceeded',
          'RATE_LIMIT',
          true
        );
      }

      if (attempt < retries) {
        const backoffMs = 1000 * attempt;
        console.log(`⏳ [OPENAI] Retrying in ${backoffMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }
    }
  }

  throw new AIGenerationError(
    lastError?.message || 'Failed to generate completion',
    'UNKNOWN',
    true
  );
}

// ============================================================================
// Unified Multi-Provider Interface
// ============================================================================

/**
 * Get the default provider based on environment configuration
 */
function getDefaultProvider(): AIProvider {
  const envProvider = process.env.AI_PROVIDER?.toLowerCase();
  
  if (envProvider === 'openai') {
    return 'openai';
  }
  
  // Default to Gemini (33x cheaper!)
  return 'gemini';
}

/**
 * Convert OpenAI messages to provider-agnostic format
 */
function normalizeMessages(messages: ChatCompletionMessageParam[]): GeminiMessage[] {
  return messages.map(msg => ({
    role: msg.role as 'system' | 'user' | 'assistant',
    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
  }));
}

/**
 * Generate completion with automatic provider selection and fallback
 * 
 * Primary: Gemini 2.5 Flash (33x cheaper, 2-4x faster)
 * Fallback: OpenAI GPT-4o (if Gemini fails)
 */
export async function generateCompletion(
  messages: ChatCompletionMessageParam[],
  options: GenerationOptions = {}
): Promise<GenerationResult> {
  const provider = options.provider || getDefaultProvider();
  const normalizedMessages = normalizeMessages(messages);

  console.log(`🤖 [AI-CLIENT] Using provider: ${provider.toUpperCase()}`);

  try {
    if (provider === 'gemini') {
      // Use Gemini with prompt-based generation (Zod validates after)
      const geminiResult = await generateGeminiCompletion(normalizedMessages, {
        model: (options.model as GeminiModel) || 'gemini-2.5-flash',
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        zodSchema: options.zodSchema,
        retries: options.retries,
      });

      return {
        ...geminiResult,
        provider: 'gemini',
      };
    } else {
      // Use OpenAI as fallback
      return await generateOpenAICompletion(messages, options);
    }
  } catch (error: any) {
    // If primary provider fails and it's retryable, try fallback
    if (provider === 'gemini' && error.retryable) {
      console.log('⚠️  [AI-CLIENT] Gemini failed, falling back to OpenAI...');
      
      try {
        return await generateOpenAICompletion(messages, {
          ...options,
          model: 'gpt-4o',
        });
      } catch (fallbackError: any) {
        console.error('❌ [AI-CLIENT] Fallback to OpenAI also failed');
        throw fallbackError;
      }
    }
    
    throw error;
  }
}

/**
 * Test connection for a specific provider
 */
export async function testConnection(provider?: AIProvider): Promise<boolean> {
  const testProvider = provider || getDefaultProvider();
  
  try {
    const TestSchema = z.object({
      status: z.literal('ok'),
    });

    const result = await generateCompletion(
      [
        {
          role: 'system',
          content: 'You are a test assistant. Respond with valid JSON.',
        },
        {
          role: 'user',
          content: 'Respond with {"status": "ok"}',
        },
      ],
      {
        provider: testProvider,
        maxTokens: 50,
        retries: 1,
        zodSchema: TestSchema,
      }
    );

    const parsed = JSON.parse(result.content);
    return parsed.status === 'ok';
  } catch (error) {
    console.error(`❌ [AI-CLIENT] ${testProvider.toUpperCase()} connection test failed:`, error);
    return false;
  }
}

/**
 * Get provider cost comparison
 */
export function getProviderCostComparison(
  promptTokens: number,
  completionTokens: number
): Record<string, number> {
  return {
    gemini: calculateGeminiCost('gemini-1.5-flash', promptTokens, completionTokens),
    openai: calculateOpenAICost('gpt-4o', promptTokens, completionTokens),
  };
}

// Legacy exports for backward compatibility
export { calculateOpenAICost as calculateCost };
export type { ChatCompletionMessageParam };
