/**
 * Email Block System - Type Definitions
 * 
 * Block-based architecture for visual email editing with AI generation.
 * Uses hardcoded pixel values for granular AI control and data-driven optimization.
 * 
 * NOTE: Types are derived from Zod schemas to ensure consistency.
 * Optional fields use `| null` to match `.nullish()` schemas for OpenAI compatibility.
 */

import type {
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
  EmailBlockSchema,
  BlockEmailSchema,
  GlobalEmailSettingsSchema,
} from './schemas';
import type { z } from 'zod';

// ============================================================================
// Core Block Types
// ============================================================================

export type BlockType =
  | 'logo'
  | 'spacer'
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'hero'
  | 'stats'
  | 'testimonial'
  | 'feature-grid'
  | 'comparison'
  | 'social-links'
  | 'footer'
  // Complex Layout Blocks
  | 'two-column'
  | 'image-overlay'
  | 'image-grid-2x2'
  | 'image-grid-3x3'
  | 'image-collage'
  | 'three-column'
  | 'zigzag'
  | 'split-background'
  | 'product-card'
  | 'badge-overlay'
  // Advanced Interactive Blocks (Gemini-powered)
  | 'carousel'
  | 'tab-container'
  | 'accordion'
  | 'masonry-grid'
  | 'dynamic-column'
  | 'container';

/**
 * Base block interface - all blocks extend this
 */
export interface EmailBlock {
  id: string;
  type: BlockType;
  position: number;
  settings: BlockSettings;
  content: BlockContent;
}

/**
 * Union type for all block settings
 */
export type BlockSettings =
  | LogoBlockSettings
  | SpacerBlockSettings
  | HeadingBlockSettings
  | TextBlockSettings
  | ImageBlockSettings
  | ButtonBlockSettings
  | DividerBlockSettings
  | HeroBlockSettings
  | StatsBlockSettings
  | TestimonialBlockSettings
  | FeatureGridBlockSettings
  | ComparisonBlockSettings
  | SocialLinksBlockSettings
  | FooterBlockSettings
  | TwoColumnBlockSettings
  | ImageOverlayBlockSettings
  | ImageGrid2x2BlockSettings
  | ImageGrid3x3BlockSettings
  | ImageCollageBlockSettings
  | ThreeColumnBlockSettings
  | ZigzagBlockSettings
  | SplitBackgroundBlockSettings
  | ProductCardBlockSettings
  | BadgeOverlayBlockSettings
  // Advanced blocks (Gemini-enabled)
  | CarouselBlockSettings
  | TabContainerBlockSettings
  | AccordionBlockSettings
  | MasonryGridBlockSettings
  | DynamicColumnBlockSettings
  | ContainerBlockSettings;

/**
 * Union type for all block content
 */
export type BlockContent =
  | LogoBlockContent
  | SpacerBlockContent
  | HeadingBlockContent
  | TextBlockContent
  | ImageBlockContent
  | ButtonBlockContent
  | DividerBlockContent
  | HeroBlockContent
  | StatsBlockContent
  | TestimonialBlockContent
  | FeatureGridBlockContent
  | ComparisonBlockContent
  | SocialLinksBlockContent
  | FooterBlockContent
  | TwoColumnBlockContent
  | ImageOverlayBlockContent
  | ImageGrid2x2BlockContent
  | ImageGrid3x3BlockContent
  | ImageCollageBlockContent
  | ThreeColumnBlockContent
  | ZigzagBlockContent
  | SplitBackgroundBlockContent
  | ProductCardBlockContent
  | BadgeOverlayBlockContent
  // Advanced blocks (Gemini-enabled)
  | CarouselBlockContent
  | TabContainerBlockContent
  | AccordionBlockContent
  | MasonryGridBlockContent
  | DynamicColumnBlockContent
  | ContainerBlockContent;

// ============================================================================
// Common Types
// ============================================================================

export interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type Alignment = 'left' | 'center' | 'right';

