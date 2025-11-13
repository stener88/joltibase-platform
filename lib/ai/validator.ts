/**
 * AI Campaign Generator - Validation Schemas
 * 
 * Zod schemas for type-safe validation of inputs and AI responses
 * 
 * Phase 4B: Now supports block-based email generation
 */

import { z, toJSONSchema } from 'zod';
import { EmailBlockSchema, GlobalEmailSettingsSchema } from '../email/blocks/schemas';

// ============================================================================
// Input Validation Schemas
// ============================================================================

/**
 * User input for campaign generation
 */
export const GenerateCampaignInputSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt too long'),
  userId: z.string().uuid('Invalid user ID'),
  companyName: z.string().optional(),
  productDescription: z.string().max(500).optional(),
  targetAudience: z.string().max(300).optional(),
  tone: z.enum(['professional', 'friendly', 'casual']).optional().default('friendly'),
  campaignType: z.enum(['one-time', 'sequence']).optional().default('one-time'),
});

export type GenerateCampaignInput = z.infer<typeof GenerateCampaignInputSchema>;

// ============================================================================
// AI Response Validation Schemas
// ============================================================================

/**
 * Content section schema (flexible structure)
 */
const ContentSectionSchema = z.object({
  type: z.enum(['text', 'heading', 'list', 'divider', 'spacer', 'hero', 'feature-grid', 'testimonial', 'stats', 'comparison', 'cta-block']),
  content: z.string().optional(),
  items: z.array(z.string()).optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  features: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  testimonial: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    avatar: z.string().optional(),
  }).optional(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).optional(),
  comparison: z.object({
    before: z.string(),
    after: z.string(),
  }).optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  layout: z.enum(['1-col', '2-col', '3-col', 'centered', 'alternating']).optional(),
});

/**
 * Email structure from AI (legacy section-based format)
 */
const GeneratedEmailSchema = z.object({
  subject: z.string().min(1).max(100),
  previewText: z.string().min(1).max(150),
  sections: z.array(ContentSectionSchema).min(1),
  layoutSuggestion: z.enum(['default', 'centered', 'story-flow']).optional(),
  emphasisAreas: z.array(z.string()).optional(),
  notes: z.string().optional(),
  // Legacy fields (for backward compatibility during transition)
  htmlBody: z.string().optional(),
  plainTextBody: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
});

/**
 * Email structure from AI (Phase 4B: block-based format)
 */
const GeneratedBlockEmailSchema = z.object({
  subject: z.string().min(1).max(100),
  previewText: z.string().min(1).max(150),
  blocks: z.array(EmailBlockSchema).min(1),
  globalSettings: GlobalEmailSettingsSchema.nullish(), // nullish for OpenAI compatibility
  notes: z.string().nullish(), // nullish for OpenAI compatibility
});

/**
 * Design configuration from AI
 * NOTE: template field is deprecated (legacy) - system now uses blocks
 */
const DesignConfigSchema = z.object({
  template: z.string().nullish(), // Deprecated: kept for backward compatibility, not used for rendering
  headerGradient: z.object({
    from: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    to: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    direction: z.enum(['to-right', 'to-bottom', 'to-br', 'to-tr']).nullish(), // nullish for OpenAI compatibility
  }).nullish(), // nullish for OpenAI compatibility
  ctaColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').nullish(), // nullish for OpenAI compatibility
  visualStyle: z.string().nullish(), // nullish for OpenAI compatibility
  // AI-powered design customization
  typographyScale: z.enum(['premium', 'standard', 'minimal']).nullish(), // nullish for OpenAI compatibility
  layoutVariation: z.object({
    heroPlacement: z.enum(['top-centered', 'full-bleed', 'split-screen', 'minimal']).nullish(), // nullish for OpenAI compatibility
    sectionLayout: z.enum(['single-column', 'two-column', 'grid', 'alternating']).nullish(), // nullish for OpenAI compatibility
    ctaStyle: z.enum(['bold-centered', 'inline', 'floating', 'subtle']).nullish(), // nullish for OpenAI compatibility
    spacing: z.enum(['generous', 'standard', 'compact']).nullish(), // nullish for OpenAI compatibility
    visualWeight: z.enum(['balanced', 'text-heavy', 'image-heavy']).nullish(), // nullish for OpenAI compatibility
  }).nullish(), // nullish for OpenAI compatibility
});

