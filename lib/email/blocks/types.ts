/**
 * Email Block System - Type Definitions
 * 
 * Block-based architecture using 11 base types + 60+ layout variations
 * Optimized for Gemini's native Zod support and flexible content structure.
 */

// ============================================================================
// Base Block Types
// ============================================================================

export type BaseBlockType =
  | 'layouts'
  | 'logo'
  | 'text'
  | 'image'
  | 'link-bar'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'social-links'
  | 'footer'
  | 'address';

/**
 * Layout Variations - IMPLEMENTED ONLY
 * 
 * This type includes only the 14 layout variations that have been fully implemented
 * with configs, renderers, and factory support.
 * 
 * New layouts are added via TypeScript config files in lib/email/blocks/configs/
 * See PHASE_2_COMPLETION_SUMMARY.md for the factory system architecture.
 */
export type LayoutVariation =
  // Hero & Content Layouts (1)
  | 'hero-center'
  // Two-Column Layouts (6)
  | 'two-column-50-50'
  | 'two-column-60-40'
  | 'two-column-40-60'
  | 'two-column-70-30'
  | 'two-column-30-70'
  | 'two-column-text'
  // Stats Layouts (3)
  | 'stats-2-col'
  | 'stats-3-col'
  | 'stats-4-col'
  // Advanced Layouts (4)
  | 'image-overlay'
  | 'card-centered'
  | 'compact-image-text'
  | 'magazine-feature';

export interface EmailBlock {
  id: string;
  type: BaseBlockType;
  position: number;
  layoutVariation?: LayoutVariation;
  settings: Record<string, any>;
  content: Record<string, any>;
}

export interface GlobalEmailSettings {
  backgroundColor: string;
  contentBackgroundColor: string;
  maxWidth: number;
  fontFamily: string;
  mobileBreakpoint: number;
}

export interface Email {
  subject: string;
  previewText: string;
  blocks: EmailBlock[];
  globalSettings?: GlobalEmailSettings;
  notes?: string;
}

export interface Campaign {
  campaignName: string;
  campaignType: 'one-time' | 'sequence';
  emails: Email[];
  recommendedSegment?: string;
  strategy?: {
    goal: string;
    keyMessage: string;
  };
  design: {
    template: string;
    ctaColor: string;
    accentColor?: string;
  };
  segmentationSuggestion?: string;
  sendTimeSuggestion?: string;
  successMetrics?: string;
}

// Re-export individual block types from schemas
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

// ============================================================================
// V2 Block System - Display Name Helpers
// ============================================================================

/**
 * Get human-readable display name for a layout variation
 * Examples: 'hero-center' → 'Hero Center', 'two-column-60-40' → 'Two Columns (60/40)'
 */
export function getLayoutVariationDisplayName(variation: LayoutVariation): string {
  const displayNames: Record<LayoutVariation, string> = {
    // Hero & Content Layouts
    'hero-center': 'Hero Center',
    
    // Two-Column Layouts
    'two-column-50-50': 'Two Columns (50/50)',
    'two-column-60-40': 'Two Columns (60/40)',
    'two-column-40-60': 'Two Columns (40/60)',
    'two-column-70-30': 'Two Columns (70/30)',
    'two-column-30-70': 'Two Columns (30/70)',
    'two-column-text': 'Two Column Text',
    
    // Stats Layouts
    'stats-2-col': 'Stats (2 Columns)',
    'stats-3-col': 'Stats (3 Columns)',
    'stats-4-col': 'Stats (4 Columns)',
    
    // Advanced Layouts
    'image-overlay': 'Image Overlay',
    'card-centered': 'Card Centered',
    'compact-image-text': 'Compact Image Text',
    'magazine-feature': 'Magazine Feature',
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
