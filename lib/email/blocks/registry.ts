/**
 * Email Block Registry
 * 
 * Central registry for all block types with:
 * - Block definitions and metadata
 * - Default values and settings
 * - Category organization
 * - Validation schemas
 * - Factory functions
 * - AI usage hints
 */

import type {
  BlockType,
  EmailBlock,
  Padding,
} from './types';

import type { LayoutVariation } from './types-v2';

// ============================================================================
// Block Categories
// ============================================================================

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

// ============================================================================
// Block Metadata
// ============================================================================

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

// ============================================================================
// Default Block Settings
// ============================================================================

const DEFAULT_PADDING: Padding = { top: 20, bottom: 20, left: 20, right: 20 };

/**
 * Get default settings for a block type
 */
export function getDefaultBlockSettings(type: BlockType): any {
  switch (type) {
    case 'logo':
      return {
        align: 'center' as const,
        width: '150px',
        height: 'auto',
        backgroundColor: 'transparent',
        padding: { top: 40, bottom: 20, left: 20, right: 20 },
      };
    
    case 'spacer':
      return {
        height: 40,
        backgroundColor: 'transparent',
      };
    
    case 'text':
      return {
        fontSize: '16px',
        fontWeight: 400,
        fontFamily: undefined, // Uses global font by default
        color: '#374151',
        align: 'left' as const,
        backgroundColor: 'transparent',
        padding: DEFAULT_PADDING,
        lineHeight: '1.6',
      };
    
    case 'image':
      return {
        align: 'center' as const,
        width: '100%',
        height: 'auto',
        borderRadius: '0px',
        padding: DEFAULT_PADDING,
        columns: 1,
        aspectRatio: 'auto' as const,
        gap: 8,
        backgroundColor: 'transparent',
      };
    
    case 'button':
      return {
        style: 'solid' as const,
        color: '#2563eb',
        textColor: '#ffffff',
        align: 'center' as const,
        size: 'medium' as const,
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 600,
        padding: { top: 14, bottom: 14, left: 32, right: 32 },
        containerPadding: { top: 20, bottom: 20, left: 20, right: 20 },
      };
    
    case 'divider':
      return {
        style: 'solid' as const,
        color: '#e5e7eb',
        thickness: 1,
        width: '100%',
        padding: { top: 32, bottom: 32, left: 20, right: 20 },
      };
    
    case 'social-links':
      return {
        align: 'center' as const,
        iconSize: '32px',
        spacing: 24,
        iconStyle: 'color' as const,
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
      };
    
    case 'layouts':
      return {
        padding: { top: 40, right: 20, bottom: 40, left: 20 },
        backgroundColor: 'transparent',
        align: 'center',
        showHeader: true,
        showTitle: true,
        showDivider: false,
        showParagraph: true,
        showButton: true,
        showImage: false,
      };
    
    case 'footer':
      return {
        backgroundColor: '#f9fafb',
        textColor: '#6b7280',
        fontSize: '12px',
        align: 'center' as const,
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        lineHeight: '1.6',
        linkColor: '#2563eb',
      };
    
    default:
      return {};
  }
}

/**
 * Get default content for a block type
 */
