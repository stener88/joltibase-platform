/**
 * OpenAI Client Wrapper
 * Handles API calls with error handling, retry logic, and cost tracking
 */

import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { AIGenerationError } from './types';

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

/**
 * Pricing per 1M tokens (as of Nov 2025)
 */
const PRICING = {
  'gpt-4o': {
    input: 0.0025, // $2.50 per 1M tokens
    output: 0.01,  // $10 per 1M tokens
  },
  'gpt-4-turbo-preview': {
    input: 0.01, // $10 per 1M tokens
    output: 0.03, // $30 per 1M tokens
  },
  'gpt-4': {
    input: 0.03,
    output: 0.06,
  },
} as const;

/**
 * Calculate cost based on token usage
 */
export function calculateCost(
  model: keyof typeof PRICING,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = PRICING[model];
  const inputCost = (promptTokens / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

/**
 * Generate completion with OpenAI
 */
export async function generateCompletion(
  messages: ChatCompletionMessageParam[],
  options: {
    model?: 'gpt-4o' | 'gpt-4-turbo-preview' | 'gpt-4';
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
    retries?: number;
  } = {}
) {
  const {
    model = 'gpt-4o',
    temperature = 0.7,
    maxTokens = 2000,
    jsonMode = true,
    retries = 3,
  } = options;

  let lastError: Error | null = null;
  const startTime = Date.now();

  // Retry logic
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const completion = await getClient().chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: jsonMode ? { type: 'json_object' } : undefined,
      });

      const generationTimeMs = Date.now() - startTime;
      const usage = completion.usage;

      if (!usage) {
        throw new AIGenerationError(
          'No usage data returned from OpenAI',
          'INVALID_RESPONSE',
          false
        );
      }

      const costUsd = calculateCost(
        model,
        usage.prompt_tokens,
        usage.completion_tokens
      );

      return {
        content: completion.choices[0].message.content || '',
        tokensUsed: usage.total_tokens,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        costUsd,
        generationTimeMs,
        model,
      };
    } catch (error: any) {
      lastError = error;

      // Check error type and determine if retryable
      if (error.code === 'invalid_api_key') {
        throw new AIGenerationError(
          'Invalid OpenAI API key',
          'INVALID_API_KEY',
          false
        );
      }

      if (error.code === 'insufficient_quota') {
        throw new AIGenerationError(
          'Insufficient OpenAI quota. Please add credits.',
          'INSUFFICIENT_QUOTA',
          false
        );
      }

      if (error.code === 'rate_limit_exceeded') {
        // Rate limit is retryable with backoff
        if (attempt < retries) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000);
          console.log(`Rate limited. Retrying in ${backoffMs}ms... (attempt ${attempt}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        throw new AIGenerationError(
          'OpenAI rate limit exceeded. Please try again later.',
          'RATE_LIMIT',
          true
        );
      }

      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        if (attempt < retries) {
          const backoffMs = 2000 * attempt;
          console.log(`Network error. Retrying in ${backoffMs}ms... (attempt ${attempt}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        throw new AIGenerationError(
          'Network error connecting to OpenAI. Please check your connection.',
          'NETWORK_ERROR',
          true
        );
      }

      // Unknown error - retry if attempts remain
      if (attempt < retries) {
        const backoffMs = 1000 * attempt;
        console.log(`Unknown error. Retrying in ${backoffMs}ms... (attempt ${attempt}/${retries})`);
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
 * Test OpenAI connection
 */
export async function testConnection(): Promise<boolean> {
  try {
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
        maxTokens: 50,
        retries: 1,
      }
    );

    const parsed = JSON.parse(result.content);
    return parsed.status === 'ok';
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return false;
  }
}

/**
 * Validate JSON response from OpenAI
 */
export function parseAndValidateJSON<T>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new AIGenerationError(
      'Failed to parse JSON response from AI',
      'INVALID_RESPONSE',
      false
    );
  }
}