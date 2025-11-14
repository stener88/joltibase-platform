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
// 1. Logo Block
// ============================================================================

export const LogoBlockSettingsSchema = z.object({
  align: AlignmentSchema,
  width: PixelValueSchema,
  height: z.union([z.literal('auto'), PixelValueSchema]).nullish(), // nullish for OpenAI compatibility
  backgroundColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
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
  backgroundColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
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
  backgroundColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
  padding: PaddingSchema,
  lineHeight: z.string().regex(/^\d+(\.\d+)?$/),
  letterSpacing: z.string().regex(/^-?\d+(\.\d+)?em$/).nullish(), // nullish for OpenAI compatibility
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
  backgroundColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
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
  height: z.union([z.literal('auto'), PixelValueSchema]).nullish(), // nullish for OpenAI compatibility
  borderRadius: PixelValueSchema.nullish(), // nullish for OpenAI compatibility
  padding: PaddingSchema,
});

export const ImageBlockContentSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  altText: z.string().min(1).max(200),
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
  color: HexColorSchema.nullish(), // nullish for OpenAI compatibility
  thickness: z.number().int().min(1).max(10).nullish(), // nullish for OpenAI compatibility
  width: PixelValueSchema.or(z.literal('100%')).nullish(), // nullish for OpenAI compatibility
  padding: PaddingSchema,
  align: AlignmentSchema.nullish(), // nullish for OpenAI compatibility
});

export const DividerBlockContentSchema = z.object({
  decorativeElement: z.string().max(10).nullish(), // nullish for OpenAI compatibility
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
  backgroundColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
  backgroundGradient: z.object({
    from: HexColorSchema,
    to: HexColorSchema,
    direction: z.enum(['to-right', 'to-bottom', 'to-br', 'to-tr']),
  }).nullish(), // nullish for OpenAI compatibility
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
  subheadline: z.string().max(500).nullish(), // nullish for OpenAI compatibility
  imageUrl: UrlOrMergeTagSchema.nullish(), // nullish for OpenAI compatibility
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
  backgroundColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
  borderColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
  borderWidth: z.number().int().min(0).max(10).nullish(), // nullish for OpenAI compatibility
  borderRadius: PixelValueSchema.nullish(), // nullish for OpenAI compatibility
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
  role: z.string().max(100).nullish(), // nullish for OpenAI compatibility
  company: z.string().max(100).nullish(), // nullish for OpenAI compatibility
  avatarUrl: UrlOrMergeTagSchema.nullish(), // nullish for OpenAI compatibility
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
    icon: z.string().max(10).nullish(), // nullish for OpenAI compatibility
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
  borderRadius: PixelValueSchema.nullish(), // nullish for OpenAI compatibility
  padding: PaddingSchema,
  cellPadding: z.number().int().min(0).max(100),
});

