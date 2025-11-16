/**
 * Email Block Schemas V2 - Flodesk Pattern
 * 
 * Complete rebuild with 11 base blocks + 50+ layout variations
 * Optimized for Gemini's native Zod support
 */

import { z } from 'zod';
import { LayoutVariationSchema } from './schemas';
import {
  PaddingSchema,
  AlignmentSchema,
  HexColorSchema,
  PixelValueSchema,
  UrlOrMergeTagSchema,
} from './schemas-common';

// ============================================================================
// Base Block Types (11)
// ============================================================================

export const BaseBlockTypeSchema = z.enum([
  'layouts',        // All complex designs
  'logo',
  'text',
  'image',
  'link-bar',
  'button',
  'divider',
  'spacer',
  'social-links',
  'footer',
  'address',
]);

// Import LayoutVariationSchema from schemas.ts (no longer defined here)

// ============================================================================
// Universal Block Schema
// ============================================================================

export const BlockSchema = z.object({
  id: z.string().min(1).describe('Unique block identifier'),
  type: BaseBlockTypeSchema.describe('Block type - one of 11 base types'),
  position: z.number().int().min(0).describe('Block position (0-indexed)'),
  
  // layoutVariation: ONLY set when type='layouts'
  // Accept enum value, null, or undefined (Gemini sometimes generates null)
  layoutVariation: z.union([
    LayoutVariationSchema,
    z.null(),
    z.undefined(),
  ]).optional().describe(
    'Layout variation - REQUIRED when type is "layouts". Must be one of the 60+ valid variations.'
  ),
  
  // Flexible settings (structure varies by type and variation)
  settings: z.object({}).loose().describe('Block settings: padding, colors, fonts, spacing, etc.'),
  
  // Flexible content (structure varies by type and variation)
  content: z.object({}).loose().describe('Block content: text, images, URLs, nested data, etc.'),
});

// ============================================================================
// Email & Campaign Schemas
// ============================================================================

export const EmailSchema = z.object({
  subject: z.string().min(1).max(100),
  previewText: z.string().min(1).max(150),
  blocks: z.array(BlockSchema).min(1),
  globalSettings: z.object({
    backgroundColor: z.string(),
    contentBackgroundColor: z.string(),
    maxWidth: z.number(),
    fontFamily: z.string(),
    mobileBreakpoint: z.number().optional(), // Optional - AI may not include it
  }).optional(),
  notes: z.string().optional(),
});

export const CampaignSchema = z.object({
  campaignName: z.string().min(1).max(100),
  campaignType: z.enum(['one-time', 'sequence']),
  emails: z.array(EmailSchema).min(1).max(5),
  recommendedSegment: z.string().optional(),
  strategy: z.object({
    goal: z.string(),
    keyMessage: z.string(),
  }).optional(),
  design: z.object({
    template: z.string(),
    ctaColor: z.string(),
    accentColor: z.string().optional(),
  }),
  segmentationSuggestion: z.string().optional(),
  sendTimeSuggestion: z.string().optional(),
  successMetrics: z.string().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type Block = z.infer<typeof BlockSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
export type BaseBlockType = z.infer<typeof BaseBlockTypeSchema>;
export type LayoutVariation = z.infer<typeof LayoutVariationSchema>;

