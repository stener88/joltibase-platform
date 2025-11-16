/**
 * Email Block Schemas - Zod Validation
 * 
 * Runtime validation schemas for all block types.
 * Provides type safety at runtime for API inputs and database storage.
 */

import { z } from 'zod';
import {
  PaddingSchema,
  AlignmentSchema,
  HexColorSchema,
  PixelValueSchema,
  UrlOrMergeTagSchema,
} from './schemas-common';

// ============================================================================
// Layout Variation Schema - IMPLEMENTED ONLY
// ============================================================================

/**
 * Layout Variations Zod Schema
 * 
 * Only includes the 14 fully-implemented layout variations.
 * See lib/email/blocks/types.ts for the TypeScript type definition.
 * See lib/email/blocks/configs/ for layout configuration files.
 */
export const LayoutVariationSchema = z.enum([
  // Hero & Content (1)
  'hero-center',
  // Two-Column (6)
  'two-column-50-50',
  'two-column-60-40',
  'two-column-40-60',
  'two-column-70-30',
  'two-column-30-70',
  'two-column-text',
  // Stats (3)
  'stats-2-col',
  'stats-3-col',
  'stats-4-col',
  // Advanced (4)
  'image-overlay',
  'card-centered',
  'compact-image-text',
  'magazine-feature',
]);

// ============================================================================
// 1. Logo Block
// ============================================================================

export const LogoBlockSettingsSchema = z.object({
  align: AlignmentSchema,
  width: PixelValueSchema,
  height: z.union([z.literal('auto'), PixelValueSchema]).optional(),
  backgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema,
});

export const LogoBlockContentSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  altText: z.string().min(1).max(200),
  linkUrl: z.string().max(500).optional(),
});

export const LogoBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('logo'),
  position: z.number().int().min(0),
  settings: LogoBlockSettingsSchema,
  content: LogoBlockContentSchema,
});

// ============================================================================
// 2. Spacer Block
// ============================================================================

export const SpacerBlockSettingsSchema = z.object({
  height: z.number().int().min(0).max(200),
  backgroundColor: HexColorSchema.optional(),
});

export const SpacerBlockContentSchema = z.object({});

export const SpacerBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('spacer'),
  position: z.number().int().min(0),
  settings: SpacerBlockSettingsSchema,
  content: SpacerBlockContentSchema,
});

// ============================================================================
// 3. Text Block (includes heading functionality)
// ============================================================================

export const TextBlockSettingsSchema = z.object({
  fontSize: PixelValueSchema,
  fontWeight: z.number().int().min(100).max(900),
  fontFamily: z.string().optional(),
  color: HexColorSchema,
  align: AlignmentSchema,
  backgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema,
  lineHeight: z.string().regex(/^\d+(\.\d+)?$/),
});

export const TextBlockContentSchema = z.object({
  text: z.string().min(1).max(5000),
});

export const TextBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('text'),
  position: z.number().int().min(0),
  settings: TextBlockSettingsSchema,
  content: TextBlockContentSchema,
});

// ============================================================================
// 5. Image Block
// ============================================================================

export const ImageBlockSettingsSchema = z.object({
  align: AlignmentSchema,
  width: PixelValueSchema.or(z.literal('100%')),
  height: z.union([z.literal('auto'), PixelValueSchema]).optional(),
  borderRadius: PixelValueSchema.optional(),
  padding: PaddingSchema,
  columns: z.number().int().min(1).max(3).optional(),
  aspectRatio: z.enum(['auto', '1:1', '16:9', '4:3', '3:4', '2:3']).optional(),
  gap: z.number().int().min(0).max(32).optional(),
  backgroundColor: z.union([HexColorSchema, z.literal('transparent')]).optional(),
});

export const ImageBlockContentSchema = z.object({
  // New format: array of images
  images: z.array(z.object({
    url: UrlOrMergeTagSchema,
  altText: z.string().min(1).max(200),
    linkUrl: z.string().max(500).optional(),
  })).min(1).max(9).optional(),
  // Legacy format (for backward compatibility)
  imageUrl: UrlOrMergeTagSchema.optional(),
  altText: z.string().min(1).max(200).optional(),
  linkUrl: z.string().max(500).optional(),
  caption: z.string().max(500).optional(),
});

export const ImageBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('image'),
  position: z.number().int().min(0),
  settings: ImageBlockSettingsSchema,
  content: ImageBlockContentSchema,
});

// ============================================================================
// 6. Button Block
// ============================================================================

export const ButtonBlockSettingsSchema = z.object({
  style: z.enum(['solid', 'outline', 'ghost']),
  color: HexColorSchema,
  textColor: HexColorSchema,
  align: AlignmentSchema,
  size: z.enum(['small', 'medium', 'large']),
  borderRadius: PixelValueSchema,
  fontSize: PixelValueSchema,
  fontWeight: z.number().int().min(100).max(900),
  padding: PaddingSchema,
  containerPadding: PaddingSchema,
  backgroundColor: z.union([HexColorSchema, z.literal('transparent')]).optional(),
});

