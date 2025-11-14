/**
 * AI Campaign Generator - Validation Schemas
 * 
 * Zod schemas for type-safe validation of inputs and AI responses
 * 
 * Phase 4B: Now supports block-based email generation
 */

import { z } from 'zod';
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

// Removed: fixSchemaForStrictMode() - No longer needed with Gemini's native Zod support!

/**
 * Get the campaign Zod schema for AI generation
 * With Gemini, we can pass Zod schemas directly - no JSON Schema conversion needed!
 * For OpenAI fallback, we'll handle conversion in the provider layer.
 */
export function getCampaignSchema(): z.ZodType<any> {
  return GeneratedCampaignSchema;
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