/**
 * Complete AI-generated campaign (block-based emails only)
 */
export const GeneratedCampaignSchema = z.object({
  campaignName: z.string().min(1).max(100),
  campaignType: z.enum(['one-time', 'sequence']),
  recommendedSegment: z.string(),
  strategy: z.object({
    goal: z.string(),
    keyMessage: z.string(),
  }).nullish(), // nullish for OpenAI compatibility
  design: DesignConfigSchema,
  emails: z.array(GeneratedBlockEmailSchema).min(1).max(5),
  segmentationSuggestion: z.string(),
  sendTimeSuggestion: z.string(),
  successMetrics: z.string(),
});

export type GeneratedCampaign = z.infer<typeof GeneratedCampaignSchema>;
export type GeneratedEmail = z.infer<typeof GeneratedEmailSchema>;
export type GeneratedBlockEmail = z.infer<typeof GeneratedBlockEmailSchema>;
export type DesignConfig = z.infer<typeof DesignConfigSchema>;

/**
 * Post-process JSON Schema to fix OpenAI Structured Outputs strict mode compatibility
 * 
 * NOTE: This transforms the SCHEMA for OpenAI API compatibility, NOT the AI output.
 * Structured Outputs guarantees the AI output matches the schema - we just need to
 * make our Zod-generated schema compatible with OpenAI's strict mode requirements.
 * 
 * Fixes:
 * 1. Remove unsupported formats (uri, email) - validation still happens in Zod
 * 2. Convert optional properties to nullable (anyOf with null)
 * 3. Ensure all properties are in required array (OpenAI strict mode requirement)
 */
export function fixSchemaForStrictMode(schema: Record<string, any>): Record<string, any> {
  if (typeof schema !== 'object' || schema === null) {
    return schema;
  }

  // Recursively process the schema
  const processed = { ...schema };

  // Remove unsupported format constraints (OpenAI doesn't support uri, email, etc.)
  // Validation still happens in Zod after we get the response
  if (processed.format && ['uri', 'email', 'url'].includes(processed.format)) {
    delete processed.format;
  }

  // If this is an object schema with properties
  if (processed.type === 'object' && processed.properties) {
    const allPropertyKeys = Object.keys(processed.properties);
    const requiredKeys = processed.required || [];
    
    // For each property, recursively fix it first
    const fixedProperties: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(processed.properties)) {
      const propValue = fixSchemaForStrictMode(value as Record<string, any>);
      const isRequired = requiredKeys.includes(key);
      
      // If property is not in required array (optional), make it nullable
      // OpenAI strict mode requires all properties to be in required array
      // By making optional properties nullable, they can be included in required
      if (!isRequired && propValue.type && propValue.type !== 'null' && !propValue.anyOf) {
        // Convert optional property to nullable using anyOf
        fixedProperties[key] = {
          anyOf: [
            propValue,
            { type: 'null' }
          ]
        };
      } else {
        fixedProperties[key] = propValue;
      }
    }
    processed.properties = fixedProperties;

    // OpenAI strict mode: ALL properties must be in required array
    // Since we made optional properties nullable, we include them all
    processed.required = allPropertyKeys;
  }

  // Process arrays
  if (processed.type === 'array' && processed.items) {
    processed.items = fixSchemaForStrictMode(processed.items as Record<string, any>);
  }

  // Process anyOf, oneOf, allOf
  if (processed.anyOf) {
    processed.anyOf = processed.anyOf.map((item: any) => fixSchemaForStrictMode(item));
  }
  if (processed.oneOf) {
    processed.oneOf = processed.oneOf.map((item: any) => fixSchemaForStrictMode(item));
  }
  if (processed.allOf) {
    processed.allOf = processed.allOf.map((item: any) => fixSchemaForStrictMode(item));
  }

  return processed;
}

