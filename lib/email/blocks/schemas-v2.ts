/**
 * Email Block Schemas V2 - Flodesk Pattern
 * 
 * Complete rebuild with 11 base blocks + 50+ layout variations
 * Optimized for Gemini's native Zod support
 */

import { z } from 'zod';

// ============================================================================
// Common Schemas
// ============================================================================

const PaddingSchema = z.object({
  top: z.number().int().min(0).max(200),
  bottom: z.number().int().min(0).max(200),
  left: z.number().int().min(0).max(200),
  right: z.number().int().min(0).max(200),
});

const AlignmentSchema = z.enum(['left', 'center', 'right']);
const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);
const PixelValueSchema = z.string().regex(/^\d+px$/);

const UrlSchema = z.string().refine(
  (val) => {
    if (val === '' || /^\{\{.+\}\}$/.test(val)) return true;
    return z.string().url().safeParse(val).success;
  },
  { message: "Must be a valid URL or merge tag {{...}}" }
);

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

// ============================================================================
// Layout Variations (50+)
// ============================================================================

export const LayoutVariationSchema = z.enum([
  // Content layouts (was: hero, stats, testimonial blocks)
  'hero-center',
  'hero-image-overlay',
  'stats-2-col',
  'stats-3-col',
  'stats-4-col',
  'testimonial-centered',
  'testimonial-with-image',
  'testimonial-card',
  
  // Two-column
  'two-column-50-50',
  'two-column-60-40',
  'two-column-40-60',
  'two-column-70-30',
  'two-column-30-70',
  
  // Three-column
  'three-column-equal',
  'three-column-wide-center',
  'three-column-wide-outer',
  
  // Four+ columns
  'four-column-equal',
  'five-column-equal',
  
  // Image layouts
  'image-overlay',
  'image-overlay-center',
  'image-overlay-top-left',
  'image-overlay-top-right',
  'image-overlay-bottom-left',
  'image-overlay-bottom-right',
  'image-overlay-center-bottom',
  'image-collage-featured-left',
  'image-collage-featured-right',
  'image-collage-featured-center',
  
  // Advanced layouts
  'zigzag-2-rows',
  'zigzag-3-rows',
  'zigzag-4-rows',
  'split-background',
  'product-card-image-top',
  'product-card-image-left',
  'badge-overlay-corner',
  'badge-overlay-center',
  'feature-grid-2-items',
  'feature-grid-3-items',
  'feature-grid-4-items',
  'feature-grid-6-items',
  'comparison-table-2-col',
  'comparison-table-3-col',
  'card-centered',
  'compact-image-text',
  'two-column-text',
  'magazine-feature',
  
  // Interactive (was: carousel, tabs, accordion blocks)
  'carousel-2-slides',
  'carousel-3-5-slides',
  'carousel-6-10-slides',
  'tabs-2-tabs',
  'tabs-3-5-tabs',
  'tabs-6-8-tabs',
  'accordion-2-items',
  'accordion-3-5-items',
  'accordion-6-10-items',
  'masonry-2-col',
  'masonry-3-col',
  'masonry-4-col',
  'masonry-5-col',
  'container-stack',
  'container-grid',
  'container-flex',
]);

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

