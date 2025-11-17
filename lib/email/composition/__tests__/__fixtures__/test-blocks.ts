/**
 * Test Fixtures for Composition Tests
 * 
 * Provides reusable test blocks for composition rule testing
 */

import type { EmailBlock } from '../../../blocks/types';

/**
 * Valid block - meets all composition standards
 */
export const validBlock: EmailBlock = {
  id: 'test-valid-1',
  type: 'layouts',
  position: 0,
  layoutVariation: 'hero-center',
  settings: {
    padding: { top: 40, right: 24, bottom: 40, left: 24 }, // On 8px grid
    backgroundColor: '#ffffff',
    align: 'center',
    buttonBackgroundColor: '#3B82F6',
    buttonTextColor: '#ffffff',
  },
  content: {
    title: 'Welcome to Our Platform',
    paragraph: 'Get started today with our amazing features that help you grow.',
    button: {
      text: 'Get Started',
      url: 'https://example.com',
    },
  },
};

/**
 * Block with off-grid spacing (should trigger spacing rule)
 */
export const offGridSpacingBlock: EmailBlock = {
  id: 'test-off-grid-1',
  type: 'layouts',
  position: 0,
  layoutVariation: 'hero-center',
  settings: {
    padding: { top: 35, right: 18, bottom: 42, left: 25 }, // Off 8px grid
    backgroundColor: '#ffffff',
  },
  content: {
    title: 'Test Title',
    paragraph: 'Test paragraph',
  },
};

/**
 * Block with poor contrast (should trigger contrast rule)
 */
export const poorContrastBlock: EmailBlock = {
  id: 'test-contrast-1',
  type: 'layouts',
  position: 0,
  layoutVariation: 'hero-center',
  settings: {
    padding: { top: 40, right: 24, bottom: 40, left: 24 },
    backgroundColor: '#ffffff',
    titleColor: '#cccccc', // Poor contrast on white (2.3:1)
  },
  content: {
    title: 'Low Contrast Title',
    paragraph: 'This paragraph has normal contrast',
  },
};

/**
 * Block with weak typography hierarchy (should trigger hierarchy rule)
 */
export const weakHierarchyBlock: EmailBlock = {
  id: 'test-hierarchy-1',
  type: 'layouts',
  position: 0,
  layoutVariation: 'hero-center',
  settings: {
    padding: { top: 40, right: 24, bottom: 40, left: 24 },
    titleSize: 18, // Too close to body size (16px)
    bodySize: 16,
  },
  content: {
    title: 'Small Title',
    paragraph: 'This paragraph is almost as big as the title',
  },
};

/**
 * Block with small touch target (should trigger touch target rule)
 */
export const smallTouchTargetBlock: EmailBlock = {
  id: 'test-touch-1',
  type: 'button',
  position: 0,
  settings: {
    padding: { top: 8, right: 20, bottom: 8, left: 20 }, // Total height: 35px
    backgroundColor: '#3B82F6',
    textColor: '#ffffff',
  },
  content: {
    text: 'Small Button',
    url: 'https://example.com',
  },
};

/**
 * Block with insufficient white space (should trigger white space rule)
 */
export const cramppedBlock: EmailBlock = {
  id: 'test-whitespace-1',
  type: 'layouts',
  position: 0,
  layoutVariation: 'hero-center',
  settings: {
    padding: { top: 8, right: 8, bottom: 8, left: 8 }, // Very tight
    backgroundColor: '#f0f0f0',
  },
  content: {
    title: 'Crammed Title',
    paragraph: 'This has way too much text for such a small amount of padding and it will look very cramped and hard to read. The white space ratio is way too low.',
  },
};

/**
 * Multiple blocks with various issues
 */
export const mixedQualityBlocks: EmailBlock[] = [
  validBlock,
  offGridSpacingBlock,
  poorContrastBlock,
  weakHierarchyBlock,
];

/**
 * Perfect quality blocks (should score 100)
 */
export const perfectBlocks: EmailBlock[] = [
  {
    id: 'perfect-1',
    type: 'layouts',
    position: 0,
    layoutVariation: 'hero-center',
    settings: {
      padding: { top: 80, right: 40, bottom: 80, left: 40 }, // Hero spacing, on grid
      backgroundColor: '#ffffff',
      align: 'center',
      titleColor: '#171717', // Perfect contrast
      bodyColor: '#525252', // Perfect contrast
      buttonBackgroundColor: '#3B82F6',
      buttonTextColor: '#ffffff',
    },
    content: {
      title: 'Perfect Composition',
      paragraph: 'This block follows all composition rules perfectly.',
      button: {
        text: 'Learn More',
        url: 'https://example.com',
      },
    },
  },
  {
    id: 'perfect-2',
    type: 'layouts',
    position: 1,
    layoutVariation: 'two-column-50-50',
    settings: {
      padding: { top: 40, right: 24, bottom: 40, left: 24 },
      backgroundColor: '#ffffff',
      align: 'left',
    },
    content: {
      title: 'Great Typography',
      paragraph: 'Proper hierarchy maintained.',
    },
  },
];

/**
 * Failing blocks (should score <70)
 */
export const failingBlocks: EmailBlock[] = [
  offGridSpacingBlock,
  poorContrastBlock,
  weakHierarchyBlock,
  smallTouchTargetBlock,
  cramppedBlock,
];