export const ComparisonBlockContentSchema = z.object({
  before: z.object({
    label: z.string().max(50).nullish(), // nullish for OpenAI compatibility
    text: z.string().min(1).max(500),
  }),
  after: z.object({
    label: z.string().max(50).nullish(), // nullish for OpenAI compatibility
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
  iconColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
  padding: PaddingSchema,
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
// 14. Footer Block
// ============================================================================

export const FooterBlockSettingsSchema = z.object({
  backgroundColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
  textColor: HexColorSchema,
  fontSize: PixelValueSchema,
  align: AlignmentSchema,
  padding: PaddingSchema,
  lineHeight: z.string().regex(/^\d+(\.\d+)?$/),
  linkColor: HexColorSchema.nullish(), // nullish for OpenAI compatibility
});

export const FooterBlockContentSchema = z.object({
  companyName: z.string().min(1).max(200),
  companyAddress: z.string().max(500).nullish(), // nullish for OpenAI compatibility
  customText: z.string().max(1000).nullish(), // nullish for OpenAI compatibility
  unsubscribeUrl: z.string().min(1).max(2000),
  preferencesUrl: z.string().max(2000).nullish(), // nullish for OpenAI compatibility
});

export const FooterBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('footer'),
  position: z.number().int().min(0),
  settings: FooterBlockSettingsSchema,
  content: FooterBlockContentSchema,
});

// ============================================================================
// COMPLEX LAYOUT BLOCKS
// ============================================================================

// ============================================================================
// 15. Two-Column Block
// ============================================================================

const TwoColumnContentSchema = z.object({
  type: z.enum(['image', 'text', 'rich-content']),
  imageUrl: UrlOrMergeTagSchema.nullish(),
  imageAltText: z.string().max(200).nullish(),
  text: z.string().max(1000).nullish(),
  richContent: z.object({
    heading: z.string().max(200).nullish(),
    headingSize: PixelValueSchema.nullish(),
    headingColor: HexColorSchema.nullish(),
    body: z.string().max(2000).nullish(),
    bodySize: PixelValueSchema.nullish(),
    bodyColor: HexColorSchema.nullish(),
    buttonText: z.string().max(100).nullish(),
    buttonUrl: UrlOrMergeTagSchema.nullish(),
    buttonColor: HexColorSchema.nullish(),
    buttonTextColor: HexColorSchema.nullish(),
  }).nullish(),
});

export const TwoColumnBlockSettingsSchema = z.object({
  layout: z.enum(['50-50', '60-40', '40-60', '70-30', '30-70']),
  verticalAlign: z.enum(['top', 'middle', 'bottom']),
  columnGap: z.number().int().min(0).max(100),
  backgroundColor: HexColorSchema.nullish(),
  padding: PaddingSchema,
  reverseOnMobile: z.boolean().nullish(),
  leftColumnBackgroundColor: HexColorSchema.nullish(),
  rightColumnBackgroundColor: HexColorSchema.nullish(),
  leftColumnPadding: PaddingSchema.nullish(),
  rightColumnPadding: PaddingSchema.nullish(),
});

export const TwoColumnBlockContentSchema = z.object({
  leftColumn: TwoColumnContentSchema,
  rightColumn: TwoColumnContentSchema,
});

export const TwoColumnBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('two-column'),
  position: z.number().int().min(0),
  settings: TwoColumnBlockSettingsSchema,
  content: TwoColumnBlockContentSchema,
});

// ============================================================================
// 16. Image Overlay Block
// ============================================================================

export const ImageOverlayBlockSettingsSchema = z.object({
  overlayPosition: z.enum(['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center-bottom']),
  overlayBackgroundColor: HexColorSchema.nullish(),
  overlayBackgroundOpacity: z.number().int().min(0).max(100),
  overlayPadding: PaddingSchema,
  overlayBorderRadius: PixelValueSchema.nullish(),
  imageHeight: PixelValueSchema,
  padding: PaddingSchema,
});

export const ImageOverlayBlockContentSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  imageAltText: z.string().max(200),
  heading: z.string().max(200).nullish(),
  headingSize: PixelValueSchema.nullish(),
  headingColor: HexColorSchema.nullish(),
  subheading: z.string().max(300).nullish(),
  subheadingSize: PixelValueSchema.nullish(),
  subheadingColor: HexColorSchema.nullish(),
  buttonText: z.string().max(100).nullish(),
  buttonUrl: UrlOrMergeTagSchema.nullish(),
  buttonColor: HexColorSchema.nullish(),
  buttonTextColor: HexColorSchema.nullish(),
});

export const ImageOverlayBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('image-overlay'),
  position: z.number().int().min(0),
  settings: ImageOverlayBlockSettingsSchema,
  content: ImageOverlayBlockContentSchema,
});

// ============================================================================
// 17. Image Grid 2x2 Block
// ============================================================================

const GridImageSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  altText: z.string().max(200),
  caption: z.string().max(100).optional(),
  linkUrl: z.string().max(500).optional(),
});

