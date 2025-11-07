/**
 * AI Campaign Generator - Validation Schemas
 * 
 * Zod schemas for type-safe validation of inputs and AI responses
 */

import { z } from 'zod';

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
 * Email structure from AI
 */
const GeneratedEmailSchema = z.object({
  subject: z.string().min(1).max(100),
  previewText: z.string().min(1).max(150),
  htmlBody: z.string().min(1), // Will be replaced with rendered template
  plainTextBody: z.string().min(1), // Will be replaced with generated plain text
  ctaText: z.string().min(1).max(50),
  ctaUrl: z.string().url().or(z.string().startsWith('{{').endsWith('}}')), // Allow merge tags
  notes: z.string().optional(),
});

/**
 * Design configuration from AI
 */
const DesignConfigSchema = z.object({
  template: z.enum(['gradient-hero', 'color-blocks', 'bold-modern', 'minimal-accent', 'text-first']),
  headerGradient: z.object({
    from: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    to: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    direction: z.enum(['to-right', 'to-bottom', 'to-br', 'to-tr']).optional(),
  }).optional(),
  ctaColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  visualStyle: z.string().optional(),
});

/**
 * Complete AI-generated campaign
 */
export const GeneratedCampaignSchema = z.object({
  campaignName: z.string().min(1).max(100),
  campaignType: z.enum(['one-time', 'sequence']),
  recommendedSegment: z.string(),
  design: DesignConfigSchema,
  emails: z.array(GeneratedEmailSchema).min(1).max(5),
  segmentationSuggestion: z.string(),
  sendTimeSuggestion: z.string(),
  successMetrics: z.string(),
});

export type GeneratedCampaign = z.infer<typeof GeneratedCampaignSchema>;
export type GeneratedEmail = z.infer<typeof GeneratedEmailSchema>;
export type DesignConfig = z.infer<typeof DesignConfigSchema>;

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
      const firstError = error.errors[0];
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
      const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Invalid AI response: ${errors}`);
    }
    throw error;
  }
}

/**
 * Safely parse JSON with validation
 */
export function parseAndValidateCampaign(jsonString: string): GeneratedCampaign {
  try {
    const parsed = JSON.parse(jsonString);
    return validateAIResponse(parsed);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('AI returned invalid JSON');
    }
    throw error;
  }
}

