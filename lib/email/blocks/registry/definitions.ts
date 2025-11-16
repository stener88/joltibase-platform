/**
 * Block Definitions
 * 
 * Metadata for all block types including icons, descriptions, and AI hints
 */

import type { BlockType } from '../types';
import type { BlockCategory } from './categories';

export interface BlockDefinition {
  type: BlockType;
  name: string;
  description: string;
  category: BlockCategory;
  icon: string; // Emoji icon
  aiHints: string[]; // When AI should use this block
  previewDescription: string; // Text description for preview
}

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  'logo': {
    type: 'logo',
    name: 'Logo',
    description: 'Brand logo with link',
    category: 'media',
    icon: '🎨',
    aiHints: [
      'Start of email',
      'Brand identity needed',
      'Professional header',
    ],
    previewDescription: 'Logo image centered at top',
  },
  'spacer': {
    type: 'spacer',
    name: 'Spacer',
    description: 'Vertical spacing',
    category: 'structure',
    icon: '⬜',
    aiHints: [
      'Add breathing room',
      'Separate sections',
      'Control vertical rhythm',
    ],
    previewDescription: 'Empty vertical space',
  },
  'text': {
    type: 'text',
    name: 'Text',
    description: 'Text content (body or headings)',
    category: 'content',
    icon: '📄',
    aiHints: [
      'Body copy',
      'Headings and titles',
      'Explanations',
      'Section titles',
      'Detailed information',
    ],
    previewDescription: 'Text paragraph or heading',
  },
  'image': {
    type: 'image',
    name: 'Image',
    description: 'Single image or grid (1-9 images, 1-3 columns)',
    category: 'media',
    icon: '🖼️',
    aiHints: [
      'Product photos',
      'Visual content',
      'Screenshots',
      'Single images or grids (up to 3×3)',
      'Product galleries',
      'Photo grids',
    ],
    previewDescription: 'Image or image grid',
  },
  'button': {
    type: 'button',
    name: 'Button',
    description: 'Call-to-action button',
    category: 'cta',
    icon: '🔘',
    aiHints: [
      'Primary CTA',
      'Secondary actions',
      'Conversion goals',
    ],
    previewDescription: 'Centered CTA button',
  },
  'divider': {
    type: 'divider',
    name: 'Divider',
    description: 'Horizontal line or decorative element',
    category: 'structure',
    icon: '➖',
    aiHints: [
      'Separate sections',
      'Visual break',
      'Content organization',
    ],
    previewDescription: 'Horizontal divider line',
  },
  'social-links': {
    type: 'social-links',
    name: 'Social Links',
    description: 'Social media icons',
    category: 'social',
    icon: '🔗',
    aiHints: [
      'Footer social links',
      'Connect on social media',
      'Follow us section',
    ],
    previewDescription: 'Row of social icons',
  },
  'layouts': {
    type: 'layouts',
    name: 'Layouts',
    description: 'Complex multi-element layouts',
    category: 'layout',
    icon: '📐',
    aiHints: [
      'Hero sections',
      'Multi-column layouts',
      'Stats displays',
      'Feature showcases',
      'Complex compositions',
    ],
    previewDescription: 'Advanced layout with multiple elements',
  },
  'footer': {
    type: 'footer',
    name: 'Footer',
    description: 'Email footer with unsubscribe',
    category: 'structure',
    icon: '📧',
    aiHints: [
      'End of email',
      'Legal requirements',
      'Contact information',
    ],
    previewDescription: 'Footer with company info and unsubscribe',
  },
  'link-bar': {
    type: 'link-bar',
    name: 'Link Bar',
    description: 'Horizontal or vertical navigation links',
    category: 'structure',
    icon: '🔗',
    aiHints: [
      'Navigation',
      'Quick links',
      'Menu bar',
    ],
    previewDescription: 'Navigation link bar',
  },
  'address': {
    type: 'address',
    name: 'Address',
    description: 'Physical address display',
    category: 'structure',
    icon: '📍',
    aiHints: [
      'Company address',
      'Contact information',
      'CAN-SPAM compliance',
    ],
    previewDescription: 'Physical address block',
  },
};

/**
 * Get all block definitions
 */
export function getAllBlockDefinitions(): BlockDefinition[] {
  return Object.values(BLOCK_DEFINITIONS);
}

/**
 * Get block definition by type
 */
export function getBlockDefinition(type: BlockType): BlockDefinition {
  return BLOCK_DEFINITIONS[type];
}

/**
 * Get blocks by category
 */
export function getBlocksByCategory(category: BlockCategory): BlockDefinition[] {
  return Object.values(BLOCK_DEFINITIONS).filter(def => def.category === category);
}

/**
 * Search blocks by name or description
 */
export function searchBlocks(query: string): BlockDefinition[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(BLOCK_DEFINITIONS).filter(def => 
    def.name.toLowerCase().includes(lowerQuery) ||
    def.description.toLowerCase().includes(lowerQuery) ||
    def.aiHints.some(hint => hint.toLowerCase().includes(lowerQuery))
  );
}

