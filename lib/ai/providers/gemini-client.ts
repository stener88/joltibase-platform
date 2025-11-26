/**
 * Native Gemini Client
 * 
 * Uses Google's native @google/generative-ai SDK with proper responseSchema support
 * This bypasses Vercel AI SDK's broken schema enforcement and uses Gemini's native structured output
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { zodToGoogleAISchema } from './zod-to-gemini-schema';

/**
 * Sanitize generated content to fix common Gemini issues
 * - Null values for optional fields
 * - Invalid enum values
 */
function sanitizeGeneratedContent(obj: any, schema: z.ZodType<any, any, any>): any {
  // Handle null at the top
  if (obj === null || obj === undefined) {
    return undefined;
  }
  
  // Handle arrays - recursively sanitize each item
  if (Array.isArray(obj)) {
    return obj
      .map(item => sanitizeGeneratedContent(item, schema))
      .filter(item => item !== undefined && item !== null);
  }
  
  // Handle objects - recursively sanitize values
  if (typeof obj === 'object') {
    const result: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Recursively sanitize the value FIRST
      const sanitizedValue = sanitizeGeneratedContent(value, schema);
      
      // Skip null/undefined values - let Zod use defaults or mark as optional
      if (sanitizedValue === null || sanitizedValue === undefined) {
        continue;
      }
      
      // Fix invalid icons after sanitization
      if (key === 'icon' && typeof sanitizedValue === 'string') {
        const validIcons = ['check', 'star', 'heart', 'lightning', 'shield', 'lock', 'clock', 'globe'];
        if (!validIcons.includes(sanitizedValue)) {
          // Map common invalid icons to valid ones
          const iconMap: Record<string, string> = {
            'moon': 'star',
            'sun': 'star',
            'eye': 'shield',
            'dark': 'shield',
            'light': 'lightning',
            'checkmark': 'check',
            'tick': 'check',
            'security': 'shield',
            'speed': 'lightning',
            'fast': 'lightning',
            'time': 'clock',
            'world': 'globe',
            'global': 'globe',
            'love': 'heart',
            'favorite': 'star',
            'featured': 'star',
            'safe': 'shield',
            'protected': 'lock',
          };
          
          result[key] = iconMap[sanitizedValue.toLowerCase()] || 'check';
        } else {
          result[key] = sanitizedValue;
        }
      } else {
        result[key] = sanitizedValue;
      }
    }
    
    return result;
  }
  
  // Primitive values - return as-is
  return obj;
}

/**
 * Recursively enforce string length constraints from Zod schema
 * Gemini's native schema doesn't enforce maxLength, so we do it post-processing
 */
function enforceStringLengthConstraints(obj: any, schema: z.ZodType<any, any, any>): any {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const result: any = { ...obj };
    
    for (const [key, zodValue] of Object.entries(shape)) {
      if (key in result) {
        result[key] = enforceStringLengthConstraints(result[key], zodValue as z.ZodType<any>);
      }
    }
    
    return result;
  }
  
  if (schema instanceof z.ZodArray) {
    return obj.map((item: any) => enforceStringLengthConstraints(item, schema.element as z.ZodType<any>));
  }
  
  if (schema instanceof z.ZodString) {
    const checks = (schema as any)._def?.checks || [];
    // Zod v4 structure: check._zod.def.maximum and check._zod.def.check === 'max_length'
    const maxCheck = checks.find((c: any) => c._zod?.def?.check === 'max_length');
    const maxValue = maxCheck?._zod?.def?.maximum;
    
    if (maxValue && typeof maxValue === 'number' && typeof obj === 'string') {
      if (obj.length > maxValue) {
        // Truncate to max length
        return obj.substring(0, maxValue);
      }
    }
    
    return obj;
  }
  
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    if (obj === null || obj === undefined) {
      return obj;
    }
    return enforceStringLengthConstraints(obj, schema.unwrap() as z.ZodType<any>);
  }
  
  if (schema instanceof z.ZodDefault) {
    return enforceStringLengthConstraints(obj, schema.removeDefault() as z.ZodType<any>);
  }
  
  return obj;
}

