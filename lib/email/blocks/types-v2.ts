/**
 * Email Block Types V2 - Flodesk Pattern
 * 
 * TypeScript types for the new 11-block + layout variations system
 */

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

export type LayoutVariation =
  // Content layouts
  | 'hero-center'
  | 'hero-image-overlay'
  | 'stats-2-col'
  | 'stats-3-col'
  | 'stats-4-col'
  | 'testimonial-centered'
  | 'testimonial-with-image'
  | 'testimonial-card'
  // Two-column
  | 'two-column-50-50'
  | 'two-column-60-40'
  | 'two-column-40-60'
  | 'two-column-70-30'
  | 'two-column-30-70'
  // Three-column
  | 'three-column-equal'
  | 'three-column-wide-center'
  | 'three-column-wide-outer'
  // Four+ columns
  | 'four-column-equal'
  | 'five-column-equal'
  // Image layouts
  | 'image-overlay'
  | 'image-overlay-center'
  | 'image-overlay-top-left'
  | 'image-overlay-top-right'
  | 'image-overlay-bottom-left'
  | 'image-overlay-bottom-right'
  | 'image-overlay-center-bottom'
  | 'image-collage-featured-left'
  | 'image-collage-featured-right'
  | 'image-collage-featured-center'
  // Advanced layouts
  | 'zigzag-2-rows'
  | 'zigzag-3-rows'
  | 'zigzag-4-rows'
  | 'split-background'
  | 'product-card-image-top'
  | 'product-card-image-left'
  | 'badge-overlay-corner'
  | 'badge-overlay-center'
  | 'feature-grid-2-items'
  | 'feature-grid-3-items'
  | 'feature-grid-4-items'
  | 'feature-grid-6-items'
  | 'comparison-table-2-col'
  | 'comparison-table-3-col'
  | 'card-centered'
  | 'compact-image-text'
  | 'two-column-text'
  | 'magazine-feature'
  // Interactive
  | 'carousel-2-slides'
  | 'carousel-3-5-slides'
  | 'carousel-6-10-slides'
  | 'tabs-2-tabs'
  | 'tabs-3-5-tabs'
  | 'tabs-6-8-tabs'
  | 'accordion-2-items'
  | 'accordion-3-5-items'
  | 'accordion-6-10-items'
  | 'masonry-2-col'
  | 'masonry-3-col'
  | 'masonry-4-col'
  | 'masonry-5-col'
  | 'container-stack'
  | 'container-grid'
  | 'container-flex';

export interface EmailBlock {
  id: string;
  type: BaseBlockType;
  position: number;
  layoutVariation?: LayoutVariation; // Required for type='layouts'
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

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format layout variation name for display
 */
function formatLayoutVariation(variation: LayoutVariation): string {
  return variation
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get human-readable display name for a block
 */
export function getBlockDisplayName(block: EmailBlock): string {
  if (block.type === 'layouts' && block.layoutVariation) {
    return formatLayoutVariation(block.layoutVariation);
  }
  
  // Base block type names
  const typeNames: Record<BaseBlockType, string> = {
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
  
  return typeNames[block.type] || block.type;
}

