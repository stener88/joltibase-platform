/**
 * Email Block Schemas - Zod Validation
 * 
 * Runtime validation schemas for all block types.
 * Provides type safety at runtime for API inputs and database storage.
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

// URL that accepts valid URLs or merge tag placeholders
const UrlOrMergeTagSchema = z.string().refine(
  (val) => {
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
  linkUrl: UrlOrMergeTagSchema.optional(),
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
// 3. Heading Block
// ============================================================================

export const HeadingBlockSettingsSchema = z.object({
  fontSize: PixelValueSchema,
  fontWeight: z.number().int().min(100).max(900),
  color: HexColorSchema,
  align: AlignmentSchema,
  backgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema,
  lineHeight: z.string().regex(/^\d+(\.\d+)?$/),
  letterSpacing: z.string().regex(/^-?\d+(\.\d+)?em$/).optional(),
});

export const HeadingBlockContentSchema = z.object({
  text: z.string().min(1).max(500),
});

export const HeadingBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('heading'),
  position: z.number().int().min(0),
  settings: HeadingBlockSettingsSchema,
  content: HeadingBlockContentSchema,
});

// ============================================================================
// 4. Text Block
// ============================================================================

export const TextBlockSettingsSchema = z.object({
  fontSize: PixelValueSchema,
  fontWeight: z.number().int().min(100).max(900),
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
});

export const ImageBlockContentSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  altText: z.string().min(1).max(200),
  linkUrl: UrlOrMergeTagSchema.optional(),
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
  width: PixelValueSchema.or(z.literal('100%')).optional(),
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
// 8. Hero Block
// ============================================================================

export const HeroBlockSettingsSchema = z.object({
  backgroundColor: HexColorSchema.optional(),
  backgroundGradient: z.object({
    from: HexColorSchema,
    to: HexColorSchema,
    direction: z.enum(['to-right', 'to-bottom', 'to-br', 'to-tr']),
  }).optional(),
  padding: PaddingSchema,
  align: AlignmentSchema,
  headlineFontSize: PixelValueSchema,
  headlineFontWeight: z.number().int().min(100).max(900),
  headlineColor: HexColorSchema,
  subheadlineFontSize: PixelValueSchema,
  subheadlineColor: HexColorSchema,
});

export const HeroBlockContentSchema = z.object({
  headline: z.string().min(1).max(200),
  subheadline: z.string().max(500).optional(),
  imageUrl: UrlOrMergeTagSchema.optional(),
});

export const HeroBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('hero'),
  position: z.number().int().min(0),
  settings: HeroBlockSettingsSchema,
  content: HeroBlockContentSchema,
});

// ============================================================================
// 9. Stats Block
// ============================================================================

export const StatsBlockSettingsSchema = z.object({
  layout: z.enum(['2-col', '3-col', '4-col']),
  align: AlignmentSchema,
  valueFontSize: PixelValueSchema,
  valueFontWeight: z.number().int().min(100).max(900),
  valueColor: HexColorSchema,
  labelFontSize: PixelValueSchema,
  labelFontWeight: z.number().int().min(100).max(900),
  labelColor: HexColorSchema,
  padding: PaddingSchema,
  spacing: z.number().int().min(0).max(100),
});

export const StatsBlockContentSchema = z.object({
  stats: z.array(z.object({
    value: z.string().min(1).max(50),
    label: z.string().min(1).max(100),
  })).min(1).max(4),
});

export const StatsBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('stats'),
  position: z.number().int().min(0),
  settings: StatsBlockSettingsSchema,
  content: StatsBlockContentSchema,
});

// ============================================================================
// 10. Testimonial Block
// ============================================================================

export const TestimonialBlockSettingsSchema = z.object({
  backgroundColor: HexColorSchema.optional(),
  borderColor: HexColorSchema.optional(),
  borderWidth: z.number().int().min(0).max(10).optional(),
  borderRadius: PixelValueSchema.optional(),
  padding: PaddingSchema,
  quoteFontSize: PixelValueSchema,
  quoteColor: HexColorSchema,
  quoteFontStyle: z.enum(['normal', 'italic']),
  authorFontSize: PixelValueSchema,
  authorColor: HexColorSchema,
  authorFontWeight: z.number().int().min(100).max(900),
});

export const TestimonialBlockContentSchema = z.object({
  quote: z.string().min(1).max(1000),
  author: z.string().min(1).max(100),
  role: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  avatarUrl: UrlOrMergeTagSchema.optional(),
});

export const TestimonialBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('testimonial'),
  position: z.number().int().min(0),
  settings: TestimonialBlockSettingsSchema,
  content: TestimonialBlockContentSchema,
});

// ============================================================================
// 11. Feature Grid Block
// ============================================================================

export const FeatureGridBlockSettingsSchema = z.object({
  layout: z.enum(['2-col', '3-col', 'single-col']),
  align: AlignmentSchema,
  iconSize: PixelValueSchema,
  titleFontSize: PixelValueSchema,
  titleFontWeight: z.number().int().min(100).max(900),
  titleColor: HexColorSchema,
  descriptionFontSize: PixelValueSchema,
  descriptionColor: HexColorSchema,
  padding: PaddingSchema,
  spacing: z.number().int().min(0).max(100),
});

export const FeatureGridBlockContentSchema = z.object({
  features: z.array(z.object({
    icon: z.string().max(10).optional(),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
  })).min(1).max(6),
});

export const FeatureGridBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('feature-grid'),
  position: z.number().int().min(0),
  settings: FeatureGridBlockSettingsSchema,
  content: FeatureGridBlockContentSchema,
});

// ============================================================================
// 12. Comparison Block
// ============================================================================

export const ComparisonBlockSettingsSchema = z.object({
  beforeBackgroundColor: HexColorSchema,
  afterBackgroundColor: HexColorSchema,
  beforeLabelColor: HexColorSchema,
  afterLabelColor: HexColorSchema,
  labelFontSize: PixelValueSchema,
  labelFontWeight: z.number().int().min(100).max(900),
  contentFontSize: PixelValueSchema,
  contentColor: HexColorSchema,
  borderRadius: PixelValueSchema.optional(),
  padding: PaddingSchema,
  cellPadding: z.number().int().min(0).max(100),
});

export const ComparisonBlockContentSchema = z.object({
  before: z.object({
    label: z.string().max(50).optional(),
    text: z.string().min(1).max(500),
  }),
  after: z.object({
    label: z.string().max(50).optional(),
    text: z.string().min(1).max(500),
  }),
});

export const ComparisonBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('comparison'),
  position: z.number().int().min(0),
  settings: ComparisonBlockSettingsSchema,
  content: ComparisonBlockContentSchema,
});

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
});

export const SocialLinksBlockContentSchema = z.object({
  links: z.array(z.object({
    platform: z.enum(['twitter', 'linkedin', 'facebook', 'instagram', 'youtube', 'github', 'tiktok']),
    url: z.string().url(),
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
// Union Schema for All Block Types
// ============================================================================

export const EmailBlockSchema = z.discriminatedUnion('type', [
  LogoBlockSchema,
  SpacerBlockSchema,
  HeadingBlockSchema,
  TextBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
  DividerBlockSchema,
  HeroBlockSchema,
  StatsBlockSchema,
  TestimonialBlockSchema,
  FeatureGridBlockSchema,
  ComparisonBlockSchema,
  SocialLinksBlockSchema,
  FooterBlockSchema,
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
// Type Inference
// ============================================================================

// Export inferred types from schemas
export type LogoBlockType = z.infer<typeof LogoBlockSchema>;
export type SpacerBlockType = z.infer<typeof SpacerBlockSchema>;
export type HeadingBlockType = z.infer<typeof HeadingBlockSchema>;
export type TextBlockType = z.infer<typeof TextBlockSchema>;
export type ImageBlockType = z.infer<typeof ImageBlockSchema>;
export type ButtonBlockType = z.infer<typeof ButtonBlockSchema>;
export type DividerBlockType = z.infer<typeof DividerBlockSchema>;
export type HeroBlockType = z.infer<typeof HeroBlockSchema>;
export type StatsBlockType = z.infer<typeof StatsBlockSchema>;
export type TestimonialBlockType = z.infer<typeof TestimonialBlockSchema>;
export type FeatureGridBlockType = z.infer<typeof FeatureGridBlockSchema>;
export type ComparisonBlockType = z.infer<typeof ComparisonBlockSchema>;
export type SocialLinksBlockType = z.infer<typeof SocialLinksBlockSchema>;
export type FooterBlockType = z.infer<typeof FooterBlockSchema>;
export type EmailBlockType = z.infer<typeof EmailBlockSchema>;
export type BlockEmailType = z.infer<typeof BlockEmailSchema>;
export type GlobalEmailSettingsType = z.infer<typeof GlobalEmailSettingsSchema>;

