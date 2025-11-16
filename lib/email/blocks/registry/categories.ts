/**
 * Block Categories
 * 
 * Category definitions for organizing blocks in the editor
 */

export type BlockCategory = 'layout' | 'content' | 'media' | 'cta' | 'social' | 'structure';

export interface BlockCategoryInfo {
  id: BlockCategory;
  name: string;
  description: string;
}

export const BLOCK_CATEGORIES: BlockCategoryInfo[] = [
  {
    id: 'structure',
    name: 'Structure',
    description: 'Layout and spacing elements',
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Text and headings',
  },
  {
    id: 'media',
    name: 'Media',
    description: 'Images and logos',
  },
  {
    id: 'cta',
    name: 'Call to Action',
    description: 'Buttons and conversion elements',
  },
  {
    id: 'social',
    name: 'Social & Proof',
    description: 'Social links and testimonials',
  },
  {
    id: 'layout',
    name: 'Advanced Layout',
    description: 'Complex multi-element blocks',
  },
];