// ============================================================================
// 1. Logo Block
// ============================================================================

export interface LogoBlock extends EmailBlock {
  type: 'logo';
  settings: LogoBlockSettings;
  content: LogoBlockContent;
}

export interface LogoBlockSettings {
  align: Alignment;
  width: string; // '120px', '150px', '200px'
  height?: string | null; // 'auto' or specific height (nullish for OpenAI compatibility)
  backgroundColor?: string | null; // nullish for OpenAI compatibility
  padding: Padding;
}

export interface LogoBlockContent {
  imageUrl: string;
  altText: string;
  linkUrl?: string | null; // nullish for OpenAI compatibility
}

// ============================================================================
// 2. Spacer Block
// ============================================================================

export interface SpacerBlock extends EmailBlock {
  type: 'spacer';
  settings: SpacerBlockSettings;
  content: SpacerBlockContent;
}

export interface SpacerBlockSettings {
  height: number; // 20, 40, 60, 80
  backgroundColor?: string | null; // nullish for OpenAI compatibility
}

export interface SpacerBlockContent {
  // Spacer has no editable content
}

// ============================================================================
// 3. Heading Block
// ============================================================================

export interface HeadingBlock extends EmailBlock {
  type: 'heading';
  settings: HeadingBlockSettings;
  content: HeadingBlockContent;
}

export interface HeadingBlockSettings {
  fontSize: string; // '44px', '56px', '70px'
  fontWeight: number; // 700, 800, 900
  color: string; // '#111827', '#2563eb'
  align: Alignment;
  backgroundColor?: string | null; // nullish for OpenAI compatibility
  padding: Padding;
  lineHeight: string; // '1.1', '1.2', '1.3'
  letterSpacing?: string | null; // '-0.02em', '-0.03em' (nullish for OpenAI compatibility)
}

export interface HeadingBlockContent {
  text: string;
}

// ============================================================================
// 4. Text Block
// ============================================================================

export interface TextBlock extends EmailBlock {
  type: 'text';
  settings: TextBlockSettings;
  content: TextBlockContent;
}

export interface TextBlockSettings {
  fontSize: string; // '14px', '16px', '18px'
  fontWeight: number; // 400, 500, 600
  color: string;
  align: Alignment;
  backgroundColor?: string | null; // nullish for OpenAI compatibility
  padding: Padding;
  lineHeight: string; // '1.5', '1.6', '1.8'
}

export interface TextBlockContent {
  text: string; // Can include HTML for bold, italic, links
}

// ============================================================================
// 5. Image Block
// ============================================================================

export interface ImageBlock extends EmailBlock {
  type: 'image';
  settings: ImageBlockSettings;
  content: ImageBlockContent;
}

export interface ImageBlockSettings {
  align: Alignment;
  width: string; // '100%', '300px', '400px'
  height?: string | null; // 'auto' or specific (nullish for OpenAI compatibility)
  borderRadius?: string | null; // '0px', '4px', '8px' (nullish for OpenAI compatibility)
  padding: Padding;
}

export interface ImageBlockContent {
  imageUrl: string;
  altText: string;
  linkUrl?: string | null; // nullish for OpenAI compatibility
  caption?: string | null; // nullish for OpenAI compatibility
}

// ============================================================================
// 6. Button Block
// ============================================================================

export interface ButtonBlock extends EmailBlock {
  type: 'button';
  settings: ButtonBlockSettings;
  content: ButtonBlockContent;
}

export interface ButtonBlockSettings {
  style: 'solid' | 'outline' | 'ghost';
  color: string; // Button background color
  textColor: string; // Button text color
  align: Alignment;
  size: 'small' | 'medium' | 'large';
  borderRadius: string; // '4px', '6px', '24px'
  fontSize: string; // '14px', '16px', '18px'
  fontWeight: number; // 600, 700
  padding: Padding; // Button padding
  containerPadding: Padding; // Padding around button
}

