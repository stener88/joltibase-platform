/**
 * AI Email Generator (Legacy)
 * 
 * DEPRECATED: Direct component generation has been replaced with semantic blocks.
 * Use generator-v2.ts for new email generation.
 * 
 * This file only contains refineComponent which is still in use.
 */

import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { EmailComponent, GlobalEmailSettings } from '../types';
import { 
  componentRefinementJsonSchema,
} from './schemas';
import { 
  buildEnhancedRefinementPrompt,
} from './prompts-v2';
import { MAX_TOKENS_GLOBAL } from '@/lib/ai/client';

// Initialize Google AI with API key
const getGoogleModel = (model: string) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
  }
  
  const google = createGoogleGenerativeAI({ apiKey });
  return google(model);
};

/**
 * Generation options
 */
export interface GenerationOptions {
  /** Temperature for AI generation (0-1) */
  temperature?: number;
  
  /** Maximum tokens to generate */
  maxTokens?: number;
  
  /** Model to use */
  model?: string;
}

/**
 * Generation result with metadata
 */
export interface GenerationResult {
  /** Generated email component tree */
  email: EmailComponent;
  
  /** Generation metadata */
  metadata: {
    model: string;
    tokens: number;
    timeMs: number;
  };
}

/**
 * DEPRECATED: Old V1 generation removed - use generator-v2.ts instead
 * 
 * This file now only contains the refineComponent function which is still used.
 * For email generation, use generateEmailSemantic from generator-v2.ts
 */

/**
 * Refine a single component using AI
 * 
 * @param component - Current component state
 * @param prompt - User's refinement request
 * @param options - Generation options
 * @returns Partial component with changes
 */
export async function refineComponent(
  component: EmailComponent,
  prompt: string,
  options: GenerationOptions = {}
): Promise<Partial<EmailComponent>> {
  const startTime = Date.now();
  
  const {
    temperature = 0.7,
    maxTokens = Math.min(800, MAX_TOKENS_GLOBAL),
    model = 'gemini-2.5-flash',
  } = options;
  
  console.log('🤖 [AI-REFINER] Refining component');
  console.log('📝 [AI-REFINER] Component:', component.component);
  console.log('📝 [AI-REFINER] Prompt:', prompt);
  
  try {
    const { object, usage } = await generateObject({
      model: getGoogleModel(model),
      schema: componentRefinementJsonSchema,
      prompt: buildEnhancedRefinementPrompt(
        component.component,
        component.props,
        component.content,
        prompt
      ),
      temperature,
    });
    
    const timeMs = Date.now() - startTime;
    
    console.log('✅ [AI-REFINER] Component refined');
    console.log(`📊 [AI-REFINER] Tokens: ${usage?.totalTokens || 'unknown'}`);
    console.log(`⏱️  [AI-REFINER] Time: ${timeMs}ms`);
    console.log(`📝 [AI-REFINER] Changes:`, JSON.stringify(object));
    
    return object;
    
  } catch (error) {
    console.error('❌ [AI-REFINER] Refinement failed:', error);
    throw new Error(`AI refinement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Test the AI generator with a simple prompt
 * 
 * @deprecated Use testSemanticGenerator from generator-v2.ts instead
 */
export async function testGenerator(): Promise<void> {
  console.warn('⚠️  testGenerator is deprecated - use testSemanticGenerator from generator-v2.ts');
  
  // This function is kept for backwards compatibility but does nothing
  // The actual test is in generator-v2.ts
}

