/**
 * Section Template Types
 * 
 * Type definitions for pre-designed section templates that combine
 * multiple blocks into reusable compositions.
 */

import type { EmailBlock } from '../blocks/types';

// ============================================================================
// Section Categories
// ============================================================================

export type SectionCategory = 
  | 'hero'
  | 'promo'
  | 'content'
  | 'social-proof'
  | 'cta'
  | 'pricing'
  | 'features'
  | 'gallery'
  | 'product';

export type DesignStyle = 
  | 'minimal'
  | 'bold'
  | 'modern'
  | 'elegant'
  | 'gradient'
  | 'playful';

export type Complexity = 'simple' | 'moderate' | 'complex';

// ============================================================================
// Section Template Interface
// ============================================================================

export interface SectionTemplate {
  // Identification
  id: string;
  name: string;
  
  // Categorization
  category: SectionCategory;
  subcategory?: string;
  
  // Visual & Content
  thumbnail?: string; // URL or path to preview image
  description: string;
  
  // Usage Metadata
  useCases: string[]; // e.g., ['flash-sale', 'product-launch', 'newsletter']
  designStyle: DesignStyle;
  colorScheme: string; // e.g., 'warm-red', 'cool-blue', 'monochrome'
  complexity: Complexity;
  
  // Block Composition
  blocks: EmailBlock[]; // Pre-configured blocks that make up this section
  
  // AI Context
  aiContext: {
    keywords: string[]; // Keywords for AI matching
    selectionWeight: number; // Priority score (0-100)
    bestFor: string[]; // Specific use cases this excels at
  };
}

// ============================================================================
// Section Filter & Search Types
// ============================================================================

export interface SectionFilter {
  category?: SectionCategory;
  designStyle?: DesignStyle;
  complexity?: Complexity;
  searchQuery?: string;
  useCases?: string[];
}

export interface SectionSearchResult {
  section: SectionTemplate;
  relevanceScore: number;
}