/**
 * Options for generating structured objects with Gemini
 */
export interface GenerateObjectOptions {
  /** Model name (e.g., 'gemini-2.5-flash') */
  model: string;
  /** Zod schema for structured output */
  schema: z.ZodType<any, any, any>;
  /** User prompt */
  prompt: string;
  /** System prompt (optional) */
  system?: string;
  /** Temperature (0-1, default: 0.5) */
  temperature?: number;
  /** Max output tokens */
  maxOutputTokens?: number;
  /** API key (optional, falls back to env var) */
  apiKey?: string;
}

/**
 * Result from structured object generation
 */
export interface GenerateObjectResult {
  /** Parsed object matching the schema */
  object: any;
  /** Token usage information */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Generate a structured object using Gemini's native responseSchema
 * 
 * This uses Gemini's built-in structured output feature which properly
 * enforces schema constraints (unlike Vercel AI SDK's broken implementation)
 */
export async function generateObjectWithGemini(
  options: GenerateObjectOptions
): Promise<GenerateObjectResult> {
  const {
    model,
    schema,
    prompt,
    system,
    temperature = 0.5,
    maxOutputTokens = 2000,
    apiKey,
  } = options;

  // Get API key from options or environment
  const geminiApiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
  }

  // Initialize Gemini client
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  
  // Get the model instance
  const geminiModel = genAI.getGenerativeModel({
    model,
  });

  // Convert Zod schema to Gemini's schema format
  const responseSchema = zodToGoogleAISchema(schema);

  // Build the full prompt (system + user)
  const fullPrompt = system ? `${system}\n\n${prompt}` : prompt;

  // Generate with structured output
  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      responseSchema,
      responseMimeType: 'application/json',
    },
  });

  const response = result.response;
  
  // Check for MAX_TOKENS finish reason before trying to extract text
  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason === 'MAX_TOKENS') {
    throw new Error(
      `Gemini response exceeded token limit (maxOutputTokens: ${maxOutputTokens}). ` +
      `Consider increasing maxTokens or reducing context size.`
    );
  }
  
  // Extract text content (should be JSON)
  // Try multiple methods to get the response text
  let text = response.text();
  
  if (!text) {
    // Fallback: try to get text from candidates
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const candidate = candidates[0];
      if (candidate.content && candidate.content.parts) {
        text = candidate.content.parts
          .map((part: any) => part.text || '')
          .join('');
      }
    }
  }
  
  if (!text) {
    throw new Error(`No response text from Gemini. Response: ${JSON.stringify({
      candidates: response.candidates?.length || 0,
      finishReason,
    })}`);
  }

  // Clean up common Gemini JSON response issues
  // Remove preamble text like "Here is the JSON requested:" or markdown code blocks
  text = text.trim();
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  
  // Remove common preamble patterns
  const preamblePatterns = [
    /^Here is the JSON requested:\s*/i,
    /^Here's the JSON:\s*/i,
    /^JSON response:\s*/i,
  ];
  
  for (const pattern of preamblePatterns) {
    text = text.replace(pattern, '');
  }
  
  text = text.trim();

  // Parse JSON response
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    // If JSON parsing fails, try to extract and fix incomplete JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      let jsonStr = jsonMatch[0];
      
      // Try to fix common incomplete JSON issues
      // If the string is cut off mid-value, try to close it
      if (jsonStr.includes('"description":') && !jsonStr.match(/"description"\s*:\s*"[^"]*"/)) {
        // String value is incomplete - try to extract and truncate it
        const descMatch = jsonStr.match(/"description"\s*:\s*"([^"]*)/);
        if (descMatch) {
          // Extract the incomplete description and close the JSON properly
          const incompleteDesc = descMatch[1];
          // Truncate to a reasonable length and close the JSON
          jsonStr = `{"description":"${incompleteDesc.substring(0, 200)}"}`;
        }
      }
      
      try {
        parsed = JSON.parse(jsonStr);
      } catch (e) {
        // Last resort: if we can't parse, create a minimal valid object
        // This will be caught by Zod validation anyway
        parsed = {};
      }
    } else {
      throw new Error(`Failed to parse JSON response from Gemini: ${error instanceof Error ? error.message : 'Unknown error'}\nResponse: ${text.substring(0, 300)}`);
    }
  }

  // Post-process to fix common Gemini issues
  // 1. Sanitize null values and invalid enums
  parsed = sanitizeGeneratedContent(parsed, schema);
  
  // 2. Enforce maxLength constraints BEFORE validation
  parsed = enforceStringLengthConstraints(parsed, schema);

  // Validate against Zod schema (after sanitization and truncation)
  const validated = schema.parse(parsed);

  // Extract usage information
  const usageMetadata = response.usageMetadata;
  const promptTokens = usageMetadata?.promptTokenCount || 0;
  const completionTokens = usageMetadata?.candidatesTokenCount || 0;
  const totalTokens = usageMetadata?.totalTokenCount || promptTokens + completionTokens;

  return {
    object: validated,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens,
    },
  };
}