export interface ButtonBlockContent {
  text: string;
  url: string;
}

// ============================================================================
// 7. Divider Block
// ============================================================================

export interface DividerBlock extends EmailBlock {
  type: 'divider';
  settings: DividerBlockSettings;
  content: DividerBlockContent;
}

export interface DividerBlockSettings {
  style: 'solid' | 'dashed' | 'dotted' | 'decorative';
  color?: string | null; // For line styles (nullish for OpenAI compatibility)
  thickness?: number | null; // 1, 2, 3 (pixels) (nullish for OpenAI compatibility)
  width?: string | null; // '100%', '60px' for decorative (nullish for OpenAI compatibility)
  padding: Padding;
  align?: Alignment | null; // For decorative dividers (nullish for OpenAI compatibility)
}

export interface DividerBlockContent {
  decorativeElement?: string | null; // Emoji or symbol for decorative style (nullish for OpenAI compatibility)
}

// ============================================================================
// 8. Hero Block
// ============================================================================

export interface HeroBlock extends EmailBlock {
  type: 'hero';
  settings: HeroBlockSettings;
  content: HeroBlockContent;
}

export interface HeroBlockSettings {
  backgroundColor?: string | null; // nullish for OpenAI compatibility
  backgroundGradient?: {
    from: string;
    to: string;
    direction: 'to-right' | 'to-bottom' | 'to-br' | 'to-tr';
  } | null; // nullish for OpenAI compatibility
  padding: Padding;
  align: Alignment;
  headlineFontSize: string; // '56px', '70px', '100px'
  headlineFontWeight: number; // 800, 900
  headlineColor: string;
  subheadlineFontSize: string; // '18px', '20px', '24px'
  subheadlineColor: string;
}

export interface HeroBlockContent {
  headline: string;
  subheadline?: string | null; // nullish for OpenAI compatibility
  imageUrl?: string | null; // nullish for OpenAI compatibility
}

// ============================================================================
// 9. Stats Block
// ============================================================================

export interface StatsBlock extends EmailBlock {
  type: 'stats';
  settings: StatsBlockSettings;
  content: StatsBlockContent;
}

export interface StatsBlockSettings {
  layout: '2-col' | '3-col' | '4-col';
  align: Alignment;
  valueFontSize: string; // '64px', '80px', '100px'
  valueFontWeight: number; // 900
  valueColor: string;
  labelFontSize: string; // '14px', '16px'
  labelFontWeight: number; // 600
  labelColor: string;
  padding: Padding;
  spacing: number; // Gap between stats (32, 48, 64)
}

export interface StatsBlockContent {
  stats: Array<{
    value: string; // '10,000+', '99.9%', '$1M'
    label: string; // 'Active Users', 'Uptime'
  }>;
}

// ============================================================================
// 10. Testimonial Block
// ============================================================================

export interface TestimonialBlock extends EmailBlock {
  type: 'testimonial';
  settings: TestimonialBlockSettings;
  content: TestimonialBlockContent;
}

export interface TestimonialBlockSettings {
  backgroundColor?: string | null; // nullish for OpenAI compatibility
  borderColor?: string | null; // nullish for OpenAI compatibility
  borderWidth?: number | null; // 0, 2, 4 (nullish for OpenAI compatibility)
  borderRadius?: string | null; // '4px', '8px' (nullish for OpenAI compatibility)
  padding: Padding;
  quoteFontSize: string; // '16px', '18px', '20px'
  quoteColor: string;
  quoteFontStyle: 'normal' | 'italic';
  authorFontSize: string; // '14px', '16px'
  authorColor: string;
  authorFontWeight: number; // 600, 700
}

export interface TestimonialBlockContent {
  quote: string;
  author: string;
  role?: string | null; // nullish for OpenAI compatibility
  company?: string | null; // nullish for OpenAI compatibility
  avatarUrl?: string | null; // nullish for OpenAI compatibility
}

