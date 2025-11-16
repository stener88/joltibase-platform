/**
 * Email Block Registry - Main Module
 * 
 * Central registry for all block types with metadata, defaults, and utilities
 */

import type { BlockType, EmailBlock } from '../types';

// Re-export types
export type { BlockCategory, BlockCategoryInfo } from './categories';
export type { BlockDefinition } from './definitions';
export type { LayoutVariationCategory, LayoutVariationDefinition } from './variations';

// Re-export category data
export { BLOCK_CATEGORIES } from './categories';

// Re-export definitions
export {
  BLOCK_DEFINITIONS,
  getAllBlockDefinitions,
  getBlockDefinition,
  getBlocksByCategory,
  searchBlocks,
} from './definitions';

// Re-export variations
export { LAYOUT_VARIATION_DEFINITIONS, getLayoutVariationsByCategory } from './variations';

// Re-export defaults
export {
  getDefaultBlockSettings,
  getDefaultBlockContent,
} from './defaults';

// Re-export AI hints
export {
  getAIBlockRecommendations,
  getBlocksForUseCase,
} from './ai-hints';

// ============================================================================
// Block Factory Functions
// ============================================================================

/**
 * Generate unique block ID
 */
export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new block with default settings
 */
export function createDefaultBlock(type: BlockType, position: number = 0): EmailBlock {
  const {  getDefaultBlockSettings, getDefaultBlockContent } = require('./defaults');
  
  return {
    id: generateBlockId(),
    type,
    position,
    settings: getDefaultBlockSettings(type) as any,
    content: getDefaultBlockContent(type) as any,
  };
}

/**
 * Create a layout block with a specific variation
 */
export function createLayoutBlock(layoutVariation: string, position: number = 0): EmailBlock {
  const { getDefaultBlockSettings, getDefaultBlockContent } = require('./defaults');
  
  return {
    id: generateBlockId(),
    type: 'layouts',
    layoutVariation,
    position,
    settings: getDefaultBlockSettings('layouts') as any,
    content: getDefaultBlockContent('layouts', { layoutVariation }) as any,
  } as any;
}

/**
 * Create a link-bar block
 */
export function createLinkBarBlock(position: number = 0): EmailBlock {
  const { getDefaultBlockSettings } = require('./defaults');
  
  return {
    id: generateBlockId(),
    type: 'link-bar',
    position,
    settings: getDefaultBlockSettings('link-bar') as any,
    content: {
      links: [
        { text: 'Home', url: '#' },
        { text: 'About', url: '#' },
        { text: 'Contact', url: '#' },
      ],
    },
  } as any;
}

/**
 * Create an address block
 */
export function createAddressBlock(position: number = 0): EmailBlock {
  const { getDefaultBlockSettings } = require('./defaults');
  
  return {
    id: generateBlockId(),
    type: 'address',
    position,
    settings: getDefaultBlockSettings('address') as any,
    content: {
      companyName: '{{company_name}}',
      street: '123 Main Street',
      city: 'City',
      state: 'State',
      zip: '12345',
      country: 'Country',
    },
  } as any;
}