export const ImageGrid2x2BlockSettingsSchema = z.object({
  gridGap: z.number().int().min(0).max(50),
  imageHeight: PixelValueSchema,
  borderRadius: PixelValueSchema.nullish(),
  showCaptions: z.boolean(),
  captionFontSize: PixelValueSchema.nullish(),
  captionColor: HexColorSchema.nullish(),
  captionBackgroundColor: HexColorSchema.nullish(),
  captionBackgroundOpacity: z.number().int().min(0).max(100).nullish(),
  padding: PaddingSchema,
});

export const ImageGrid2x2BlockContentSchema = z.object({
  images: z.array(GridImageSchema).length(4),
});

export const ImageGrid2x2BlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('image-grid-2x2'),
  position: z.number().int().min(0),
  settings: ImageGrid2x2BlockSettingsSchema,
  content: ImageGrid2x2BlockContentSchema,
});

// ============================================================================
// 18. Image Grid 3x3 Block
// ============================================================================

export const ImageGrid3x3BlockSettingsSchema = z.object({
  gridGap: z.number().int().min(0).max(50),
  imageHeight: PixelValueSchema,
  borderRadius: PixelValueSchema.nullish(),
  showCaptions: z.boolean(),
  captionFontSize: PixelValueSchema.nullish(),
  captionColor: HexColorSchema.nullish(),
  captionBackgroundColor: HexColorSchema.nullish(),
  captionBackgroundOpacity: z.number().int().min(0).max(100).nullish(),
  padding: PaddingSchema,
});

export const ImageGrid3x3BlockContentSchema = z.object({
  images: z.array(GridImageSchema).length(9),
});

export const ImageGrid3x3BlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('image-grid-3x3'),
  position: z.number().int().min(0),
  settings: ImageGrid3x3BlockSettingsSchema,
  content: ImageGrid3x3BlockContentSchema,
});

// ============================================================================
// 19. Image Collage Block
// ============================================================================

export const ImageCollageBlockSettingsSchema = z.object({
  layout: z.enum(['featured-left', 'featured-right', 'featured-center']),
  gridGap: z.number().int().min(0).max(50),
  borderRadius: PixelValueSchema.nullish(),
  padding: PaddingSchema,
});

export const ImageCollageBlockContentSchema = z.object({
  featuredImage: z.object({
    imageUrl: UrlOrMergeTagSchema,
    altText: z.string().max(200),
    linkUrl: z.string().max(500).optional(),
  }),
  secondaryImages: z.array(z.object({
    imageUrl: UrlOrMergeTagSchema,
    altText: z.string().max(200),
    linkUrl: z.string().max(500).optional(),
  })).min(1).max(4),
});

export const ImageCollageBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('image-collage'),
  position: z.number().int().min(0),
  settings: ImageCollageBlockSettingsSchema,
  content: ImageCollageBlockContentSchema,
});

// ============================================================================
// 20. Three-Column Block
// ============================================================================

const ThreeColumnItemSchema = z.object({
  icon: z.string().max(10).nullish(),
  imageUrl: UrlOrMergeTagSchema.nullish(),
  imageAltText: z.string().max(200).nullish(),
  heading: z.string().max(200).nullish(),
  headingSize: PixelValueSchema.nullish(),
  headingColor: HexColorSchema.nullish(),
  body: z.string().max(1000).nullish(),
  bodySize: PixelValueSchema.nullish(),
  bodyColor: HexColorSchema.nullish(),
  buttonText: z.string().max(100).nullish(),
  buttonUrl: UrlOrMergeTagSchema.nullish(),
});

export const ThreeColumnBlockSettingsSchema = z.object({
  layout: z.enum(['equal', 'wide-center', 'wide-outer']),
  columnGap: z.number().int().min(0).max(100),
  verticalAlign: z.enum(['top', 'middle', 'bottom']),
  backgroundColor: HexColorSchema.nullish(),
  padding: PaddingSchema,
  columnBackgroundColor: HexColorSchema.nullish(),
  columnPadding: PaddingSchema.nullish(),
  columnBorderRadius: PixelValueSchema.nullish(),
});

export const ThreeColumnBlockContentSchema = z.object({
  columns: z.array(ThreeColumnItemSchema).length(3),
});