/**
 * Generate text completion (non-structured)
 */
export interface GenerateTextOptions {
  /** Model name */
  model: string;
  /** Messages array with role and content */
  messages: Array<{ role: 'user' | 'system' | 'assistant'; content: string }>;
  /** Temperature (0-1, default: 0.7) */
  temperature?: number;
  /** Max output tokens */
  maxTokens?: number;
  /** API key (optional) */
  apiKey?: string;
}

/**
 * Text completion result
 */
export interface GenerateTextResult {
  /** Generated text content */
  content: string;
  /** Token usage */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Generate text completion with Gemini
 */
export async function generateTextWithGemini(
  options: GenerateTextOptions
): Promise<GenerateTextResult> {
  const {
    model,
    messages,
    temperature = 0.7,
    maxTokens = 1000,
    apiKey,
  } = options;

  // Get API key
  const geminiApiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
  }

  // Initialize Gemini client
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const geminiModel = genAI.getGenerativeModel({ model });

  // Convert messages to Gemini format
  // Gemini doesn't support system messages directly, so we prepend them to the first user message
  const parts: Array<{ text: string }> = [];
  
  for (const msg of messages) {
    if (msg.role === 'system') {
      // Prepend system message to the first user message
      if (parts.length === 0) {
        parts.push({ text: `${msg.content}\n\n` });
      } else {
        // If we already have content, prepend system to it
        parts[0].text = `${msg.content}\n\n${parts[0].text}`;
      }
    } else if (msg.role === 'user') {
      parts.push({ text: msg.content });
    } else if (msg.role === 'assistant') {
      // Gemini doesn't support assistant messages in the same way
      // We'll just include them as context in the user message
      if (parts.length > 0) {
        parts[parts.length - 1].text += `\n\nAssistant: ${msg.content}`;
      }
    }
  }

  // Generate content
  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  });

  const response = result.response;

  // Check for blocking or safety issues
  const candidate = response.candidates?.[0];
  if (!candidate) {
    throw new Error('No candidates in Gemini response');
  }

  if (candidate.finishReason && candidate.finishReason !== 'STOP') {
    console.error('[Gemini] Generation blocked:', {
      finishReason: candidate.finishReason,
      safetyRatings: candidate.safetyRatings,
    });
    throw new Error(`Gemini blocked response: ${candidate.finishReason}`);
  }

  const text = response.text();

  if (!text) {
    console.error('[Gemini] Empty response despite STOP finish reason:', {
      candidate,
      usageMetadata: response.usageMetadata,
    });
    throw new Error('No response text from Gemini');
  }

  // Extract usage information
  const usageMetadata = response.usageMetadata;
  const promptTokens = usageMetadata?.promptTokenCount || 0;
  const completionTokens = usageMetadata?.candidatesTokenCount || 0;
  const totalTokens = usageMetadata?.totalTokenCount || promptTokens + completionTokens;

  return {
    content: text,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens,
    },
  };
}