// ============================================================================
// 11. Feature Grid Block
// ============================================================================

export interface FeatureGridBlock extends EmailBlock {
  type: 'feature-grid';
  settings: FeatureGridBlockSettings;
  content: FeatureGridBlockContent;
}

export interface FeatureGridBlockSettings {
  layout: '2-col' | '3-col' | 'single-col';
  align: Alignment;
  iconSize: string; // '32px', '48px', '64px'
  titleFontSize: string; // '18px', '20px', '24px'
  titleFontWeight: number; // 600, 700
  titleColor: string;
  descriptionFontSize: string; // '14px', '16px'
  descriptionColor: string;
  padding: Padding;
  spacing: number; // Gap between features (24, 32, 48)
}

export interface FeatureGridBlockContent {
  features: Array<{
    icon?: string | null; // Emoji or icon character (nullish for OpenAI compatibility)
    title: string;
    description: string;
  }>;
}

// ============================================================================
// 12. Comparison Block
// ============================================================================

export interface ComparisonBlock extends EmailBlock {
  type: 'comparison';
  settings: ComparisonBlockSettings;
  content: ComparisonBlockContent;
}

export interface ComparisonBlockSettings {
  beforeBackgroundColor: string; // '#fef2f2' (red tint)
  afterBackgroundColor: string; // '#f0fdf4' (green tint)
  beforeLabelColor: string; // '#dc2626'
  afterLabelColor: string; // '#16a34a'
  labelFontSize: string; // '12px', '14px'
  labelFontWeight: number; // 600, 700
  contentFontSize: string; // '14px', '16px'
  contentColor: string;
  borderRadius?: string | null; // '4px', '8px' (nullish for OpenAI compatibility)
  padding: Padding;
  cellPadding: number; // Inner cell padding (16, 20, 24)
}

export interface ComparisonBlockContent {
  before: {
    label?: string | null; // Default: 'Before' (nullish for OpenAI compatibility)
    text: string;
  };
  after: {
    label?: string | null; // Default: 'After' (nullish for OpenAI compatibility)
    text: string;
  };
}

// ============================================================================
// 13. Social Links Block
// ============================================================================

export interface SocialLinksBlock extends EmailBlock {
  type: 'social-links';
  settings: SocialLinksBlockSettings;
  content: SocialLinksBlockContent;
}

export interface SocialLinksBlockSettings {
  align: Alignment;
  iconSize: string; // '24px', '32px', '40px'
  spacing: number; // Gap between icons (12, 16, 24)
  iconStyle: 'color' | 'monochrome' | 'outline';
  iconColor?: string | null; // For monochrome style (nullish for OpenAI compatibility)
  padding: Padding;
}

export interface SocialLinksBlockContent {
  links: Array<{
    platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube' | 'github' | 'tiktok';
    url: string;
  }>;
}

// ============================================================================
// 14. Footer Block
// ============================================================================

export interface FooterBlock extends EmailBlock {
  type: 'footer';
  settings: FooterBlockSettings;
  content: FooterBlockContent;
}

export interface FooterBlockSettings {
  backgroundColor?: string | null; // nullish for OpenAI compatibility
  textColor: string;
  fontSize: string; // '12px', '14px'
  align: Alignment;
  padding: Padding;
  lineHeight: string; // '1.5', '1.6'
  linkColor?: string | null; // nullish for OpenAI compatibility
}

export interface FooterBlockContent {
  companyName: string;
  companyAddress?: string | null; // nullish for OpenAI compatibility
  customText?: string | null; // nullish for OpenAI compatibility
  unsubscribeUrl: string; // '{{unsubscribe_url}}'
  preferencesUrl?: string | null; // '{{preferences_url}}' (nullish for OpenAI compatibility)
}

// ============================================================================
// COMPLEX LAYOUT BLOCKS
// ============================================================================

// ============================================================================
// 15. Two-Column Block
// ============================================================================