/**
 * Convert GeneratedCampaignSchema to JSON Schema for OpenAI Structured Outputs
 * This guarantees schema compliance - OpenAI will enforce the structure
 */
export function getCampaignJSONSchema(): Record<string, any> {
  const schema = toJSONSchema(GeneratedCampaignSchema);
  // Fix schema for OpenAI's strict mode requirements
  return fixSchemaForStrictMode(schema);
}

/**
 * Type guard to check if email is block-based (all emails are now block-based)
 */
export function isBlockBasedEmail(email: GeneratedBlockEmail): email is GeneratedBlockEmail {
  return 'blocks' in email && Array.isArray(email.blocks);
}

// ============================================================================
// Generation Result Schema
// ============================================================================

/**
 * Complete result including metadata
 */
export const GenerationResultSchema = z.object({
  id: z.string().uuid(),
  campaign: GeneratedCampaignSchema,
  metadata: z.object({
    model: z.string(),
    tokensUsed: z.number(),
    promptTokens: z.number(),
    completionTokens: z.number(),
    costUsd: z.number(),
    generationTimeMs: z.number(),
    generatedAt: z.date(),
  }),
});

export type GenerationResult = z.infer<typeof GenerationResultSchema>;

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validate and parse user input
 */
export function validateCampaignInput(input: unknown): GenerateCampaignInput {
  try {
    return GenerateCampaignInputSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new Error(`Invalid input: ${firstError.path.join('.')}: ${firstError.message}`);
    }
    throw error;
  }
}

/**
 * Validate and parse AI response
 */
export function validateAIResponse(response: unknown): GeneratedCampaign {
  try {
    return GeneratedCampaignSchema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('🔍 [VALIDATOR] Zod validation error count:', error.issues?.length || 0);
      console.error('🔍 [VALIDATOR] Zod errors:', error.issues);
      const errors = (error.issues || []).map((e) => {
        const path = e.path && e.path.length > 0 ? e.path.join('.') : 'root';
        return `${path}: ${e.message}`;
      }).join(', ');
      throw new Error(`Invalid AI response: ${errors}`);
    }
    throw error;
  }
}

/**
 * Safely parse JSON with validation
 * NOTE: When using Structured Outputs, this is mainly for type checking
 * as OpenAI guarantees schema compliance
 */
export function parseAndValidateCampaign(jsonString: string): GeneratedCampaign {
  try {
    const parsed = JSON.parse(jsonString);
    console.log('📋 [VALIDATOR] Parsed campaign structure:', {
      campaignName: parsed?.campaignName,
      emailCount: parsed?.emails?.length,
      hasBlocks: parsed?.emails?.[0]?.blocks ? true : false,
      firstBlockType: parsed?.emails?.[0]?.blocks?.[0]?.type
    });
    
    // With Structured Outputs, OpenAI guarantees schema compliance
    // So we can trust the structure and just do type checking
    return validateAIResponse(parsed);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('AI returned invalid JSON');
    }
    throw error;
  }
}

/**
 * Parse structured output directly (no JSON parsing needed)
 * Used when OpenAI Structured Outputs returns typed object
 */
export function parseStructuredCampaign(data: unknown): GeneratedCampaign {
  // Structured Outputs guarantees schema compliance, so this is mainly type checking
  console.log('📋 [VALIDATOR] Parsing structured campaign:', {
    campaignName: (data as any)?.campaignName,
    emailCount: (data as any)?.emails?.length,
  });
  
  return validateAIResponse(data);
}