export function getDefaultBlockContent(type: BlockType, options?: { layoutVariation?: string }): any {
  switch (type) {
    case 'logo':
      return {
        imageUrl: '',
        altText: 'Company Logo',
      };
    
    case 'spacer':
      return {};
    
    case 'text':
      return {
        text: 'Your text content goes here. Edit this to add your message.',
      };
    
    case 'image':
      return {
        images: [
          {
            url: '',
            altText: 'Image',
            linkUrl: '',
          },
        ],
      };
    
    case 'button':
      return {
        text: 'Click Here',
        url: '{{cta_url}}',
      };
    
    case 'divider':
      return {};
    
    case 'social-links':
      return {
        links: [
          { platform: 'twitter' as const, url: 'https://twitter.com/yourcompany' },
          { platform: 'linkedin' as const, url: 'https://linkedin.com/company/yourcompany' },
          { platform: 'facebook' as const, url: 'https://facebook.com/yourcompany' },
        ],
      };
    
    case 'layouts': {
      const variation = (options as any)?.layoutVariation;
      
      if (variation === 'hero-center') {
        return {
          header: 'Introducing',
          title: 'Your Headline Here',
          paragraph: 'Add your description text here.',
          button: { text: 'Get Started', url: '#' },
        };
      }
      
      if (variation === 'two-column-50-50' || variation === 'two-column-60-40' || variation === 'two-column-40-60') {
        return {
          title: 'Feature Title',
          paragraph: 'Feature description goes here.',
          button: { text: 'Learn More', url: '#' },
          image: { url: '', altText: 'Feature image' },
        };
      }
      
      if (variation === 'stats-2-col') {
        return {
          items: [
            { value: '10K+', title: 'Users', description: 'Active monthly users' },
            { value: '99.9%', title: 'Uptime', description: 'Guaranteed reliability' },
          ],
        };
      }
      
      if (variation === 'stats-3-col') {
        return {
          items: [
            { value: '10K+', title: 'Users', description: 'Active monthly users' },
            { value: '99.9%', title: 'Uptime', description: 'Guaranteed reliability' },
            { value: '24/7', title: 'Support', description: 'Always here to help' },
          ],
        };
      }
      
      if (variation === 'stats-4-col') {
        return {
          items: [
            { value: '10K+', title: 'Users', description: 'Active monthly users' },
            { value: '99.9%', title: 'Uptime', description: 'Guaranteed reliability' },
            { value: '24/7', title: 'Support', description: 'Always here to help' },
            { value: '<1s', title: 'Response', description: 'Lightning fast' },
          ],
        };
      }
      
      // New layout variations
      if (variation === 'image-overlay') {
        return {
          title: 'A LITTLE GIFT OF THANKS FOR JOINING THE LIST',
          badge: '003',
          paragraph: 'Your exclusive content awaits',
          image: { url: '', altText: 'Background image' },
        };
      }
      
      if (variation === 'card-centered') {
        return {
          title: '6',
          subtitle: 'Tips to Photograph Food',
          paragraph: 'I remember my first try at food photography. I created this guide to help you get started without making all the mistakes I did.',
          button: { text: 'READ IT', url: '#' },
          divider: true,
        };
      }
      
      if (variation === 'compact-image-text') {
        return {
          title: 'One',
          subtitle: 'Click here for my creamy butternut squash soup',
          image: { url: '', altText: 'Recipe preview' },
        };
      }
      
      // Default content for unknown variations
      return {
        title: 'Layout Title',
        paragraph: 'Add your content here.',
      };
    }
    
    case 'footer':
      return {
        companyName: '{{company_name}}',
        companyAddress: '123 Main St, City, State 12345',
        customText: 'Questions? Just reply to this email.',
        unsubscribeUrl: '{{unsubscribe_url}}',
        preferencesUrl: '{{preferences_url}}',
      };
    
    default:
      return {};
  }
}

// ============================================================================
// Block Factory Functions
// ============================================================================

/**
 * Create a new block with default settings
 */
export function createDefaultBlock(type: BlockType, position: number = 0): EmailBlock {
  return {
    id: generateBlockId(),
    type,
    position,
    settings: getDefaultBlockSettings(type) as any,
    content: getDefaultBlockContent(type) as any,
  };
}

/**
 * Generate unique block ID
 */
export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// Registry Queries
// ============================================================================

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

// ============================================================================
// Block Validation
// ============================================================================

// NOTE: Validation functions moved to lib/email/blocks/schemas.ts
// Use Zod schemas for runtime validation:
//   import { validateBlock, validateBlocks } from './schemas';
//
// This provides:
// - Runtime type safety
// - Better error messages
// - Schema-based validation
// - Type inference

// ============================================================================
// AI Hints System
// ============================================================================

/**
 * Get AI recommendations for block usage
 */
export function getAIBlockRecommendations(campaignType: string): BlockType[] {
  const lowerType = campaignType.toLowerCase();
  
  // Product launch
  if (lowerType.includes('launch') || lowerType.includes('announcement')) {
    return ['logo', 'text', 'image', 'button'];
  }
  
  // Newsletter
  if (lowerType.includes('newsletter') || lowerType.includes('update')) {
    return ['logo', 'text', 'divider', 'image', 'button'];
  }
  
  // Promotion
  if (lowerType.includes('promo') || lowerType.includes('sale') || lowerType.includes('discount')) {
    return ['logo', 'text', 'button', 'spacer'];
  }
  
  // Welcome
  if (lowerType.includes('welcome') || lowerType.includes('onboard')) {
    return ['logo', 'text', 'image', 'button'];
  }
  
  // Testimonial/Social proof
  if (lowerType.includes('testimonial') || lowerType.includes('proof')) {
    return ['logo', 'text', 'button'];
  }
  
  // Default structure
  return ['logo', 'text', 'button', 'footer'];
}

