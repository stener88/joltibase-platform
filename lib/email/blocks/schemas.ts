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
// COMPLEX LAYOUT BLOCKS
// ============================================================================

// ============================================================================
// 15. Two-Column Block
// ============================================================================

const TwoColumnContentSchema = z.object({
  type: z.enum(['image', 'text', 'rich-content']),
  imageUrl: UrlOrMergeTagSchema.optional(),
  imageAltText: z.string().max(200).optional(),
  text: z.string().max(1000).optional(),
  richContent: z.object({
    heading: z.string().max(200).optional(),
    headingSize: PixelValueSchema.optional(),
    headingColor: HexColorSchema.optional(),
    body: z.string().max(2000).optional(),
    bodySize: PixelValueSchema.optional(),
    bodyColor: HexColorSchema.optional(),
    buttonText: z.string().max(100).optional(),
    buttonUrl: UrlOrMergeTagSchema.optional(),
    buttonColor: HexColorSchema.optional(),
    buttonTextColor: HexColorSchema.optional(),
  }).optional(),
});

export const TwoColumnBlockSettingsSchema = z.object({
  layout: z.enum(['50-50', '60-40', '40-60', '70-30', '30-70']),
  verticalAlign: z.enum(['top', 'middle', 'bottom']),
  columnGap: z.number().int().min(0).max(100),
  backgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema,
  reverseOnMobile: z.boolean().optional(),
  leftColumnBackgroundColor: HexColorSchema.optional(),
  rightColumnBackgroundColor: HexColorSchema.optional(),
  leftColumnPadding: PaddingSchema.optional(),
  rightColumnPadding: PaddingSchema.optional(),
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
  overlayBackgroundColor: HexColorSchema.optional(),
  overlayBackgroundOpacity: z.number().int().min(0).max(100),
  overlayPadding: PaddingSchema,
  overlayBorderRadius: PixelValueSchema.optional(),
  imageHeight: PixelValueSchema,
  padding: PaddingSchema,
});

export const ImageOverlayBlockContentSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  imageAltText: z.string().max(200),
  heading: z.string().max(200).optional(),
  headingSize: PixelValueSchema.optional(),
  headingColor: HexColorSchema.optional(),
  subheading: z.string().max(300).optional(),
  subheadingSize: PixelValueSchema.optional(),
  subheadingColor: HexColorSchema.optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: UrlOrMergeTagSchema.optional(),
  buttonColor: HexColorSchema.optional(),
  buttonTextColor: HexColorSchema.optional(),
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
  borderRadius: PixelValueSchema.optional(),
  showCaptions: z.boolean(),
  captionFontSize: PixelValueSchema.optional(),
  captionColor: HexColorSchema.optional(),
  captionBackgroundColor: HexColorSchema.optional(),
  captionBackgroundOpacity: z.number().int().min(0).max(100).optional(),
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
  borderRadius: PixelValueSchema.optional(),
  showCaptions: z.boolean(),
  captionFontSize: PixelValueSchema.optional(),
  captionColor: HexColorSchema.optional(),
  captionBackgroundColor: HexColorSchema.optional(),
  captionBackgroundOpacity: z.number().int().min(0).max(100).optional(),
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
  borderRadius: PixelValueSchema.optional(),
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
  icon: z.string().max(10).optional(),
  imageUrl: UrlOrMergeTagSchema.optional(),
  imageAltText: z.string().max(200).optional(),
  heading: z.string().max(200).optional(),
  headingSize: PixelValueSchema.optional(),
  headingColor: HexColorSchema.optional(),
  body: z.string().max(1000).optional(),
  bodySize: PixelValueSchema.optional(),
  bodyColor: HexColorSchema.optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: UrlOrMergeTagSchema.optional(),
});

