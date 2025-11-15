/**
 * Email Block System - Type Definitions (V2)
 * 
 * Block-based architecture using v2 schema: 11 base types + 60+ layout variations
 * Optimized for Gemini's native Zod support and flexible content structure.
 */

// Re-export V2 types from types-v2.ts as primary types
export type {
  BaseBlockType,
  LayoutVariation,
  EmailBlock,
  GlobalEmailSettings,
  Email,
  Campaign,
} from './types-v2';

// Re-export individual block types from schemas (V2 base blocks only)
export type { LogoBlockType as LogoBlock } from './schemas';
export type { SpacerBlockType as SpacerBlock } from './schemas';
export type { TextBlockType as TextBlock } from './schemas';
export type { ImageBlockType as ImageBlock } from './schemas';
export type { ButtonBlockType as ButtonBlock } from './schemas';
export type { DividerBlockType as DividerBlock } from './schemas';
export type { SocialLinksBlockType as SocialLinksBlock } from './schemas';
export type { FooterBlockType as FooterBlock } from './schemas';
// V2 blocks (link-bar, address, layouts to be added later)
export type LinkBarBlock = any; // Placeholder
export type AddressBlock = any; // Placeholder
export type LayoutsBlock = any; // Placeholder

// Import for internal use
import type { BaseBlockType, LayoutVariation, EmailBlock, GlobalEmailSettings } from './types-v2';

// ============================================================================
// V2 Block System - Display Name Helpers
// ============================================================================

/**
 * Get human-readable display name for a layout variation
 * Examples: 'hero-center' → 'Hero Center', 'two-column-60-40' → 'Two Columns (60/40)'
 */
export function getLayoutVariationDisplayName(variation: LayoutVariation): string {
  const displayNames: Record<LayoutVariation, string> = {
    // Content layouts
    'hero-center': 'Hero Center',
    'hero-image-overlay': 'Hero Image Overlay',
    'stats-2-col': 'Stats (2 Columns)',
    'stats-3-col': 'Stats (3 Columns)',
    'stats-4-col': 'Stats (4 Columns)',
    'testimonial-centered': 'Testimonial Centered',
    'testimonial-with-image': 'Testimonial with Image',
    'testimonial-card': 'Testimonial Card',
    
    // Two-column
    'two-column-50-50': 'Two Columns (50/50)',
    'two-column-60-40': 'Two Columns (60/40)',
    'two-column-40-60': 'Two Columns (40/60)',
    'two-column-70-30': 'Two Columns (70/30)',
    'two-column-30-70': 'Two Columns (30/70)',
    
    // Three-column
    'three-column-equal': 'Three Columns Equal',
    'three-column-wide-center': 'Three Columns (Wide Center)',
    'three-column-wide-outer': 'Three Columns (Wide Outer)',
    
    // Four+ columns
    'four-column-equal': 'Four Columns Equal',
    'five-column-equal': 'Five Columns Equal',
    
    // Image layouts
    'image-overlay-center': 'Image Overlay Center',
    'image-overlay-top-left': 'Image Overlay Top Left',
    'image-overlay-top-right': 'Image Overlay Top Right',
    'image-overlay-bottom-left': 'Image Overlay Bottom Left',
    'image-overlay-bottom-right': 'Image Overlay Bottom Right',
    'image-overlay-center-bottom': 'Image Overlay Center Bottom',
    'image-collage-featured-left': 'Image Collage (Featured Left)',
    'image-collage-featured-right': 'Image Collage (Featured Right)',
    'image-collage-featured-center': 'Image Collage (Featured Center)',
    
    // Advanced layouts
    'zigzag-2-rows': 'Zigzag (2 Rows)',
    'zigzag-3-rows': 'Zigzag (3 Rows)',
    'zigzag-4-rows': 'Zigzag (4 Rows)',
    'split-background': 'Split Background',
    'product-card-image-top': 'Product Card (Image Top)',
    'product-card-image-left': 'Product Card (Image Left)',
    'badge-overlay-corner': 'Badge Overlay Corner',
    'badge-overlay-center': 'Badge Overlay Center',
    'feature-grid-2-items': 'Feature Grid (2 Items)',
    'feature-grid-3-items': 'Feature Grid (3 Items)',
    'feature-grid-4-items': 'Feature Grid (4 Items)',
    'feature-grid-6-items': 'Feature Grid (6 Items)',
    'comparison-table-2-col': 'Comparison Table (2 Columns)',
    'comparison-table-3-col': 'Comparison Table (3 Columns)',
    
    // Interactive
    'carousel-2-slides': 'Carousel (2 Slides)',
    'carousel-3-5-slides': 'Carousel (3-5 Slides)',
    'carousel-6-10-slides': 'Carousel (6-10 Slides)',
    'tabs-2-tabs': 'Tabs (2 Tabs)',
    'tabs-3-5-tabs': 'Tabs (3-5 Tabs)',
    'tabs-6-8-tabs': 'Tabs (6-8 Tabs)',
    'accordion-2-items': 'Accordion (2 Items)',
    'accordion-3-5-items': 'Accordion (3-5 Items)',
    'accordion-6-10-items': 'Accordion (6-10 Items)',
    'masonry-2-col': 'Masonry (2 Columns)',
    'masonry-3-col': 'Masonry (3 Columns)',
    'masonry-4-col': 'Masonry (4 Columns)',
    'masonry-5-col': 'Masonry (5 Columns)',
    'container-stack': 'Container Stack',
    'container-grid': 'Container Grid',
    'container-flex': 'Container Flex',
  };
  
  return displayNames[variation] || variation;
}