/**
 * Get recommended blocks for a specific use case
 */
export function getBlocksForUseCase(useCase: string): BlockDefinition[] {
  const recommendedTypes = getAIBlockRecommendations(useCase);
  return recommendedTypes.map(type => BLOCK_DEFINITIONS[type]);
}

// ============================================================================
// V2 BLOCK SYSTEM - Layout Variation Metadata
// ============================================================================

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
 * Metadata for all 60+ layout variations
 */
export const LAYOUT_VARIATION_DEFINITIONS: Record<LayoutVariation, LayoutVariationDefinition> = {
  // Content layouts (8)
  'hero-center': {
    variation: 'hero-center',
    name: 'Hero Center',
    description: 'Centered hero with headline and subheadline',
    category: 'content',
    icon: '⭐',
    aiHints: ['email opening', 'major announcement', 'centered headline'],
  },
  'hero-image-overlay': {
    variation: 'hero-image-overlay',
    name: 'Hero Image Overlay',
    description: 'Full-width image with text overlay',
    category: 'content',
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
  'testimonial-centered': {
    variation: 'testimonial-centered',
    name: 'Testimonial Centered',
    description: 'Centered testimonial quote with author',
    category: 'content',
    icon: '💬',
    aiHints: ['customer quote', 'social proof', 'centered testimonial'],
  },
  'testimonial-with-image': {
    variation: 'testimonial-with-image',
    name: 'Testimonial with Image',
    description: 'Testimonial with author photo',
    category: 'content',
    icon: '💬',
    aiHints: ['customer quote with photo', 'personal testimonial'],
  },
  'testimonial-card': {
    variation: 'testimonial-card',
    name: 'Testimonial Card',
    description: 'Card-style testimonial with border',
    category: 'content',
    icon: '💬',
    aiHints: ['boxed testimonial', 'card design', 'highlighted quote'],
  },
  
  // Two-column (5)
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
  
  // Three-column (3)
  'three-column-equal': {
    variation: 'three-column-equal',
    name: 'Three Columns Equal',
    description: 'Three equal-width columns',
    category: 'three-column',
    icon: '🏛️',
    aiHints: ['three features', 'pricing tiers', 'benefits'],
  },
  'three-column-wide-center': {
    variation: 'three-column-wide-center',
    name: 'Three Columns (Wide Center)',
    description: 'Three columns with wide center',
    category: 'three-column',
    icon: '🏛️',
    aiHints: ['featured center', 'highlight middle'],
  },
  'three-column-wide-outer': {
    variation: 'three-column-wide-outer',
    name: 'Three Columns (Wide Outer)',
    description: 'Three columns with wide outer columns',
    category: 'three-column',
    icon: '🏛️',
    aiHints: ['narrow center', 'emphasis on sides'],
  },
  
  // Four+ columns (2)
  'four-column-equal': {
    variation: 'four-column-equal',
    name: 'Four Columns Equal',
    description: 'Four equal-width columns',
    category: 'four-plus-column',
    icon: '📊',
    aiHints: ['multiple options', 'feature grid', 'team members'],
  },
  'five-column-equal': {
    variation: 'five-column-equal',
    name: 'Five Columns Equal',
    description: 'Five equal-width columns',
    category: 'four-plus-column',
    icon: '📊',
    aiHints: ['many options', 'dense grid', 'icon row'],
  },
  
  // Image layouts (11)
  'image-overlay-center': {
    variation: 'image-overlay-center',
    name: 'Image Overlay Center',
    description: 'Image with centered text overlay',
    category: 'image',
    icon: '🎨',
    aiHints: ['hero image', 'centered text', 'dramatic'],
  },
  'image-overlay-top-left': {
    variation: 'image-overlay-top-left',
    name: 'Image Overlay Top Left',
    description: 'Image with top-left text overlay',
    category: 'image',
    icon: '🎨',
    aiHints: ['header image', 'top-left text'],
  },
  'image-overlay-top-right': {
    variation: 'image-overlay-top-right',
    name: 'Image Overlay Top Right',
    description: 'Image with top-right text overlay',
    category: 'image',
    icon: '🎨',
    aiHints: ['header image', 'top-right text'],
  },
  'image-overlay-bottom-left': {
    variation: 'image-overlay-bottom-left',
    name: 'Image Overlay Bottom Left',
    description: 'Image with bottom-left text overlay',
    category: 'image',
    icon: '🎨',
    aiHints: ['footer image', 'bottom-left text'],
  },
  'image-overlay-bottom-right': {
    variation: 'image-overlay-bottom-right',
    name: 'Image Overlay Bottom Right',
    description: 'Image with bottom-right text overlay',
    category: 'image',
    icon: '🎨',
    aiHints: ['footer image', 'bottom-right text'],
  },
  'image-overlay-center-bottom': {
    variation: 'image-overlay-center-bottom',
    name: 'Image Overlay Center Bottom',
    description: 'Image with center-bottom text overlay',
    category: 'image',
    icon: '🎨',
    aiHints: ['centered bottom text', 'banner style'],
  },
  'image-collage-featured-left': {
    variation: 'image-collage-featured-left',
    name: 'Image Collage (Featured Left)',
    description: 'Asymmetric collage with featured left image',
    category: 'image',
    icon: '🎪',
    aiHints: ['featured product', 'detail shots', 'left emphasis'],
  },
  'image-collage-featured-right': {
    variation: 'image-collage-featured-right',
    name: 'Image Collage (Featured Right)',
    description: 'Asymmetric collage with featured right image',
    category: 'image',
    icon: '🎪',
    aiHints: ['featured product', 'detail shots', 'right emphasis'],
  },
  'image-collage-featured-center': {
    variation: 'image-collage-featured-center',
    name: 'Image Collage (Featured Center)',
    description: 'Asymmetric collage with featured center image',
    category: 'image',
    icon: '🎪',
    aiHints: ['featured product', 'detail shots', 'center emphasis'],
  },
  
  // Advanced layouts (13)
  'image-overlay': {
    variation: 'image-overlay',
    name: 'Image Overlay',
    description: 'Text overlaid on background image with badge',
    category: 'image',
    icon: '🎨',
    aiHints: ['background image', 'text overlay', 'badge number'],
  },
  'card-centered': {
    variation: 'card-centered',
    name: 'Card Centered',
    description: 'Centered card with large number and content',
    category: 'advanced',
    icon: '🎴',
    aiHints: ['card layout', 'centered content', 'numbered section'],
  },
  'compact-image-text': {
    variation: 'compact-image-text',
    name: 'Compact Image Text',
    description: 'Small image with text side-by-side',
    category: 'two-column',
    icon: '📝',
    aiHints: ['compact layout', 'image and text', 'recipe preview'],
  },
  'two-column-text': {
    variation: 'two-column-text',
    name: 'Two Column Text',
    description: 'Two columns of text side-by-side',
    category: 'content',
    icon: '📄',
    aiHints: ['long form content', 'text layout', 'story telling', 'newsletter'],
  },
  'magazine-feature': {
    variation: 'magazine-feature',
    name: 'Magazine Feature',
    description: 'Vertical layout with title, square image with number overlay, and description',
    category: 'content',
    icon: '📰',
    aiHints: ['magazine style', 'featured article', 'numbered section', 'editorial design'],
  },
  'zigzag-2-rows': {
    variation: 'zigzag-2-rows',
    name: 'Zigzag (2 Rows)',
    description: 'Alternating image-text layout with 2 rows',
    category: 'advanced',
    icon: '⚡',
    aiHints: ['alternating content', 'feature showcase', 'two features'],
  },
  'zigzag-3-rows': {
    variation: 'zigzag-3-rows',
    name: 'Zigzag (3 Rows)',
    description: 'Alternating image-text layout with 3 rows',
    category: 'advanced',
    icon: '⚡',
    aiHints: ['alternating content', 'feature showcase', 'three features'],
  },
  'zigzag-4-rows': {
    variation: 'zigzag-4-rows',
    name: 'Zigzag (4 Rows)',
    description: 'Alternating image-text layout with 4 rows',
    category: 'advanced',
    icon: '⚡',
    aiHints: ['alternating content', 'feature showcase', 'four features'],
  },
  'split-background': {
    variation: 'split-background',
    name: 'Split Background',
    description: 'Dramatic split with contrasting backgrounds',
    category: 'advanced',
    icon: '🎬',
    aiHints: ['bold design', 'contrast', 'premium branding'],
  },
  'product-card-image-top': {
    variation: 'product-card-image-top',
    name: 'Product Card (Image Top)',
    description: 'E-commerce product card with image on top',
    category: 'advanced',
    icon: '🛍️',
    aiHints: ['product display', 'e-commerce', 'pricing'],
  },
  'product-card-image-left': {
    variation: 'product-card-image-left',
    name: 'Product Card (Image Left)',
    description: 'E-commerce product card with side image',
    category: 'advanced',
    icon: '🛍️',
    aiHints: ['product display', 'e-commerce', 'horizontal card'],
  },
  'badge-overlay-corner': {
    variation: 'badge-overlay-corner',
    name: 'Badge Overlay Corner',
    description: 'Image with corner badge (sale, new, etc.)',
    category: 'advanced',
    icon: '🏷️',
    aiHints: ['sale badge', 'promotion', 'corner label'],
  },
  'badge-overlay-center': {
    variation: 'badge-overlay-center',
    name: 'Badge Overlay Center',
    description: 'Image with center badge',
    category: 'advanced',
    icon: '🏷️',
    aiHints: ['centered badge', 'discount', 'center label'],
  },
  'feature-grid-2-items': {
    variation: 'feature-grid-2-items',
    name: 'Feature Grid (2 Items)',
    description: 'Grid of 2 features with icons',
    category: 'advanced',
    icon: '📋',
    aiHints: ['two features', 'benefits', 'icon grid'],
  },
  'feature-grid-3-items': {
    variation: 'feature-grid-3-items',
    name: 'Feature Grid (3 Items)',
    description: 'Grid of 3 features with icons',
    category: 'advanced',
    icon: '📋',
    aiHints: ['three features', 'benefits', 'icon grid'],
  },
  'feature-grid-4-items': {
    variation: 'feature-grid-4-items',
    name: 'Feature Grid (4 Items)',
    description: 'Grid of 4 features with icons',
    category: 'advanced',
    icon: '📋',
    aiHints: ['four features', 'benefits', 'icon grid'],
  },
  'feature-grid-6-items': {
    variation: 'feature-grid-6-items',
    name: 'Feature Grid (6 Items)',
    description: 'Grid of 6 features with icons',
    category: 'advanced',
    icon: '📋',
    aiHints: ['six features', 'comprehensive benefits', 'icon grid'],
  },
  'comparison-table-2-col': {
    variation: 'comparison-table-2-col',
    name: 'Comparison Table (2 Columns)',
    description: 'Before/after or comparison table with 2 columns',
    category: 'advanced',
    icon: '⚖️',
    aiHints: ['before after', 'comparison', 'two options'],
  },
  'comparison-table-3-col': {
    variation: 'comparison-table-3-col',
    name: 'Comparison Table (3 Columns)',
    description: 'Comparison table with 3 columns',
    category: 'advanced',
    icon: '⚖️',
    aiHints: ['pricing tiers', 'plan comparison', 'three options'],
  },
  
  // Interactive (12)
  'carousel-2-slides': {
    variation: 'carousel-2-slides',
    name: 'Carousel (2 Slides)',
    description: 'Image carousel with 2 slides',
    category: 'interactive',
    icon: '🎠',
    aiHints: ['slideshow', 'two images', 'interactive'],
  },
  'carousel-3-5-slides': {
    variation: 'carousel-3-5-slides',
    name: 'Carousel (3-5 Slides)',
    description: 'Image carousel with 3-5 slides',
    category: 'interactive',
    icon: '🎠',
    aiHints: ['slideshow', 'multiple images', 'interactive'],
  },
  'carousel-6-10-slides': {
    variation: 'carousel-6-10-slides',
    name: 'Carousel (6-10 Slides)',
    description: 'Image carousel with 6-10 slides',
    category: 'interactive',
    icon: '🎠',
    aiHints: ['large slideshow', 'many images', 'interactive'],
  },
  'tabs-2-tabs': {
    variation: 'tabs-2-tabs',
    name: 'Tabs (2 Tabs)',
    description: 'Tabbed content with 2 tabs',
    category: 'interactive',
    icon: '📑',
    aiHints: ['two options', 'switchable content', 'tabs'],
  },
  'tabs-3-5-tabs': {
    variation: 'tabs-3-5-tabs',
    name: 'Tabs (3-5 Tabs)',
    description: 'Tabbed content with 3-5 tabs',
    category: 'interactive',
    icon: '📑',
    aiHints: ['multiple options', 'switchable content', 'tabs'],
  },
  'tabs-6-8-tabs': {
    variation: 'tabs-6-8-tabs',
    name: 'Tabs (6-8 Tabs)',
    description: 'Tabbed content with 6-8 tabs',
    category: 'interactive',
    icon: '📑',
    aiHints: ['many options', 'switchable content', 'tabs'],
  },
  'accordion-2-items': {
    variation: 'accordion-2-items',
    name: 'Accordion (2 Items)',
    description: 'Collapsible accordion with 2 items',
    category: 'interactive',
    icon: '📋',
    aiHints: ['expandable', 'FAQ', 'two questions'],
  },
  'accordion-3-5-items': {
    variation: 'accordion-3-5-items',
    name: 'Accordion (3-5 Items)',
    description: 'Collapsible accordion with 3-5 items',
    category: 'interactive',
    icon: '📋',
    aiHints: ['expandable', 'FAQ', 'multiple questions'],
  },
  'accordion-6-10-items': {
    variation: 'accordion-6-10-items',
    name: 'Accordion (6-10 Items)',
    description: 'Collapsible accordion with 6-10 items',
    category: 'interactive',
    icon: '📋',
    aiHints: ['expandable', 'FAQ', 'many questions'],
  },
  'masonry-2-col': {
    variation: 'masonry-2-col',
    name: 'Masonry (2 Columns)',
    description: 'Pinterest-style masonry grid with 2 columns',
    category: 'interactive',
    icon: '🧱',
    aiHints: ['masonry', 'pinterest style', 'two columns'],
  },
  'masonry-3-col': {
    variation: 'masonry-3-col',
    name: 'Masonry (3 Columns)',
    description: 'Pinterest-style masonry grid with 3 columns',
    category: 'interactive',
    icon: '🧱',
    aiHints: ['masonry', 'pinterest style', 'three columns'],
  },
  'masonry-4-col': {
    variation: 'masonry-4-col',
    name: 'Masonry (4 Columns)',
    description: 'Pinterest-style masonry grid with 4 columns',
    category: 'interactive',
    icon: '🧱',
    aiHints: ['masonry', 'pinterest style', 'four columns'],
  },
  'masonry-5-col': {
    variation: 'masonry-5-col',
    name: 'Masonry (5 Columns)',
    description: 'Pinterest-style masonry grid with 5 columns',
    category: 'interactive',
    icon: '🧱',
    aiHints: ['masonry', 'pinterest style', 'five columns'],
  },
  'container-stack': {
    variation: 'container-stack',
    name: 'Container Stack',
    description: 'Vertical stacking container for nested blocks',
    category: 'interactive',
    icon: '📦',
    aiHints: ['nested blocks', 'vertical stack', 'container'],
  },
  'container-grid': {
    variation: 'container-grid',
    name: 'Container Grid',
    description: 'Grid container for nested blocks',
    category: 'interactive',
    icon: '📦',
    aiHints: ['nested blocks', 'grid layout', 'container'],
  },
  'container-flex': {
    variation: 'container-flex',
    name: 'Container Flex',
    description: 'Flexible container for nested blocks',
    category: 'interactive',
    icon: '📦',
    aiHints: ['nested blocks', 'flexible layout', 'container'],
  },
};

/**
 * Get all layout variations by category
 */
export function getLayoutVariationsByCategory(category: LayoutVariationCategory): LayoutVariationDefinition[] {
  return Object.values(LAYOUT_VARIATION_DEFINITIONS).filter(def => def.category === category);
}

/**
 * Get layout variation definition
 */
export function getLayoutVariationDefinition(variation: LayoutVariation): LayoutVariationDefinition {
  return LAYOUT_VARIATION_DEFINITIONS[variation];
}

// ============================================================================
// V2 Block Factory Functions
// ============================================================================

/**
 * Create a layout block with a specific variation
 */
export function createLayoutBlock(variation: LayoutVariation, position: number = 0): EmailBlock {
  return {
    id: generateBlockId(),
    type: 'layouts',
    position,
    layoutVariation: variation,
    settings: getDefaultLayoutSettings(variation),
    content: getDefaultLayoutContent(variation),
  };
}

/**
 * Create a link-bar block
 */
export function createLinkBarBlock(position: number = 0): EmailBlock {
  return {
    id: generateBlockId(),
    type: 'link-bar',
    position,
    settings: {
      layout: 'horizontal',
      align: 'center',
      spacing: 24,
      fontSize: '14px',
      fontWeight: 500,
      color: '#2563eb',
      hoverColor: '#1d4ed8',
      padding: DEFAULT_PADDING,
    },
    content: {
      links: [
        { label: 'Home', url: '{{home_url}}' },
        { label: 'Shop', url: '{{shop_url}}' },
        { label: 'About', url: '{{about_url}}' },
        { label: 'Contact', url: '{{contact_url}}' },
      ],
    },
  };
}

/**
 * Create an address block
 */
export function createAddressBlock(position: number = 0): EmailBlock {
  return {
    id: generateBlockId(),
    type: 'address',
    position,
    settings: {
      align: 'center',
      fontSize: '12px',
      color: '#6b7280',
      lineHeight: '1.6',
      showMapLink: false,
      padding: DEFAULT_PADDING,
    },
    content: {
      companyName: '{{company_name}}',
      street: '{{company_address}}',
      city: '{{company_city}}',
      state: '{{company_state}}',
      zip: '{{company_zip}}',
      country: '{{company_country}}',
    },
  };
}

/**
 * Get default settings for a layout variation
 */
function getDefaultLayoutSettings(variation: LayoutVariation): Record<string, any> {
  const category = LAYOUT_VARIATION_DEFINITIONS[variation].category;
  
  // Common settings by category - ALL TOGGLES ON for premium defaults
  const baseSettings = {
    padding: DEFAULT_PADDING,
    showHeader: true,
    showTitle: true,
    showParagraph: true,
    showButton: true,
    showDivider: true,
    showImage: true,
  };
  
  // Category-specific defaults
  if (category === 'content') {
    if (variation.startsWith('hero')) {
      return {
        ...baseSettings,
        padding: { top: 60, bottom: 60, left: 40, right: 40 },
        backgroundColor: '#f9fafb',
        align: 'center',
        headlineFontSize: '56px',
        headlineFontWeight: 800,
        headlineColor: '#111827',
        subheadlineFontSize: '18px',
        subheadlineColor: '#6b7280',
        titleFontSize: '48px',
        titleColor: '#111827',
        headerColor: '#6b7280',
        paragraphColor: '#374151',
      };
    }
    if (variation.startsWith('stats')) {
      return {
        ...baseSettings,
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        align: 'center',
        valueFontSize: '64px',
        valueFontWeight: 900,
        valueColor: '#2563eb',
        labelFontSize: '14px',
        labelFontWeight: 600,
        labelColor: '#6b7280',
        spacing: 32,
      };
    }
    if (variation.startsWith('testimonial')) {
      return {
        ...baseSettings,
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
        backgroundColor: '#f9fafb',
        borderColor: '#2563eb',
        borderWidth: 4,
        borderRadius: '4px',
        quoteFontSize: '18px',
        quoteColor: '#374151',
        quoteFontStyle: 'italic',
        authorFontSize: '14px',
        authorColor: '#6b7280',
        authorFontWeight: 600,
      };
    }
    if (variation === 'two-column-text') {
      return {
        ...baseSettings,
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        backgroundColor: 'transparent',
        paragraphFontSize: '16px',
        paragraphColor: '#374151',
      };
    }
    if (variation === 'magazine-feature') {
      return {
        ...baseSettings,
        padding: { top: 60, bottom: 60, left: 40, right: 40 },
        backgroundColor: '#9CADB7',
        titleFontSize: '48px',
        titleColor: '#111827',
        paragraphColor: '#111827',
        borderRadius: '0px',
      };
    }
  }
  
  if (category === 'two-column' || category === 'three-column' || category === 'four-plus-column') {
    return {
      ...baseSettings,
      columnGap: 24,
      verticalAlign: 'top',
      padding: { top: 40, bottom: 40, left: 20, right: 20 },
      titleFontSize: '32px',
      titleColor: '#111827',
      paragraphColor: '#374151',
    };
  }
  
  if (category === 'image') {
    return {
      ...baseSettings,
      borderRadius: '8px',
      imageHeight: '400px',
    };
  }
  
  if (category === 'advanced') {
    return {
      ...baseSettings,
      padding: { top: 40, bottom: 40, left: 20, right: 20 },
      titleFontSize: '32px',
      titleColor: '#111827',
      paragraphColor: '#374151',
    };
  }
  
  return baseSettings;
}

/**
 * Get default content for a layout variation
 */
function getDefaultLayoutContent(variation: LayoutVariation): Record<string, any> {
  const category = LAYOUT_VARIATION_DEFINITIONS[variation]?.category;
  
  // Specific variations first - ALL WITH PREMIUM, COMPLETE CONTENT
  if (variation === 'hero-center') {
    return {
      header: 'Introducing',
      title: 'Transform Your Business Today',
      paragraph: 'Join thousands of successful companies using our platform to drive growth, streamline operations, and achieve remarkable results.',
      button: { text: 'Get Started Free', url: '#' },
      divider: true,
    };
  }
  
  if (variation === 'image-overlay') {
    return {
      title: 'A LITTLE GIFT OF THANKS FOR JOINING THE LIST',
      badge: '003',
      paragraph: 'Your exclusive content awaits - discover insider tips, special offers, and premium resources',
      button: { text: 'Unlock Now', url: '#' },
      image: { url: '', altText: 'Background image' },
    };
  }
  
  if (variation === 'card-centered') {
    return {
      title: '6',
      subtitle: 'Tips to Photograph Food',
      paragraph: 'I remember my first try at food photography. I created this guide to help you get started without making all the mistakes I did.',
      button: { text: 'READ IT', url: '#' },
      divider: true,
    };
  }
  
  if (variation === 'compact-image-text') {
    return {
      title: 'One',
      subtitle: 'Click here for my creamy butternut squash soup',
      image: { url: '', altText: 'Recipe preview' },
    };
  }
  
  if (variation === 'two-column-text') {
    return {
      leftColumn: 'Neil Armstrong made it all the way to the moon, but he couldn\'t have dreamed of doing so without the best team supporting the whole journey, and that\'s who YOU are for us. Yep, my friend—you read that right, you\'re our mission control. It\'s true.',
      rightColumn: 'Your unwavering support, whether big or small, creates space for us to share what we love, run with our wild ideas, and build incredible things together. And, of course, we hope you\'re lovin\' it, too. Thank you for getting us to, well, our own kind of moon.',
    };
  }
  
  if (variation === 'magazine-feature') {
    return {
      title: 'Rose my way',
      badge: '01',
      paragraph: 'Since we recently discovered homemade gnocchi, dinners at home have never been quite the same. Check out this easy homemade gnocchi recipe that will transform the way you think about pasta.',
      image: { url: '', altText: 'Feature image' },
    };
  }
  
  // Category-based defaults
  if (category === 'content') {
    if (variation.startsWith('stats')) {
      const count = variation === 'stats-2-col' ? 2 : variation === 'stats-3-col' ? 3 : 4;
      return {
        items: [
          { value: '10K+', title: 'Active Users', description: 'Growing every day' },
          { value: '99.9%', title: 'Uptime', description: 'Guaranteed reliability' },
          { value: '24/7', title: 'Support', description: 'Always here to help' },
          { value: '<1s', title: 'Response Time', description: 'Lightning fast' },
        ].slice(0, count),
      };
    }
    if (variation.startsWith('testimonial')) {
      return {
        quote: 'This product changed everything for our business. The results exceeded our expectations, and the support team has been incredible throughout our journey.',
        author: 'Sarah Johnson',
        role: 'CEO',
        company: 'Tech Innovations Inc',
      };
    }
  }
  
  if (category === 'two-column') {
    return {
      title: 'Discover What Makes Us Different',
      paragraph: 'Our innovative approach combines cutting-edge technology with personalized service to deliver exceptional results. Whether you\'re just starting out or scaling up, we have the tools and expertise to help you succeed.',
      button: { text: 'Learn More', url: '#' },
      image: { url: '', altText: 'Feature showcase' },
    };
  }
  
  if (category === 'advanced') {
    return {
      title: 'Premium Feature',
      paragraph: 'Experience the power of our advanced tools designed to elevate your business to new heights.',
      button: { text: 'Explore Features', url: '#' },
    };
  }
  
  // Default - still premium
  return {
    title: 'Your Amazing Headline',
    paragraph: 'Craft compelling content that resonates with your audience and drives real results.',
    button: { text: 'Take Action', url: '#' },
  };
}