export interface TwoColumnBlock extends EmailBlock {
  type: 'two-column';
  settings: TwoColumnBlockSettings;
  content: TwoColumnBlockContent;
}

export interface TwoColumnBlockSettings {
  layout: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  verticalAlign: 'top' | 'middle' | 'bottom';
  columnGap: number; // 16, 24, 32, 48
  backgroundColor?: string | null;
  padding: Padding;
  reverseOnMobile?: boolean; // Stack columns in reverse order on mobile
  leftColumnBackgroundColor?: string | null;
  rightColumnBackgroundColor?: string | null;
  leftColumnPadding?: Padding | null;
  rightColumnPadding?: Padding | null;
}

export interface TwoColumnBlockContent {
  leftColumn: {
    type: 'image' | 'text' | 'rich-content';
    imageUrl?: string | null;
    imageAltText?: string | null;
    text?: string | null; // Simple text
    richContent?: {
      heading?: string | null;
      headingSize?: string | null; // '24px', '32px', '44px'
      headingColor?: string | null;
      body?: string | null;
      bodySize?: string | null; // '14px', '16px', '18px'
      bodyColor?: string | null;
      buttonText?: string | null;
      buttonUrl?: string | null;
      buttonColor?: string | null;
      buttonTextColor?: string | null;
    } | null;
  };
  rightColumn: {
    type: 'image' | 'text' | 'rich-content';
    imageUrl?: string | null;
    imageAltText?: string | null;
    text?: string | null;
    richContent?: {
      heading?: string | null;
      headingSize?: string | null;
      headingColor?: string | null;
      body?: string | null;
      bodySize?: string | null;
      bodyColor?: string | null;
      buttonText?: string | null;
      buttonUrl?: string | null;
      buttonColor?: string | null;
      buttonTextColor?: string | null;
    } | null;
  };
}

// ============================================================================
// 16. Image Overlay Block
// ============================================================================

export interface ImageOverlayBlock extends EmailBlock {
  type: 'image-overlay';
  settings: ImageOverlayBlockSettings;
  content: ImageOverlayBlockContent;
}

export interface ImageOverlayBlockSettings {
  overlayPosition: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-bottom';
  overlayBackgroundColor?: string | null;
  overlayBackgroundOpacity: number; // 0-100
  overlayPadding: Padding;
  overlayBorderRadius?: string | null; // '0px', '8px', '16px'
  imageHeight: string; // '300px', '400px', '500px'
  padding: Padding;
}

export interface ImageOverlayBlockContent {
  imageUrl: string;
  imageAltText: string;
  heading?: string | null;
  headingSize?: string | null; // '24px', '32px', '44px'
  headingColor?: string | null;
  subheading?: string | null;
  subheadingSize?: string | null;
  subheadingColor?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  buttonColor?: string | null;
  buttonTextColor?: string | null;
}

// ============================================================================
// 17. Image Grid 2x2 Block
// ============================================================================

export interface ImageGrid2x2Block extends EmailBlock {
  type: 'image-grid-2x2';
  settings: ImageGrid2x2BlockSettings;
  content: ImageGrid2x2BlockContent;
}

export interface ImageGrid2x2BlockSettings {
  gridGap: number; // 8, 12, 16, 24
  imageHeight: string; // '150px', '200px', '250px'
  borderRadius?: string | null; // '0px', '4px', '8px'
  showCaptions: boolean;
  captionFontSize?: string | null; // '12px', '14px'
  captionColor?: string | null;
  captionBackgroundColor?: string | null;
  captionBackgroundOpacity?: number | null; // 0-100
  padding: Padding;
}

export interface ImageGrid2x2BlockContent {
  images: [
    {
      imageUrl: string;
      altText: string;
      caption?: string | null;
      linkUrl?: string | null;
    },
    {
      imageUrl: string;
      altText: string;
      caption?: string | null;
      linkUrl?: string | null;
    },
    {
      imageUrl: string;
      altText: string;
      caption?: string | null;
      linkUrl?: string | null;
    },
    {
      imageUrl: string;
      altText: string;
      caption?: string | null;
      linkUrl?: string | null;
    }
  ];
}

