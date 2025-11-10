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
  LogoBlock,
  SpacerBlock,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  HeroBlock,
  StatsBlock,
  TestimonialBlock,
  FeatureGridBlock,
  ComparisonBlock,
  SocialLinksBlock,
  FooterBlock,
  Padding,
} from './types';

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
  'heading': {
    type: 'heading',
    name: 'Heading',
    description: 'Section heading',
    category: 'content',
    icon: '📝',
    aiHints: [
      'Section titles',
      'Content hierarchy',
      'Break up long text',
    ],
    previewDescription: 'Large text heading',
  },
  'text': {
    type: 'text',
    name: 'Text',
    description: 'Paragraph text',
    category: 'content',
    icon: '📄',
    aiHints: [
      'Body copy',
      'Explanations',
      'Detailed information',
    ],
    previewDescription: 'Body text paragraph',
  },
  'image': {
    type: 'image',
    name: 'Image',
    description: 'Image with optional caption',
    category: 'media',
    icon: '🖼️',
    aiHints: [
      'Product photos',
      'Visual content',
      'Screenshots',
    ],
    previewDescription: 'Full-width image',
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
  'hero': {
    type: 'hero',
    name: 'Hero',
    description: 'Large headline with optional background',
    category: 'layout',
    icon: '⭐',
    aiHints: [
      'Email opening',
      'Major announcements',
      'High impact messages',
    ],
    previewDescription: 'Hero section with large headline',
  },
  'stats': {
    type: 'stats',
    name: 'Stats',
    description: 'Numbers grid (2-4 stats)',
    category: 'layout',
    icon: '📊',
    aiHints: [
      'Impressive numbers',
      'Metrics and achievements',
      'Social proof with data',
    ],
    previewDescription: 'Grid of statistics',
  },
  'testimonial': {
    type: 'testimonial',
    name: 'Testimonial',
    description: 'Customer quote with author',
    category: 'social',
    icon: '💬',
    aiHints: [
      'Social proof',
      'Customer feedback',
      'Trust building',
    ],
    previewDescription: 'Quote with author details',
  },
  'feature-grid': {
    type: 'feature-grid',
    name: 'Feature Grid',
    description: '2-3 features side-by-side',
    category: 'layout',
    icon: '📋',
    aiHints: [
      'Product features',
      'Benefits list',
      'Multiple offerings',
    ],
    previewDescription: 'Grid of features with icons',
  },
  'comparison': {
    type: 'comparison',
    name: 'Comparison',
    description: 'Before/After comparison',
    category: 'layout',
    icon: '⚖️',
    aiHints: [
      'Before and after',
      'Problem vs solution',
      'Transformation stories',
    ],
    previewDescription: 'Two-column before/after',
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
        padding: { top: 40, bottom: 20, left: 20, right: 20 },
      };
    
    case 'spacer':
      return {
        height: 40,
      };
    
    case 'heading':
      return {
        fontSize: '44px',
        fontWeight: 700,
        color: '#111827',
        align: 'left' as const,
        padding: DEFAULT_PADDING,
        lineHeight: '1.2',
      };
    
    case 'text':
      return {
        fontSize: '16px',
        fontWeight: 400,
        color: '#374151',
        align: 'left' as const,
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
    
    case 'hero':
      return {
        backgroundColor: '#f9fafb',
        padding: { top: 60, bottom: 60, left: 40, right: 40 },
        align: 'center' as const,
        headlineFontSize: '56px',
        headlineFontWeight: 800,
        headlineColor: '#111827',
        subheadlineFontSize: '18px',
        subheadlineColor: '#6b7280',
      };
    
    case 'stats':
      return {
        layout: '3-col' as const,
        align: 'center' as const,
        valueFontSize: '64px',
        valueFontWeight: 900,
        valueColor: '#2563eb',
        labelFontSize: '14px',
        labelFontWeight: 600,
        labelColor: '#6b7280',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        spacing: 32,
      };
    
    case 'testimonial':
      return {
        backgroundColor: '#f9fafb',
        borderColor: '#2563eb',
        borderWidth: 4,
        borderRadius: '4px',
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
        quoteFontSize: '18px',
        quoteColor: '#374151',
        quoteFontStyle: 'italic' as const,
        authorFontSize: '14px',
        authorColor: '#6b7280',
        authorFontWeight: 600,
      };
    
    case 'feature-grid':
      return {
        layout: '3-col' as const,
        align: 'center' as const,
        iconSize: '48px',
        titleFontSize: '20px',
        titleFontWeight: 700,
        titleColor: '#111827',
        descriptionFontSize: '14px',
        descriptionColor: '#6b7280',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        spacing: 32,
      };
    
    case 'comparison':
      return {
        beforeBackgroundColor: '#fef2f2',
        afterBackgroundColor: '#f0fdf4',
        beforeLabelColor: '#dc2626',
        afterLabelColor: '#16a34a',
        labelFontSize: '12px',
        labelFontWeight: 600,
        contentFontSize: '14px',
        contentColor: '#374151',
        borderRadius: '4px',
        padding: { top: 24, bottom: 24, left: 0, right: 0 },
        cellPadding: 16,
      };
    
    case 'social-links':
      return {
        align: 'center' as const,
        iconSize: '32px',
        spacing: 16,
        iconStyle: 'color' as const,
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
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
export function getDefaultBlockContent(type: BlockType): any {
  switch (type) {
    case 'logo':
      return {
        imageUrl: 'https://via.placeholder.com/150x50',
        altText: 'Company Logo',
      };
    
    case 'spacer':
      return {};
    
    case 'heading':
      return {
        text: 'Your Heading Here',
      };
    
    case 'text':
      return {
        text: 'Your text content goes here. Edit this to add your message.',
      };
    
    case 'image':
      return {
        imageUrl: 'https://via.placeholder.com/600x400',
        altText: 'Image',
      };
    
    case 'button':
      return {
        text: 'Click Here',
        url: '{{cta_url}}',
      };
    
    case 'divider':
      return {};
    
    case 'hero':
      return {
        headline: 'Welcome to Our Platform',
        subheadline: 'Discover amazing features and possibilities',
      };
    
    case 'stats':
      return {
        stats: [
          { value: '10,000+', label: 'Users' },
          { value: '99.9%', label: 'Uptime' },
          { value: '24/7', label: 'Support' },
        ],
      };
    
    case 'testimonial':
      return {
        quote: 'This product changed everything for our business. Highly recommended!',
        author: 'Jane Doe',
        role: 'CEO',
        company: 'Acme Inc',
      };
    
    case 'feature-grid':
      return {
        features: [
          { icon: '⚡', title: 'Fast', description: 'Lightning fast performance' },
          { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
          { icon: '📱', title: 'Mobile', description: 'Works on any device' },
        ],
      };
    
    case 'comparison':
      return {
        before: {
          text: 'Manual processes taking hours of your time',
        },
        after: {
          text: 'Automated workflows saving 10+ hours per week',
        },
      };
    
    case 'social-links':
      return {
        links: [
          { platform: 'twitter' as const, url: 'https://twitter.com/yourcompany' },
          { platform: 'linkedin' as const, url: 'https://linkedin.com/company/yourcompany' },
          { platform: 'facebook' as const, url: 'https://facebook.com/yourcompany' },
        ],
      };
    
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
    return ['hero', 'stats', 'feature-grid', 'button'];
  }
  
  // Newsletter
  if (lowerType.includes('newsletter') || lowerType.includes('update')) {
    return ['heading', 'text', 'divider', 'image', 'button'];
  }
  
  // Promotion
  if (lowerType.includes('promo') || lowerType.includes('sale') || lowerType.includes('discount')) {
    return ['hero', 'comparison', 'button', 'spacer'];
  }
  
  // Welcome
  if (lowerType.includes('welcome') || lowerType.includes('onboard')) {
    return ['hero', 'text', 'feature-grid', 'button'];
  }
  
  // Testimonial/Social proof
  if (lowerType.includes('testimonial') || lowerType.includes('proof')) {
    return ['testimonial', 'stats', 'button'];
  }
  
  // Default structure
  return ['hero', 'text', 'button', 'footer'];
}

/**
 * Get recommended blocks for a specific use case
 */
export function getBlocksForUseCase(useCase: string): BlockDefinition[] {
  const recommendedTypes = getAIBlockRecommendations(useCase);
  return recommendedTypes.map(type => BLOCK_DEFINITIONS[type]);
}