export const ButtonBlockContentSchema = z.object({
  text: z.string().min(1).max(100),
  url: UrlOrMergeTagSchema,
});

export const ButtonBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('button'),
  position: z.number().int().min(0),
  settings: ButtonBlockSettingsSchema,
  content: ButtonBlockContentSchema,
});

// ============================================================================
// 7. Divider Block
// ============================================================================

export const DividerBlockSettingsSchema = z.object({
  style: z.enum(['solid', 'dashed', 'dotted', 'decorative']),
  color: HexColorSchema.optional(),
  thickness: z.number().int().min(1).max(10).optional(),
  width: z.union([PixelValueSchema, z.string().regex(/^\d+%$/)]).optional(),
  padding: PaddingSchema,
  align: AlignmentSchema.optional(),
});

export const DividerBlockContentSchema = z.object({
  decorativeElement: z.string().max(10).optional(),
});

export const DividerBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('divider'),
  position: z.number().int().min(0),
  settings: DividerBlockSettingsSchema,
  content: DividerBlockContentSchema,
});


// ============================================================================
// 8. Social Links Block
// ============================================================================

// 13. Social Links Block
// ============================================================================

export const SocialLinksBlockSettingsSchema = z.object({
  align: AlignmentSchema,
  iconSize: PixelValueSchema,
  spacing: z.number().int().min(0).max(100),
  iconStyle: z.enum(['color', 'monochrome', 'outline']),
  iconColor: HexColorSchema.optional(),
  padding: PaddingSchema,
  backgroundColor: z.union([HexColorSchema, z.literal('transparent')]).optional(),
});

export const SocialLinksBlockContentSchema = z.object({
  links: z.array(z.object({
    platform: z.enum(['twitter', 'linkedin', 'facebook', 'instagram', 'youtube', 'github', 'tiktok']),
    url: UrlOrMergeTagSchema,
  })).min(1).max(10),
});

export const SocialLinksBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('social-links'),
  position: z.number().int().min(0),
  settings: SocialLinksBlockSettingsSchema,
  content: SocialLinksBlockContentSchema,
});

// ============================================================================
// 9. Layouts Block (V2 - Flexible Multi-Element Layouts)
// ============================================================================

export const LayoutsBlockSettingsSchema = z.object({
  padding: PaddingSchema,
  backgroundColor: z.union([HexColorSchema, z.literal('transparent')]).optional(),
  align: AlignmentSchema.optional(),
  
  // Visibility toggles
  showHeader: z.boolean().optional(),
  showTitle: z.boolean().optional(),
  showDivider: z.boolean().optional(),
  showParagraph: z.boolean().optional(),
  showButton: z.boolean().optional(),
  showImage: z.boolean().optional(),
  
  // Layout-specific settings
  flip: z.boolean().optional(), // For two-column layouts
  columns: z.number().int().min(2).max(4).optional(), // For multi-column stats
  
  // Child element styling overrides
  headerFontSize: PixelValueSchema.optional(),
  headerColor: HexColorSchema.optional(),
  headerFontWeight: z.number().int().min(100).max(900).optional(),
  titleFontSize: PixelValueSchema.optional(),
  titleColor: HexColorSchema.optional(),
  titleFontWeight: z.number().int().min(100).max(900).optional(),
  paragraphFontSize: PixelValueSchema.optional(),
  paragraphColor: HexColorSchema.optional(),
  paragraphFontWeight: z.number().int().min(100).max(900).optional(),
  dividerColor: HexColorSchema.optional(),
  dividerWidth: PixelValueSchema.optional(),
  dividerThickness: z.number().int().min(1).max(10).optional(),
  buttonBackgroundColor: HexColorSchema.optional(),
  buttonTextColor: HexColorSchema.optional(),
  buttonBorderRadius: PixelValueSchema.optional(),
  borderRadius: PixelValueSchema.optional(), // For images
});