export const ThreeColumnBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('three-column'),
  position: z.number().int().min(0),
  settings: ThreeColumnBlockSettingsSchema,
  content: ThreeColumnBlockContentSchema,
});

// ============================================================================
// 21. Zigzag Block
// ============================================================================

const ZigzagRowSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  imageAltText: z.string().max(200),
  heading: z.string().max(200),
  headingSize: PixelValueSchema.nullish(),
  headingColor: HexColorSchema.nullish(),
  body: z.string().max(1000),
  bodySize: PixelValueSchema.nullish(),
  bodyColor: HexColorSchema.nullish(),
  buttonText: z.string().max(100).nullish(),
  buttonUrl: UrlOrMergeTagSchema.nullish(),
  buttonColor: HexColorSchema.nullish(),
  buttonTextColor: HexColorSchema.nullish(),
});

export const ZigzagBlockSettingsSchema = z.object({
  imageWidth: z.enum(['40%', '50%', '60%']),
  columnGap: z.number().int().min(0).max(100),
  rowGap: z.number().int().min(0).max(100),
  verticalAlign: z.enum(['top', 'middle', 'bottom']),
  backgroundColor: HexColorSchema.nullish(),
  padding: PaddingSchema,
  imageBorderRadius: PixelValueSchema.nullish(),
});

export const ZigzagBlockContentSchema = z.object({
  rows: z.array(ZigzagRowSchema).min(2).max(4),
});

export const ZigzagBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('zigzag'),
  position: z.number().int().min(0),
  settings: ZigzagBlockSettingsSchema,
  content: ZigzagBlockContentSchema,
});

// ============================================================================
// 22. Split Background Block
// ============================================================================

const GradientSchema = z.object({
  from: HexColorSchema,
  to: HexColorSchema,
  direction: z.enum(['to-right', 'to-bottom', 'to-br']),
});

const SplitColumnContentSchema = z.object({
  heading: z.string().max(200).nullish(),
  headingSize: PixelValueSchema.nullish(),
  headingColor: HexColorSchema.nullish(),
  body: z.string().max(1000).nullish(),
  bodySize: PixelValueSchema.nullish(),
  bodyColor: HexColorSchema.nullish(),
  imageUrl: UrlOrMergeTagSchema.nullish(),
  imageAltText: z.string().max(200).nullish(),
  buttonText: z.string().max(100).nullish(),
  buttonUrl: UrlOrMergeTagSchema.nullish(),
  buttonColor: HexColorSchema.nullish(),
  buttonTextColor: HexColorSchema.nullish(),
});

export const SplitBackgroundBlockSettingsSchema = z.object({
  layout: z.enum(['50-50', '60-40', '40-60']),
  leftBackgroundColor: HexColorSchema,
  rightBackgroundColor: HexColorSchema,
  leftBackgroundGradient: GradientSchema.nullish(),
  rightBackgroundGradient: GradientSchema.nullish(),
  columnGap: z.number().int().min(0).max(100),
  verticalAlign: z.enum(['top', 'middle', 'bottom']),
  padding: PaddingSchema,
  leftColumnPadding: PaddingSchema,
  rightColumnPadding: PaddingSchema,
});

export const SplitBackgroundBlockContentSchema = z.object({
  leftColumn: SplitColumnContentSchema,
  rightColumn: SplitColumnContentSchema,
});

export const SplitBackgroundBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('split-background'),
  position: z.number().int().min(0),
  settings: SplitBackgroundBlockSettingsSchema,
  content: SplitBackgroundBlockContentSchema,
});

// ============================================================================
// 23. Product Card Block
// ============================================================================