/**
 * Get display name for any block (including layouts with variations)
 */
export function getBlockDisplayName(block: EmailBlock): string {
  const baseNames: Record<BaseBlockType, string> = {
    'layouts': 'Layout',
    'logo': 'Logo',
    'text': 'Text',
    'image': 'Image',
    'link-bar': 'Link Bar',
    'button': 'Button',
    'divider': 'Divider',
    'spacer': 'Spacer',
    'social-links': 'Social Links',
    'footer': 'Footer',
    'address': 'Address',
  };
  
  if (block.type === 'layouts' && block.layoutVariation) {
    return getLayoutVariationDisplayName(block.layoutVariation);
  }
  
  return baseNames[block.type as BaseBlockType] || block.type;
}

/**
 * Check if a block is a v2 block (has layoutVariation field or is one of new types)
 */
export function isV2Block(block: any): block is EmailBlock {
  return (
    block.type === 'layouts' ||
    block.type === 'link-bar' ||
    block.type === 'address' ||
    'layoutVariation' in block
  );
}

// ============================================================================
// Common Type Exports (used across the system)
// ============================================================================

export interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type Alignment = 'left' | 'center' | 'right';

// Helper types for block structure
export type BlockSettings = EmailBlock['settings'];
export type BlockContent = EmailBlock['content'];
export type BlockEmail = {
  blocks: EmailBlock[];
  globalSettings?: GlobalEmailSettings;
};

// Utility types for working with blocks
export type TypedBlock<T extends BlockType> = Extract<EmailBlock, { type: T }>;
export type BlockInput = Omit<EmailBlock, 'id'>;
export type BlockUpdate = Partial<Omit<EmailBlock, 'id' | 'type'>>;

// Type guard for BlockType
export function isBlockType(value: unknown): value is BlockType {
  const validTypes: BlockType[] = [
    'logo', 'spacer', 'text', 'image', 'button', 'divider',
    'social-links', 'footer', 'layouts', 'link-bar', 'address',
  ];
  return typeof value === 'string' && validTypes.includes(value as BlockType);
}

// Primary BlockType is now BaseBlockType from v2
export type BlockType = BaseBlockType;

// Legacy type reference for understanding old blocks
export type LegacyBlockType =
  | 'heading' | 'hero' | 'stats' | 'testimonial' | 'feature-grid' | 'comparison'
  | 'two-column' | 'image-overlay' | 'image-grid-2x2' | 'image-grid-3x3'
  | 'image-collage' | 'three-column' | 'zigzag' | 'split-background'
  | 'product-card' | 'badge-overlay' | 'carousel' | 'tab-container'
  | 'accordion' | 'masonry-grid' | 'dynamic-column' | 'container';
