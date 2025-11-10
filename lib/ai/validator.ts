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
  globalSettings: GlobalEmailSettingsSchema.optional(),
  notes: z.string().optional(),
});

/**
 * Unified email schema - supports both sections and blocks
 */
const UnifiedEmailSchema = z.union([
  GeneratedEmailSchema,
  GeneratedBlockEmailSchema,
]);

/**
 * Design configuration from AI
 */
const DesignConfigSchema = z.object({
  template: z.enum([
    // Legacy templates
    'gradient-hero', 
    'color-blocks', 
    'bold-modern', 
    'minimal-accent', 
    'text-first',
    // Premium templates
    'premium-hero',
    'split-hero',
    'gradient-impact',
    'minimal-hero',
    // Content-focused templates
    'story-teller',
    'feature-showcase',
    'newsletter-pro',
    'text-luxury',
    // Conversion-focused templates
    'launch-announcement',
    'promo-bold',
    'social-proof',
    'comparison-hero',
    // Specialized templates
    'welcome-warmth',
    'milestone-celebration',
    'update-digest',
  ]),
  headerGradient: z.object({
    from: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    to: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    direction: z.enum(['to-right', 'to-bottom', 'to-br', 'to-tr']).optional(),
  }).optional(),
  ctaColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  visualStyle: z.string().optional(),
  // AI-powered design customization
  typographyScale: z.enum(['premium', 'standard', 'minimal']).optional(),
  layoutVariation: z.object({
    heroPlacement: z.enum(['top-centered', 'full-bleed', 'split-screen', 'minimal']).optional(),
    sectionLayout: z.enum(['single-column', 'two-column', 'grid', 'alternating']).optional(),
    ctaStyle: z.enum(['bold-centered', 'inline', 'floating', 'subtle']).optional(),
    spacing: z.enum(['generous', 'standard', 'compact']).optional(),
    visualWeight: z.enum(['balanced', 'text-heavy', 'image-heavy']).optional(),
  }).optional(),
});

/**
 * Complete AI-generated campaign (supports both section and block-based emails)
 */
export const GeneratedCampaignSchema = z.object({
  campaignName: z.string().min(1).max(100),
  campaignType: z.enum(['one-time', 'sequence']),
  recommendedSegment: z.string(),
  strategy: z.object({
    goal: z.string(),
    keyMessage: z.string(),
  }).optional(),
  design: DesignConfigSchema,
  emails: z.array(UnifiedEmailSchema).min(1).max(5),
  segmentationSuggestion: z.string(),
  sendTimeSuggestion: z.string(),
  successMetrics: z.string(),
});

export type GeneratedCampaign = z.infer<typeof GeneratedCampaignSchema>;
export type GeneratedEmail = z.infer<typeof GeneratedEmailSchema>;
export type GeneratedBlockEmail = z.infer<typeof GeneratedBlockEmailSchema>;
export type UnifiedEmail = z.infer<typeof UnifiedEmailSchema>;
export type DesignConfig = z.infer<typeof DesignConfigSchema>;

/**
 * Type guard to check if email is block-based
 */
export function isBlockBasedEmail(email: UnifiedEmail): email is GeneratedBlockEmail {
  return 'blocks' in email && Array.isArray(email.blocks);
}

/**
 * Type guard to check if email is section-based (legacy)
 */
export function isSectionBasedEmail(email: UnifiedEmail): email is GeneratedEmail {
  return 'sections' in email && Array.isArray(email.sections);
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

