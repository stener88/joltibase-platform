/**
 * Unified AI Client
 * 
 * Provides a consistent interface for AI operations across different providers.
 * Currently supports Gemini with native structured output.
 */

import { z } from 'zod';
import { generateObjectWithGemini, type GenerateObjectOptions } from './providers/gemini-client';
import { generateTextWithGemini, type GenerateTextOptions } from './providers/gemini-client';

/**
 * Supported AI providers
 */
export type AIProvider = 'gemini' | 'openai';

/**
 * Global max tokens limit
 */
export const MAX_TOKENS_GLOBAL = 4000;

/**
 * Options for text completion
 */
export interface GenerateCompletionOptions {
  /** Messages array */
  messages: Array<{ role: 'user' | 'system' | 'assistant'; content: string }>;
  /** Provider to use */
  provider?: AIProvider;
  /** Model name (defaults based on provider) */
  model?: string;
  /** Temperature (0-1) */
  temperature?: number;
  /** Max tokens */
  maxTokens?: number;
  /** Zod schema for structured output (optional) */
  zodSchema?: z.ZodType<any, any, any>;
}

/**
 * Result from text completion
 */
export interface GenerateCompletionResult {
  /** Generated content */
  content: string;
  /** Provider used */
  provider: AIProvider;
  /** Token usage */
  tokensUsed: number;
  /** Cost in USD (estimated) */
  costUsd?: number;
}

/**
 * Options for structured object generation
 */
export interface GenerateStructuredObjectOptions {
  /** Model name */
  model: string;
  /** Zod schema */
  schema: z.ZodType<any, any, any>;
  /** User prompt */
  prompt: string;
  /** System prompt (optional) */
  system?: string;
  /** Temperature (0-1, default: 0.5) */
  temperature?: number;
  /** Max output tokens */
  maxOutputTokens?: number;
}

/**
 * Result from structured object generation
 */
export interface GenerateStructuredObjectResult {
  /** Parsed object matching schema */
  object: any;
  /** Token usage */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Generate text completion
 * 
 * Supports both plain text and structured output (if zodSchema provided)
 */
export async function generateCompletion(
  messages: Array<{ role: 'user' | 'system' | 'assistant'; content: string }>,
  options: {
    provider?: AIProvider;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    zodSchema?: z.ZodType<any, any, any>;
  } = {}
): Promise<GenerateCompletionResult> {
  const {
    provider = 'gemini',
    model,
    temperature = 0.7,
    maxTokens = 1000,
    zodSchema,
  } = options;

  // If zodSchema is provided, use structured output
  if (zodSchema) {
    // Combine system and user messages
    const systemMessages = messages.filter(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role === 'user');
    const systemPrompt = systemMessages.map(m => m.content).join('\n\n');
    const userPrompt = userMessages.map(m => m.content).join('\n\n');

    const modelName = model || (provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o');
    
    const result = await generateStructuredObject({
      model: modelName,
      schema: zodSchema,
      prompt: userPrompt,
      system: systemPrompt || undefined,
      temperature,
      maxOutputTokens: maxTokens,
    });

    // Parse the object back to JSON string for compatibility
    const content = JSON.stringify(result.object);

    return {
      content,
      provider,
      tokensUsed: result.usage.totalTokens,
      costUsd: calculateCost(provider, modelName, result.usage),
    };
  }

  // Plain text completion
  if (provider === 'gemini') {
    const modelName = model || 'gemini-2.5-flash';
    const result = await generateTextWithGemini({
      model: modelName,
      messages,
      temperature,
      maxTokens,
    });

    return {
      content: result.content,
      provider: 'gemini',
      tokensUsed: result.usage.totalTokens,
      costUsd: calculateCost('gemini', modelName, result.usage),
    };
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

/**
 * Generate structured object with Zod schema validation
 */
export async function generateStructuredObject(
  options: GenerateStructuredObjectOptions
): Promise<GenerateStructuredObjectResult> {
  const {
    model,
    schema,
    prompt,
    system,
    temperature = 0.5,
    maxOutputTokens = 2000,
  } = options;

  // Currently only Gemini is supported for structured output
  // (OpenAI support can be added later if needed)
  const result = await generateObjectWithGemini({
    model,
    schema,
    prompt,
    system,
    temperature,
    maxOutputTokens,
  });

  return {
    object: result.object,
    usage: result.usage,
  };
}

/**
 * Calculate estimated cost in USD
 */
function calculateCost(
  provider: AIProvider,
  model: string,
  usage: { promptTokens: number; completionTokens: number }
): number {
  if (provider === 'gemini') {
    // Gemini 2.5 Flash Lite pricing: $0.10/$0.40 per 1M tokens (input/output)
    // Check for flash-lite FIRST (more specific) before checking flash
    if (model.includes('2.5-flash-lite') || model.includes('flash-lite')) {
      const inputCost = (usage.promptTokens / 1_000_000) * 0.10;
      const outputCost = (usage.completionTokens / 1_000_000) * 0.40;
      return inputCost + outputCost;
    }
    // Gemini 2.5 Flash pricing: $0.30/$2.50 per 1M tokens (input/output)
    if (model.includes('2.5-flash')) {
      const inputCost = (usage.promptTokens / 1_000_000) * 0.30;
      const outputCost = (usage.completionTokens / 1_000_000) * 2.50;
      return inputCost + outputCost;
    }
    // Gemini 2.0 Flash: Free tier
    if (model.includes('2.0-flash')) {
      return 0;
    }
    // Gemini 1.5 Flash: $0.075/$0.30 per 1M tokens
    if (model.includes('1.5-flash')) {
      const inputCost = (usage.promptTokens / 1_000_000) * 0.075;
      const outputCost = (usage.completionTokens / 1_000_000) * 0.30;
      return inputCost + outputCost;
    }
    // Gemini 1.5 Pro: $1.25/$5.00 per 1M tokens
    if (model.includes('1.5-pro')) {
      const inputCost = (usage.promptTokens / 1_000_000) * 1.25;
      const outputCost = (usage.completionTokens / 1_000_000) * 5.00;
      return inputCost + outputCost;
    }
  }

  // Default: return 0 if pricing unknown
  return 0;
}