export const ThreeColumnBlockSettingsSchema = z.object({
  layout: z.enum(['equal', 'wide-center', 'wide-outer']),
  columnGap: z.number().int().min(0).max(100),
  verticalAlign: z.enum(['top', 'middle', 'bottom']),
  backgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema,
  columnBackgroundColor: HexColorSchema.optional(),
  columnPadding: PaddingSchema.optional(),
  columnBorderRadius: PixelValueSchema.optional(),
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
  headingSize: PixelValueSchema.optional(),
  headingColor: HexColorSchema.optional(),
  body: z.string().max(1000),
  bodySize: PixelValueSchema.optional(),
  bodyColor: HexColorSchema.optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: UrlOrMergeTagSchema.optional(),
  buttonColor: HexColorSchema.optional(),
  buttonTextColor: HexColorSchema.optional(),
});

export const ZigzagBlockSettingsSchema = z.object({
  imageWidth: z.enum(['40%', '50%', '60%']),
  columnGap: z.number().int().min(0).max(100),
  rowGap: z.number().int().min(0).max(100),
  verticalAlign: z.enum(['top', 'middle', 'bottom']),
  backgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema,
  imageBorderRadius: PixelValueSchema.optional(),
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
  heading: z.string().max(200).optional(),
  headingSize: PixelValueSchema.optional(),
  headingColor: HexColorSchema.optional(),
  body: z.string().max(1000).optional(),
  bodySize: PixelValueSchema.optional(),
  bodyColor: HexColorSchema.optional(),
  imageUrl: UrlOrMergeTagSchema.optional(),
  imageAltText: z.string().max(200).optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: UrlOrMergeTagSchema.optional(),
  buttonColor: HexColorSchema.optional(),
  buttonTextColor: HexColorSchema.optional(),
});

export const SplitBackgroundBlockSettingsSchema = z.object({
  layout: z.enum(['50-50', '60-40', '40-60']),
  leftBackgroundColor: HexColorSchema,
  rightBackgroundColor: HexColorSchema,
  leftBackgroundGradient: GradientSchema.optional(),
  rightBackgroundGradient: GradientSchema.optional(),
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
  backgroundColor: HexColorSchema.optional(),
  borderColor: HexColorSchema.optional(),
  borderWidth: z.number().int().min(0).max(10).optional(),
  borderRadius: PixelValueSchema.optional(),
  padding: PaddingSchema,
  imagePosition: z.enum(['top', 'left']),
  imageWidth: z.string().regex(/^\d+%$/).optional(),
  imageHeight: PixelValueSchema.optional(),
  badgePosition: z.enum(['top-left', 'top-right']).optional(),
  badgeBackgroundColor: HexColorSchema.optional(),
  badgeTextColor: HexColorSchema.optional(),
});

export const ProductCardBlockContentSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  imageAltText: z.string().max(200),
  badge: z.string().max(50).optional(),
  heading: z.string().max(200),
  headingSize: PixelValueSchema.optional(),
  headingColor: HexColorSchema.optional(),
  description: z.string().max(500).optional(),
  descriptionSize: PixelValueSchema.optional(),
  descriptionColor: HexColorSchema.optional(),
  price: z.string().max(50).optional(),
  priceSize: PixelValueSchema.optional(),
  priceColor: HexColorSchema.optional(),
  originalPrice: z.string().max(50).optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: UrlOrMergeTagSchema.optional(),
  buttonColor: HexColorSchema.optional(),
  buttonTextColor: HexColorSchema.optional(),
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
  badgeFontSize: PixelValueSchema.optional(),
  badgeFontWeight: z.number().int().min(100).max(900).optional(),
  imageHeight: PixelValueSchema,
  borderRadius: PixelValueSchema.optional(),
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
// ADVANCED BLOCKS (Gemini-Enabled: Complex Nested Structures)
// ============================================================================

// ============================================================================
// 25. Carousel Block
// ============================================================================

const CarouselSlideSchema = z.object({
  imageUrl: UrlOrMergeTagSchema,
  imageAltText: z.string().max(200),
  heading: z.string().max(200).optional(),
  headingSize: PixelValueSchema.optional(),
  headingColor: HexColorSchema.optional(),
  text: z.string().max(500).optional(),
  textSize: PixelValueSchema.optional(),
  textColor: HexColorSchema.optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: UrlOrMergeTagSchema.optional(),
  buttonColor: HexColorSchema.optional(),
  buttonTextColor: HexColorSchema.optional(),
});