// ============================================================================
// 18. Image Grid 3x3 Block
// ============================================================================

export interface ImageGrid3x3Block extends EmailBlock {
  type: 'image-grid-3x3';
  settings: ImageGrid3x3BlockSettings;
  content: ImageGrid3x3BlockContent;
}

export interface ImageGrid3x3BlockSettings {
  gridGap: number; // 4, 8, 12, 16
  imageHeight: string; // '100px', '120px', '150px'
  borderRadius?: string | null; // '0px', '4px', '8px'
  showCaptions: boolean;
  captionFontSize?: string | null; // '10px', '12px'
  captionColor?: string | null;
  captionBackgroundColor?: string | null;
  captionBackgroundOpacity?: number | null; // 0-100
  padding: Padding;
}

export interface ImageGrid3x3BlockContent {
  images: Array<{
    imageUrl: string;
    altText: string;
    caption?: string | null;
    linkUrl?: string | null;
  }>; // Must have 9 images
}

// ============================================================================
// 19. Image Collage Block (Asymmetric)
// ============================================================================

export interface ImageCollageBlock extends EmailBlock {
  type: 'image-collage';
  settings: ImageCollageBlockSettings;
  content: ImageCollageBlockContent;
}

export interface ImageCollageBlockSettings {
  layout: 'featured-left' | 'featured-right' | 'featured-center';
  gridGap: number; // 8, 12, 16
  borderRadius?: string | null; // '0px', '4px', '8px'
  padding: Padding;
}

export interface ImageCollageBlockContent {
  // Featured image takes up more space (e.g., 60%)
  featuredImage: {
    imageUrl: string;
    altText: string;
    linkUrl?: string | null;
  };
  // Secondary images (3-4 smaller images)
  secondaryImages: Array<{
    imageUrl: string;
    altText: string;
    linkUrl?: string | null;
  }>;
}

// ============================================================================
// 20. Three-Column Block
// ============================================================================

export interface ThreeColumnBlock extends EmailBlock {
  type: 'three-column';
  settings: ThreeColumnBlockSettings;
  content: ThreeColumnBlockContent;
}

export interface ThreeColumnBlockSettings {
  layout: 'equal' | 'wide-center' | 'wide-outer';
  columnGap: number; // 12, 16, 24, 32
  verticalAlign: 'top' | 'middle' | 'bottom';
  backgroundColor?: string | null;
  padding: Padding;
  columnBackgroundColor?: string | null;
  columnPadding?: Padding | null;
  columnBorderRadius?: string | null;
}

export interface ThreeColumnBlockContent {
  columns: [
    {
      icon?: string | null; // Emoji or icon
      imageUrl?: string | null;
      imageAltText?: string | null;
      heading?: string | null;
      headingSize?: string | null;
      headingColor?: string | null;
      body?: string | null;
      bodySize?: string | null;
      bodyColor?: string | null;
      buttonText?: string | null;
      buttonUrl?: string | null;
    },
    {
      icon?: string | null;
      imageUrl?: string | null;
      imageAltText?: string | null;
      heading?: string | null;
      headingSize?: string | null;
      headingColor?: string | null;
      body?: string | null;
      bodySize?: string | null;
      bodyColor?: string | null;
      buttonText?: string | null;
      buttonUrl?: string | null;
    },
    {
      icon?: string | null;
      imageUrl?: string | null;
      imageAltText?: string | null;
      heading?: string | null;
      headingSize?: string | null;
      headingColor?: string | null;
      body?: string | null;
      bodySize?: string | null;
      bodyColor?: string | null;
      buttonText?: string | null;
      buttonUrl?: string | null;
    }
  ];
}

// ============================================================================
// 21. Zigzag/Alternating Block
// ============================================================================

