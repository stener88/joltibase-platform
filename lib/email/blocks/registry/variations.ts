/**
 * Layout Variations
 * 
 * Metadata for layout block variations
 */

import type { LayoutVariation } from '../types';

export type LayoutVariationCategory = 
  | 'content'
  | 'two-column'
  | 'three-column'
  | 'four-plus-column'
  | 'image'
  | 'advanced'
  | 'interactive';

export interface LayoutVariationDefinition {
  variation: LayoutVariation;
  name: string;
  description: string;
  category: LayoutVariationCategory;
  icon: string;
  aiHints: string[];
}

/**
 * Metadata for layout variations
 * Note: This is a subset of 60+ variations - expand as needed
 */
export const LAYOUT_VARIATION_DEFINITIONS: Partial<Record<LayoutVariation, LayoutVariationDefinition>> = {
  // Content layouts
  'hero-center': {
    variation: 'hero-center',
    name: 'Hero Center',
    description: 'Centered hero with headline and subheadline',
    category: 'hero',
    icon: '⭐',
    aiHints: ['email opening', 'major announcement', 'centered headline'],
  },
  'hero-image-overlay': {
    variation: 'hero-image-overlay',
    name: 'Hero Image Overlay',
    description: 'Full-width image with text overlay',
    category: 'hero',
    icon: '🎭',
    aiHints: ['dramatic opening', 'visual-first', 'background image'],
  },
  'stats-2-col': {
    variation: 'stats-2-col',
    name: 'Stats (2 Columns)',
    description: '2 impressive statistics side-by-side',
    category: 'content',
    icon: '📊',
    aiHints: ['two metrics', 'comparison stats', 'key numbers'],
  },
  'stats-3-col': {
    variation: 'stats-3-col',
    name: 'Stats (3 Columns)',
    description: '3 impressive statistics in a row',
    category: 'content',
    icon: '📊',
    aiHints: ['key metrics', 'three numbers', 'achievements'],
  },
  'stats-4-col': {
    variation: 'stats-4-col',
    name: 'Stats (4 Columns)',
    description: '4 impressive statistics in a row',
    category: 'content',
    icon: '📊',
    aiHints: ['multiple metrics', 'four numbers', 'comprehensive stats'],
  },
  
  // Two-column layouts
  'two-column-50-50': {
    variation: 'two-column-50-50',
    name: 'Two Columns (50/50)',
    description: 'Two equal-width columns',
    category: 'two-column',
    icon: '📐',
    aiHints: ['equal columns', 'side by side', 'balanced layout'],
  },
  'two-column-60-40': {
    variation: 'two-column-60-40',
    name: 'Two Columns (60/40)',
    description: 'Two columns with 60/40 split',
    category: 'two-column',
    icon: '📐',
    aiHints: ['asymmetric columns', 'wider left', 'image and text'],
  },
  'two-column-40-60': {
    variation: 'two-column-40-60',
    name: 'Two Columns (40/60)',
    description: 'Two columns with 40/60 split',
    category: 'two-column',
    icon: '📐',
    aiHints: ['asymmetric columns', 'wider right', 'text and image'],
  },
  'two-column-70-30': {
    variation: 'two-column-70-30',
    name: 'Two Columns (70/30)',
    description: 'Two columns with 70/30 split',
    category: 'two-column',
    icon: '📐',
    aiHints: ['dominant left column', 'sidebar layout'],
  },
  'two-column-30-70': {
    variation: 'two-column-30-70',
    name: 'Two Columns (30/70)',
    description: 'Two columns with 30/70 split',
    category: 'two-column',
    icon: '📐',
    aiHints: ['dominant right column', 'sidebar layout'],
  },
  'two-column-text': {
    variation: 'two-column-text',
    name: 'Two Column Text',
    description: 'Two columns of text only',
    category: 'two-column',
    icon: '📐',
    aiHints: ['text columns', 'no images', 'magazine style'],
  },
  
  // Advanced layouts
  'image-overlay': {
    variation: 'image-overlay',
    name: 'Image Overlay',
    description: 'Full-width background image with text overlay',
    category: 'advanced',
    icon: '🎨',
    aiHints: ['dramatic hero', 'full-width image', 'text overlay'],
  },
  'card-centered': {
    variation: 'card-centered',
    name: 'Card Centered',
    description: 'Centered card with large number and text',
    category: 'advanced',
    icon: '🃏',
    aiHints: ['featured card', 'centered content', 'number highlight'],
  },
  'compact-image-text': {
    variation: 'compact-image-text',
    name: 'Compact Image Text',
    description: 'Small image with text beside it',
    category: 'advanced',
    icon: '📸',
    aiHints: ['thumbnail', 'recipe preview', 'compact layout'],
  },
  'magazine-feature': {
    variation: 'magazine-feature',
    name: 'Magazine Feature',
    description: 'Magazine-style feature with large image',
    category: 'advanced',
    icon: '📰',
    aiHints: ['editorial', 'magazine style', 'feature article'],
  },
};

/**
 * Get layout variations by category
 */
export function getLayoutVariationsByCategory(category: LayoutVariationCategory): LayoutVariationDefinition[] {
  return Object.values(LAYOUT_VARIATION_DEFINITIONS).filter(
    def => def && def.category === category
  ) as LayoutVariationDefinition[];
}