export const LayoutsBlockContentSchema = z.object({
  // Text elements
  header: z.union([
    z.string(),
    z.object({
      text: z.string(),
      fontSize: PixelValueSchema.optional(),
      color: HexColorSchema.optional(),
      fontWeight: z.number().int().min(100).max(900).optional(),
    })
  ]).optional(),
  
  title: z.union([
    z.string(),
    z.object({
      text: z.string(),
      fontSize: PixelValueSchema.optional(),
      color: HexColorSchema.optional(),
      fontWeight: z.number().int().min(100).max(900).optional(),
    })
  ]).optional(),
  
  paragraph: z.union([
    z.string(),
    z.object({
      text: z.string(),
      fontSize: PixelValueSchema.optional(),
      color: HexColorSchema.optional(),
      fontWeight: z.number().int().min(100).max(900).optional(),
    })
  ]).optional(),
  
  divider: z.object({
    color: HexColorSchema.optional(),
    thickness: z.number().int().min(1).max(10).optional(),
    width: PixelValueSchema.optional(),
  }).optional(),
  
  // Action elements
  button: z.object({
    text: z.string(),
    url: z.string(),
    backgroundColor: HexColorSchema.optional(),
    textColor: HexColorSchema.optional(),
    borderRadius: PixelValueSchema.optional(),
    fontSize: PixelValueSchema.optional(),
    fontWeight: z.number().int().min(100).max(900).optional(),
    paddingVertical: z.number().int().min(0).max(50).optional(),
    paddingHorizontal: z.number().int().min(0).max(100).optional(),
  }).optional(),
  
  // Media elements
  image: z.object({
    url: UrlOrMergeTagSchema,
    altText: z.string().optional(),
    linkUrl: z.string().optional(),
  }).optional(),
  
  // Multi-item content (for stats, features, etc.)
  items: z.array(z.object({
    icon: z.string().optional(),
    title: z.string().optional(),
    value: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
});

export const LayoutsBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('layouts'),
  position: z.number().int().min(0),
  layoutVariation: LayoutVariationSchema,
  settings: LayoutsBlockSettingsSchema,
  content: LayoutsBlockContentSchema,
});

// ============================================================================
// 14. Footer Block
// ============================================================================

export const FooterBlockSettingsSchema = z.object({
  backgroundColor: HexColorSchema.optional(),
  textColor: HexColorSchema,
  fontSize: PixelValueSchema,
  align: AlignmentSchema,
  padding: PaddingSchema,
  lineHeight: z.string().regex(/^\d+(\.\d+)?$/),
  linkColor: HexColorSchema.optional(),
});

export const FooterBlockContentSchema = z.object({
  companyName: z.string().min(1).max(200),
  companyAddress: z.string().max(500).optional(),
  customText: z.string().max(1000).optional(),
  unsubscribeUrl: z.string().min(1).max(2000),
  preferencesUrl: z.string().max(2000).optional(),
});

export const FooterBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('footer'),
  position: z.number().int().min(0),
  settings: FooterBlockSettingsSchema,
  content: FooterBlockContentSchema,
});


// ============================================================================
// Email Block Union Schema (V2 Base Blocks Only)
// ============================================================================

export const EmailBlockSchema = z.discriminatedUnion('type', [
  LogoBlockSchema,
  SpacerBlockSchema,
  TextBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
  DividerBlockSchema,
  SocialLinksBlockSchema,
  LayoutsBlockSchema,
  FooterBlockSchema,
  // V2 blocks (to be added: link-bar, address)
]);

// ============================================================================
// Block Email Schema
// ============================================================================

export const GlobalEmailSettingsSchema = z.object({
  backgroundColor: HexColorSchema,
  contentBackgroundColor: HexColorSchema,
  maxWidth: z.number().int().min(400).max(800),
  fontFamily: z.string().min(1).max(500),
  mobileBreakpoint: z.number().int().min(320).max(768),
});

export const BlockEmailSchema = z.object({
  blocks: z.array(EmailBlockSchema).min(1),
  globalSettings: GlobalEmailSettingsSchema.optional(),
});

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate a single block
 */
export function validateBlock(block: unknown): {
  success: boolean;
  data?: any;
  error?: z.ZodError;
} {
  const result = EmailBlockSchema.safeParse(block);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Validate array of blocks
 */
export function validateBlocks(blocks: unknown): {
  success: boolean;
  data?: any[];
  error?: z.ZodError | string;
} {
  if (!Array.isArray(blocks)) {
    return {
      success: false,
      error: 'Blocks must be an array',
    };
  }
  
  const results = blocks.map(block => EmailBlockSchema.safeParse(block));
  const allSuccess = results.every(r => r.success);
  
  if (allSuccess) {
    return {
      success: true,
      data: results.map(r => (r as any).data),
    };
  } else {
    const firstError = results.find(r => !r.success);
    return {
      success: false,
      error: (firstError as any).error,
    };
  }
}

/**
 * Validate complete block email
 */
export function validateBlockEmail(email: unknown): {
  success: boolean;
  data?: any;
  error?: z.ZodError;
} {
  const result = BlockEmailSchema.safeParse(email);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Get validation errors as readable strings
 */
export function getValidationErrors(error: z.ZodError): string[] {
  return error.issues.map((err) => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });
}

// ============================================================================
// Type Inference (V2 Base Blocks Only)
// ============================================================================

// Export inferred types from schemas
export type LogoBlockType = z.infer<typeof LogoBlockSchema>;
export type SpacerBlockType = z.infer<typeof SpacerBlockSchema>;
export type TextBlockType = z.infer<typeof TextBlockSchema>;
export type ImageBlockType = z.infer<typeof ImageBlockSchema>;
export type ButtonBlockType = z.infer<typeof ButtonBlockSchema>;
export type DividerBlockType = z.infer<typeof DividerBlockSchema>;
export type SocialLinksBlockType = z.infer<typeof SocialLinksBlockSchema>;
export type LayoutsBlockType = z.infer<typeof LayoutsBlockSchema>;
export type FooterBlockType = z.infer<typeof FooterBlockSchema>;
// V2 blocks (to be added: LinkBarBlockType, AddressBlockType)
export type EmailBlockType = z.infer<typeof EmailBlockSchema>;
export type BlockEmailType = z.infer<typeof BlockEmailSchema>;
export type GlobalEmailSettingsType = z.infer<typeof GlobalEmailSettingsSchema>;