export interface ZigzagBlock extends EmailBlock {
  type: 'zigzag';
  settings: ZigzagBlockSettings;
  content: ZigzagBlockContent;
}

export interface ZigzagBlockSettings {
  imageWidth: '40%' | '50%' | '60%';
  columnGap: number; // 24, 32, 48
  rowGap: number; // 32, 48, 64
  verticalAlign: 'top' | 'middle' | 'bottom';
  backgroundColor?: string | null;
  padding: Padding;
  imageBorderRadius?: string | null;
}

export interface ZigzagBlockContent {
  rows: Array<{
    imageUrl: string;
    imageAltText: string;
    heading: string;
    headingSize?: string | null;
    headingColor?: string | null;
    body: string;
    bodySize?: string | null;
    bodyColor?: string | null;
    buttonText?: string | null;
    buttonUrl?: string | null;
    buttonColor?: string | null;
    buttonTextColor?: string | null;
  }>; // 2-4 rows
}

// ============================================================================
// 22. Split Background Two-Column Block
// ============================================================================

export interface SplitBackgroundBlock extends EmailBlock {
  type: 'split-background';
  settings: SplitBackgroundBlockSettings;
  content: SplitBackgroundBlockContent;
}

export interface SplitBackgroundBlockSettings {
  layout: '50-50' | '60-40' | '40-60';
  leftBackgroundColor: string;
  rightBackgroundColor: string;
  leftBackgroundGradient?: {
    from: string;
    to: string;
    direction: 'to-right' | 'to-bottom' | 'to-br';
  } | null;
  rightBackgroundGradient?: {
    from: string;
    to: string;
    direction: 'to-right' | 'to-bottom' | 'to-br';
  } | null;
  columnGap: number; // 0, 16, 24, 32
  verticalAlign: 'top' | 'middle' | 'bottom';
  padding: Padding;
  leftColumnPadding: Padding;
  rightColumnPadding: Padding;
}

export interface SplitBackgroundBlockContent {
  leftColumn: {
    heading?: string | null;
    headingSize?: string | null;
    headingColor?: string | null;
    body?: string | null;
    bodySize?: string | null;
    bodyColor?: string | null;
    imageUrl?: string | null;
    imageAltText?: string | null;
    buttonText?: string | null;
    buttonUrl?: string | null;
    buttonColor?: string | null;
    buttonTextColor?: string | null;
  };
  rightColumn: {
    heading?: string | null;
    headingSize?: string | null;
    headingColor?: string | null;
    body?: string | null;
    bodySize?: string | null;
    bodyColor?: string | null;
    imageUrl?: string | null;
    imageAltText?: string | null;
    buttonText?: string | null;
    buttonUrl?: string | null;
    buttonColor?: string | null;
    buttonTextColor?: string | null;
  };
}

// ============================================================================
// 23. Product Card Block
// ============================================================================

export interface ProductCardBlock extends EmailBlock {
  type: 'product-card';
  settings: ProductCardBlockSettings;
  content: ProductCardBlockContent;
}

export interface ProductCardBlockSettings {
  backgroundColor?: string | null;
  borderColor?: string | null;
  borderWidth?: number | null; // 0, 1, 2
  borderRadius?: string | null; // '0px', '8px', '16px'
  padding: Padding;
  imagePosition: 'top' | 'left'; // Image on top or left side
  imageWidth?: string | null; // '40%', '50%' (for left position)
  imageHeight?: string | null; // '200px', '250px', '300px' (for top position)
  badgePosition?: 'top-left' | 'top-right' | null;
  badgeBackgroundColor?: string | null;
  badgeTextColor?: string | null;
}

