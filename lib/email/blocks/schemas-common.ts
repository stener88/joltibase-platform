/**
 * Common Schema Primitives
 * 
 * Shared Zod schemas used across block validation.
 * Centralized to eliminate duplication between schemas.ts and schemas-v2.ts
 */

import { z } from 'zod';

// ============================================================================
// Common Schemas
// ============================================================================

export const PaddingSchema = z.object({
  top: z.number().int().min(0).max(200),
  bottom: z.number().int().min(0).max(200),
  left: z.number().int().min(0).max(200),
  right: z.number().int().min(0).max(200),
});

export const AlignmentSchema = z.enum(['left', 'center', 'right']);

export const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const PixelValueSchema = z.string().regex(/^\d+px$/);

/**
 * URL that accepts valid URLs or merge tag placeholders
 * Allows empty strings, merge tags like {{variable}}, or valid URLs
 */
export const UrlOrMergeTagSchema = z.string().refine(
  (val) => {
    // Allow empty string (for deleted/not set images)
    if (val === '') {
      return true;
    }
    // Allow merge tag pattern: {{anything}}
    if (/^\{\{.+\}\}$/.test(val)) {
      return true;
    }
    // Otherwise validate as proper URL
    return z.string().url().safeParse(val).success;
  },
  { message: "Must be a valid URL or merge tag placeholder like {{image_url}}" }
);

// ============================================================================
// Type Exports
// ============================================================================

export type Padding = z.infer<typeof PaddingSchema>;
export type Alignment = z.infer<typeof AlignmentSchema>;
export type HexColor = z.infer<typeof HexColorSchema>;
export type PixelValue = z.infer<typeof PixelValueSchema>;
export type UrlOrMergeTag = z.infer<typeof UrlOrMergeTagSchema>;

