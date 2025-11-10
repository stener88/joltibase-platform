/**
 * Email Block System - Type Definitions
 * 
 * Block-based architecture for visual email editing with AI generation.
 * Uses hardcoded pixel values for granular AI control and data-driven optimization.
 */

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
  | 'footer';

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
  | FooterBlockSettings;

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
  | FooterBlockContent;

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
  height?: string; // 'auto' or specific height
  backgroundColor?: string;
  padding: Padding;
}

export interface LogoBlockContent {
  imageUrl: string;
  altText: string;
  linkUrl?: string;
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
  backgroundColor?: string;
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
  backgroundColor?: string;
  padding: Padding;
  lineHeight: string; // '1.1', '1.2', '1.3'
  letterSpacing?: string; // '-0.02em', '-0.03em'
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
  backgroundColor?: string;
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
  height?: string; // 'auto' or specific
  borderRadius?: string; // '0px', '4px', '8px'
  padding: Padding;
}

export interface ImageBlockContent {
  imageUrl: string;
  altText: string;
  linkUrl?: string;
  caption?: string;
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
  color?: string; // For line styles
  thickness?: number; // 1, 2, 3 (pixels)
  width?: string; // '100%', '60px' for decorative
  padding: Padding;
  align?: Alignment; // For decorative dividers
}

export interface DividerBlockContent {
  decorativeElement?: string; // Emoji or symbol for decorative style
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
  backgroundColor?: string;
  backgroundGradient?: {
    from: string;
    to: string;
    direction: 'to-right' | 'to-bottom' | 'to-br' | 'to-tr';
  };
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
  subheadline?: string;
  imageUrl?: string;
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
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number; // 0, 2, 4
  borderRadius?: string; // '4px', '8px'
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
  role?: string;
  company?: string;
  avatarUrl?: string;
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
    icon?: string; // Emoji or icon character
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
  borderRadius?: string; // '4px', '8px'
  padding: Padding;
  cellPadding: number; // Inner cell padding (16, 20, 24)
}

export interface ComparisonBlockContent {
  before: {
    label?: string; // Default: 'Before'
    text: string;
  };
  after: {
    label?: string; // Default: 'After'
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
  iconColor?: string; // For monochrome style
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
  backgroundColor?: string;
  textColor: string;
  fontSize: string; // '12px', '14px'
  align: Alignment;
  padding: Padding;
  lineHeight: string; // '1.5', '1.6'
  linkColor?: string;
}

export interface FooterBlockContent {
  companyName: string;
  companyAddress?: string;
  customText?: string;
  unsubscribeUrl: string; // '{{unsubscribe_url}}'
  preferencesUrl?: string; // '{{preferences_url}}'
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