export const ProductCardBlockSettingsSchema = z.object({
  backgroundColor: HexColorSchema.nullish(),
  borderColor: HexColorSchema.nullish(),
  borderWidth: z.number().int().min(0).max(10).nullish(),
  borderRadius: PixelValueSchema.nullish(),
  padding: PaddingSchema,
  imagePosition: z.enum(['top', 'left']),
  imageWidth: z.string().regex(/^\d+%$/).nullish(),
  imageHeight: PixelValueSchema.nullish(),
  badgePosition: z.enum(['top-left', 'top-right']).nullish(),
  badgeBackgroundColor: HexColorSchema.nullish(),
  badgeTextColor: HexColorSchema.nullish(),
});

export const ProductCardBlockContentSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  imageAltText: z.string().max(200),
  badge: z.string().max(50).nullish(),
  heading: z.string().max(200),
  headingSize: PixelValueSchema.nullish(),
  headingColor: HexColorSchema.nullish(),
  description: z.string().max(500).nullish(),
  descriptionSize: PixelValueSchema.nullish(),
  descriptionColor: HexColorSchema.nullish(),
  price: z.string().max(50).nullish(),
  priceSize: PixelValueSchema.nullish(),
  priceColor: HexColorSchema.nullish(),
  originalPrice: z.string().max(50).nullish(),
  buttonText: z.string().max(100).nullish(),
  buttonUrl: UrlOrMergeTagSchema.nullish(),
  buttonColor: HexColorSchema.nullish(),
  buttonTextColor: HexColorSchema.nullish(),
});

export const ProductCardBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('product-card'),
  position: z.number().int().min(0),
  settings: ProductCardBlockSettingsSchema,
  content: ProductCardBlockContentSchema,
});

// ============================================================================
// 24. Badge Overlay Block
// ============================================================================

export const BadgeOverlayBlockSettingsSchema = z.object({
  badgePosition: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']),
  badgeSize: z.enum(['small', 'medium', 'large']),
  badgeBackgroundColor: HexColorSchema,
  badgeTextColor: HexColorSchema,
  badgeFontSize: PixelValueSchema.nullish(),
  badgeFontWeight: z.number().int().min(100).max(900).nullish(),
  imageHeight: PixelValueSchema,
  borderRadius: PixelValueSchema.nullish(),
  padding: PaddingSchema,
});

export const BadgeOverlayBlockContentSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  imageAltText: z.string().max(200),
  badgeText: z.string().max(50),
  linkUrl: z.string().max(500).optional(),
});

export const BadgeOverlayBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('badge-overlay'),
  position: z.number().int().min(0),
  settings: BadgeOverlayBlockSettingsSchema,
  content: BadgeOverlayBlockContentSchema,
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
  TwoColumnBlockSchema,
  ImageOverlayBlockSchema,
  ImageGrid2x2BlockSchema,
  ImageGrid3x3BlockSchema,
  ImageCollageBlockSchema,
  ThreeColumnBlockSchema,
  ZigzagBlockSchema,
  SplitBackgroundBlockSchema,
  ProductCardBlockSchema,
  BadgeOverlayBlockSchema,
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
export type TwoColumnBlockType = z.infer<typeof TwoColumnBlockSchema>;
export type ImageOverlayBlockType = z.infer<typeof ImageOverlayBlockSchema>;
export type ImageGrid2x2BlockType = z.infer<typeof ImageGrid2x2BlockSchema>;
export type ImageGrid3x3BlockType = z.infer<typeof ImageGrid3x3BlockSchema>;
export type ImageCollageBlockType = z.infer<typeof ImageCollageBlockSchema>;
export type ThreeColumnBlockType = z.infer<typeof ThreeColumnBlockSchema>;
export type ZigzagBlockType = z.infer<typeof ZigzagBlockSchema>;
export type SplitBackgroundBlockType = z.infer<typeof SplitBackgroundBlockSchema>;
export type ProductCardBlockType = z.infer<typeof ProductCardBlockSchema>;
export type BadgeOverlayBlockType = z.infer<typeof BadgeOverlayBlockSchema>;
export type EmailBlockType = z.infer<typeof EmailBlockSchema>;
export type BlockEmailType = z.infer<typeof BlockEmailSchema>;
export type GlobalEmailSettingsType = z.infer<typeof GlobalEmailSettingsSchema>;