export const CarouselBlockSettingsSchema = z.object({
  slideHeight: PixelValueSchema,
  showIndicators: z.boolean().default(true),
  indicatorColor: HexColorSchema,
  indicatorActiveColor: HexColorSchema,
  autoPlay: z.boolean().default(false),
  autoPlayInterval: z.number().int().min(2000).max(10000).default(5000),
  borderRadius: PixelValueSchema.optional(),
  padding: PaddingSchema,
});

export const CarouselBlockContentSchema = z.object({
  slides: z.array(CarouselSlideSchema).min(2).max(10),
});

export const CarouselBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('carousel'),
  position: z.number().int().min(0),
  settings: CarouselBlockSettingsSchema,
  content: CarouselBlockContentSchema,
});

// ============================================================================
// 26. Tab Container Block
// ============================================================================

const TabItemSchema = z.object({
  label: z.string().min(1).max(100),
  icon: z.string().max(10).optional(),
  heading: z.string().max(200).optional(),
  text: z.string().max(2000).optional(),
  imageUrl: UrlOrMergeTagSchema.optional(),
  imageAltText: z.string().max(200).optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: UrlOrMergeTagSchema.optional(),
});

export const TabContainerBlockSettingsSchema = z.object({
  tabStyle: z.enum(['pills', 'underline', 'bordered']).default('pills'),
  tabPosition: z.enum(['top', 'left']).default('top'),
  activeTabColor: HexColorSchema,
  activeTabTextColor: HexColorSchema,
  inactiveTabColor: HexColorSchema.optional(),
  inactiveTabTextColor: HexColorSchema,
  contentBackgroundColor: HexColorSchema.optional(),
  contentPadding: PaddingSchema,
  padding: PaddingSchema,
});

export const TabContainerBlockContentSchema = z.object({
  tabs: z.array(TabItemSchema).min(2).max(8),
});

export const TabContainerBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('tab-container'),
  position: z.number().int().min(0),
  settings: TabContainerBlockSettingsSchema,
  content: TabContainerBlockContentSchema,
});

// ============================================================================
// 27. Accordion Block
// ============================================================================

const AccordionItemSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(2000),
  icon: z.string().max(10).optional(),
  defaultOpen: z.boolean().default(false),
});

export const AccordionBlockSettingsSchema = z.object({
  allowMultiple: z.boolean().default(false),
  titleFontSize: PixelValueSchema,
  titleFontWeight: z.number().int().min(100).max(900),
  titleColor: HexColorSchema,
  contentFontSize: PixelValueSchema,
  contentColor: HexColorSchema,
  borderColor: HexColorSchema.optional(),
  borderWidth: z.number().int().min(0).max(5).default(1),
  backgroundColor: HexColorSchema.optional(),
  expandedBackgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema,
  itemSpacing: z.number().int().min(0).max(50).default(16),
});

export const AccordionBlockContentSchema = z.object({
  items: z.array(AccordionItemSchema).min(2).max(10),
});

export const AccordionBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('accordion'),
  position: z.number().int().min(0),
  settings: AccordionBlockSettingsSchema,
  content: AccordionBlockContentSchema,
});

// ============================================================================
// 28. Masonry Grid Block
// ============================================================================

const MasonryItemSchema = z.object({
  type: z.enum(['image', 'text', 'card']),
  imageUrl: UrlOrMergeTagSchema.optional(),
  imageAltText: z.string().max(200).optional(),
  heading: z.string().max(200).optional(),
  text: z.string().max(1000).optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: UrlOrMergeTagSchema.optional(),
  backgroundColor: HexColorSchema.optional(),
  height: z.enum(['auto', 'small', 'medium', 'large']).default('auto'),
});

export const MasonryGridBlockSettingsSchema = z.object({
  columns: z.number().int().min(2).max(5).default(3),
  gap: z.number().int().min(0).max(50).default(16),
  itemBorderRadius: PixelValueSchema.optional(),
  itemPadding: PaddingSchema.optional(),
  padding: PaddingSchema,
});