export interface ProductCardBlockContent {
  imageUrl: string;
  imageAltText: string;
  badge?: string | null; // 'New', 'Sale', '20% OFF'
  heading: string;
  headingSize?: string | null;
  headingColor?: string | null;
  description?: string | null;
  descriptionSize?: string | null;
  descriptionColor?: string | null;
  price?: string | null;
  priceSize?: string | null;
  priceColor?: string | null;
  originalPrice?: string | null; // Strikethrough price
  buttonText?: string | null;
  buttonUrl?: string | null;
  buttonColor?: string | null;
  buttonTextColor?: string | null;
}

// ============================================================================
// 24. Badge Overlay Block
// ============================================================================

export interface BadgeOverlayBlock extends EmailBlock {
  type: 'badge-overlay';
  settings: BadgeOverlayBlockSettings;
  content: BadgeOverlayBlockContent;
}

export interface BadgeOverlayBlockSettings {
  badgePosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  badgeSize: 'small' | 'medium' | 'large'; // Circular badge dimensions
  badgeBackgroundColor: string;
  badgeTextColor: string;
  badgeFontSize?: string | null;
  badgeFontWeight?: number | null;
  imageHeight: string; // '300px', '400px', '500px'
  borderRadius?: string | null;
  padding: Padding;
}

export interface BadgeOverlayBlockContent {
  imageUrl: string;
  imageAltText: string;
  badgeText: string; // 'New', '50%', 'Sale', '★ 4.9'
  linkUrl?: string | null;
}

// ============================================================================
// Typed Block Interfaces (for type guards)
// ============================================================================

/**
 * Type guard to check if a block is a specific type
 */
export function isBlockType<T extends EmailBlock>(
  block: EmailBlock,
  type: BlockType
): block is T {
  return block.type === type;
}

/**
 * Get typed block by type
 */
export type TypedBlock<T extends BlockType> = 
  T extends 'logo' ? LogoBlock :
  T extends 'spacer' ? SpacerBlock :
  T extends 'heading' ? HeadingBlock :
  T extends 'text' ? TextBlock :
  T extends 'image' ? ImageBlock :
  T extends 'button' ? ButtonBlock :
  T extends 'divider' ? DividerBlock :
  T extends 'hero' ? HeroBlock :
  T extends 'stats' ? StatsBlock :
  T extends 'testimonial' ? TestimonialBlock :
  T extends 'feature-grid' ? FeatureGridBlock :
  T extends 'comparison' ? ComparisonBlock :
  T extends 'social-links' ? SocialLinksBlock :
  T extends 'footer' ? FooterBlock :
  T extends 'two-column' ? TwoColumnBlock :
  T extends 'image-overlay' ? ImageOverlayBlock :
  T extends 'image-grid-2x2' ? ImageGrid2x2Block :
  T extends 'image-grid-3x3' ? ImageGrid3x3Block :
  T extends 'image-collage' ? ImageCollageBlock :
  T extends 'three-column' ? ThreeColumnBlock :
  T extends 'zigzag' ? ZigzagBlock :
  T extends 'split-background' ? SplitBackgroundBlock :
  T extends 'product-card' ? ProductCardBlock :
  T extends 'badge-overlay' ? BadgeOverlayBlock :
  never;

// ============================================================================
// Email Document Structure
// ============================================================================

/**
 * Complete email as blocks (alternative to EmailContent)
 */
export interface BlockEmail {
  blocks: EmailBlock[];
  globalSettings?: GlobalEmailSettings;
}

/**
 * Global settings applied to entire email
 */
export interface GlobalEmailSettings {
  backgroundColor: string; // Email background (default: '#f3f4f6')
  contentBackgroundColor: string; // Content area background (default: '#ffffff')
  maxWidth: number; // Email max width (default: 600)
  fontFamily: string; // Default font stack
  mobileBreakpoint: number; // Mobile breakpoint in px (default: 480)
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Block creation input (without ID and position)
 */
export type BlockInput<T extends BlockType> = Omit<TypedBlock<T>, 'id' | 'position'>;

/**
 * Partial block update (for editing)
 */
export type BlockUpdate<T extends BlockType> = Partial<Omit<TypedBlock<T>, 'id' | 'type'>>;