export const MasonryGridBlockContentSchema = z.object({
  items: z.array(MasonryItemSchema).min(2).max(20),
});

export const MasonryGridBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('masonry-grid'),
  position: z.number().int().min(0),
  settings: MasonryGridBlockSettingsSchema,
  content: MasonryGridBlockContentSchema,
});

// ============================================================================
// 29. Dynamic Column Block
// ============================================================================

const DynamicColumnItemSchema = z.object({
  width: z.enum(['auto', '20%', '25%', '30%', '33%', '40%', '50%', '60%', '70%', '75%', '80%']).default('auto'),
  imageUrl: UrlOrMergeTagSchema.optional(),
  imageAltText: z.string().max(200).optional(),
  icon: z.string().max(10).optional(),
  heading: z.string().max(200).optional(),
  headingSize: PixelValueSchema.optional(),
  text: z.string().max(1000).optional(),
  textSize: PixelValueSchema.optional(),
  buttonText: z.string().max(100).optional(),
  buttonUrl: UrlOrMergeTagSchema.optional(),
  backgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema.optional(),
});

export const DynamicColumnBlockSettingsSchema = z.object({
  columnCount: z.number().int().min(2).max(5).default(3),
  columnGap: z.number().int().min(0).max(100).default(24),
  verticalAlign: z.enum(['top', 'middle', 'bottom']).default('top'),
  mobileStack: z.boolean().default(true),
  backgroundColor: HexColorSchema.optional(),
  padding: PaddingSchema,
});

export const DynamicColumnBlockContentSchema = z.object({
  columns: z.array(DynamicColumnItemSchema).min(2).max(5),
});

export const DynamicColumnBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('dynamic-column'),
  position: z.number().int().min(0),
  settings: DynamicColumnBlockSettingsSchema,
  content: DynamicColumnBlockContentSchema,
});

// ============================================================================
// 30. Container Block (Blocks within Blocks!)
// ============================================================================

// Forward reference for recursive schema
// This allows blocks to contain other blocks - powerful Gemini feature!
const ContainerChildBlockSchema: z.ZodType<any> = z.lazy(() => EmailBlockSchema);

export const ContainerBlockSettingsSchema = z.object({
  layout: z.enum(['stack', 'grid', 'flex']).default('stack'),
  gridColumns: z.number().int().min(1).max(4).default(2),
  gap: z.number().int().min(0).max(100).default(24),
  backgroundColor: HexColorSchema.optional(),
  borderColor: HexColorSchema.optional(),
  borderWidth: z.number().int().min(0).max(10).default(0),
  borderRadius: PixelValueSchema.optional(),
  padding: PaddingSchema,
});

export const ContainerBlockContentSchema = z.object({
  children: z.array(ContainerChildBlockSchema).min(1).max(10),
});

export const ContainerBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal('container'),
  position: z.number().int().min(0),
  settings: ContainerBlockSettingsSchema,
  content: ContainerBlockContentSchema,
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
  // Advanced blocks (Gemini-enabled)
  CarouselBlockSchema,
  TabContainerBlockSchema,
  AccordionBlockSchema,
  MasonryGridBlockSchema,
  DynamicColumnBlockSchema,
  ContainerBlockSchema,
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
export type CarouselBlockType = z.infer<typeof CarouselBlockSchema>;
export type TabContainerBlockType = z.infer<typeof TabContainerBlockSchema>;
export type AccordionBlockType = z.infer<typeof AccordionBlockSchema>;
export type MasonryGridBlockType = z.infer<typeof MasonryGridBlockSchema>;
export type DynamicColumnBlockType = z.infer<typeof DynamicColumnBlockSchema>;
export type ContainerBlockType = z.infer<typeof ContainerBlockSchema>;
export type EmailBlockType = z.infer<typeof EmailBlockSchema>;
export type BlockEmailType = z.infer<typeof BlockEmailSchema>;
export type GlobalEmailSettingsType = z.infer<typeof GlobalEmailSettingsSchema>;

