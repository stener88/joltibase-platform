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
  TwoColumnBlock,
  ImageOverlayBlock,
  ImageGrid2x2Block,
  ImageGrid3x3Block,
  ImageCollageBlock,
  ThreeColumnBlock,
  ZigzagBlock,
  SplitBackgroundBlock,
  ProductCardBlock,
  BadgeOverlayBlock,
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
  'two-column': {
    type: 'two-column',
    name: 'Two-Column',
    description: 'Side-by-side image + text layout',
    category: 'layout',
    icon: '📐',
    aiHints: [
      'Product features with image',
      'Side-by-side comparisons',
      'Image + description layouts',
    ],
    previewDescription: 'Two columns with image and text',
  },
  'image-overlay': {
    type: 'image-overlay',
    name: 'Image Overlay',
    description: 'Hero image with overlay text and CTA',
    category: 'layout',
    icon: '🎭',
    aiHints: [
      'Dramatic hero sections',
      'Full-width promotional banners',
      'Visual-first announcements',
    ],
    previewDescription: 'Image with overlay content',
  },
  'image-grid-2x2': {
    type: 'image-grid-2x2',
    name: 'Image Grid 2x2',
    description: '2x2 product gallery grid',
    category: 'layout',
    icon: '🎨',
    aiHints: [
      'Product galleries',
      'Portfolio showcases',
      'Multiple offerings',
    ],
    previewDescription: '2x2 image grid with captions',
  },
  'image-grid-3x3': {
    type: 'image-grid-3x3',
    name: 'Image Grid 3x3',
    description: '3x3 compact gallery grid',
    category: 'layout',
    icon: '🖼️',
    aiHints: [
      'Large product collections',
      'Instagram-style feeds',
      'Portfolio galleries',
    ],
    previewDescription: '3x3 compact image grid',
  },
  'image-collage': {
    type: 'image-collage',
    name: 'Image Collage',
    description: 'Featured image with detail shots',
    category: 'layout',
    icon: '🎪',
    aiHints: [
      'Product detail showcase',
      'Lifestyle collections',
      'Editorial layouts',
    ],
    previewDescription: 'Asymmetric collage with featured image',
  },
  'three-column': {
    type: 'three-column',
    name: 'Three-Column',
    description: 'Three columns for features or benefits',
    category: 'layout',
    icon: '🏛️',
    aiHints: [
      'Key benefits',
      'Feature lists',
      'Pricing tiers',
    ],
    previewDescription: 'Three equal columns',
  },
  'zigzag': {
    type: 'zigzag',
    name: 'Zigzag',
    description: 'Alternating image-text rows',
    category: 'layout',
    icon: '⚡',
    aiHints: [
      'Feature showcases',
      'Step-by-step guides',
      'Dynamic presentations',
    ],
    previewDescription: 'Alternating content rows',
  },
  'split-background': {
    type: 'split-background',
    name: 'Split Background',
    description: 'Dramatic split hero with contrasting sides',
    category: 'layout',
    icon: '🎬',
    aiHints: [
      'Bold announcements',
      'High-contrast designs',
      'Premium branding',
    ],
    previewDescription: 'Split background hero',
  },
  'product-card': {
    type: 'product-card',
    name: 'Product Card',
    description: 'E-commerce product card with badge',
    category: 'layout',
    icon: '🛍️',
    aiHints: [
      'E-commerce products',
      'Product promotions',
      'Shopping campaigns',
    ],
    previewDescription: 'Product card with pricing',
  },
  'badge-overlay': {
    type: 'badge-overlay',
    name: 'Badge Overlay',
    description: 'Image with promotional badge',
    category: 'layout',
    icon: '🏷️',
    aiHints: [
      'Sale promotions',
      'Discount announcements',
      'Limited offers',
    ],
    previewDescription: 'Image with badge overlay',
  },
  // Advanced Interactive Blocks (Gemini-powered)
  'carousel': {
    type: 'carousel',
    name: 'Carousel',
    description: 'Multi-slide interactive gallery',
    category: 'layout',
    icon: '🎠',
    aiHints: [
      'Product showcases',
      'Step-by-step guides',
      'Feature tours',
      'Before/after series',
    ],
    previewDescription: 'Interactive image carousel',
  },
  'tab-container': {
    type: 'tab-container',
    name: 'Tab Container',
    description: 'Tabbed content sections',
    category: 'layout',
    icon: '📑',
    aiHints: [
      'Pricing tiers',
      'Feature comparisons',
      'Multi-option displays',
      'FAQs',
    ],
    previewDescription: 'Tabbed content container',
  },
  'accordion': {
    type: 'accordion',
    name: 'Accordion',
    description: 'Expandable/collapsible content',
    category: 'layout',
    icon: '📋',
    aiHints: [
      'FAQs',
      'Feature details',
      'Long content organization',
      'Product specifications',
    ],
    previewDescription: 'Expandable accordion items',
  },
  'masonry-grid': {
    type: 'masonry-grid',
    name: 'Masonry Grid',
    description: 'Pinterest-style auto-flowing layout',
    category: 'layout',
    icon: '🧱',
    aiHints: [
      'Product galleries',
      'Portfolio showcases',
      'Content feeds',
      'Image collections',
    ],
    previewDescription: 'Masonry grid layout',
  },
  'dynamic-column': {
    type: 'dynamic-column',
    name: 'Dynamic Columns',
    description: 'Flexible 2-5 column layout',
    category: 'layout',
    icon: '📊',
    aiHints: [
      'Feature lists',
      'Team members',
      'Comparison tables',
      'Service offerings',
    ],
    previewDescription: 'Flexible multi-column layout',
  },
  'container': {
    type: 'container',
    name: 'Container',
    description: 'Nested block container',
    category: 'layout',
    icon: '📦',
    aiHints: [
      'Complex sections',
      'Grouped content',
      'Advanced layouts',
      'Nested structures',
    ],
    previewDescription: 'Container with nested blocks',
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
    
    case 'two-column':
      return {
        layout: '50-50',
        verticalAlign: 'middle',
        columnGap: 32,
        padding: { top: 48, bottom: 48, left: 24, right: 24 },
      };
    
    case 'image-overlay':
      return {
        overlayPosition: 'center',
        overlayBackgroundColor: '#000000',
        overlayBackgroundOpacity: 50,
        overlayPadding: { top: 40, bottom: 40, left: 40, right: 40 },
        overlayBorderRadius: '8px',
        imageHeight: '500px',
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
      };
    
    case 'image-grid-2x2':
      return {
        gridGap: 16,
        imageHeight: '200px',
        borderRadius: '8px',
        showCaptions: true,
        captionFontSize: '14px',
        captionColor: '#374151',
        padding: { top: 32, bottom: 32, left: 24, right: 24 },
      };
    
    case 'image-grid-3x3':
      return {
        gridGap: 8,
        imageHeight: '120px',
        borderRadius: '4px',
        showCaptions: false,
        padding: { top: 24, bottom: 24, left: 16, right: 16 },
      };
    
    case 'image-collage':
      return {
        layout: 'featured-left',
        gridGap: 12,
        borderRadius: '8px',
        padding: { top: 32, bottom: 32, left: 20, right: 20 },
      };
    
    case 'three-column':
      return {
        layout: 'equal',
        columnGap: 24,
        verticalAlign: 'top',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
      };
    
    case 'zigzag':
      return {
        rowGap: 40,
        columnGap: 32,
        imageWidth: '45%',
        padding: { top: 48, bottom: 48, left: 24, right: 24 },
      };
    
    case 'split-background':
      return {
        layout: '50-50',
        leftBackgroundColor: '#1f2937',
        rightBackgroundColor: '#ffffff',
        columnGap: 0,
        verticalAlign: 'middle',
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        leftColumnPadding: { top: 60, bottom: 60, left: 32, right: 32 },
        rightColumnPadding: { top: 60, bottom: 60, left: 32, right: 32 },
      };
    
    case 'product-card':
      return {
        imageHeight: '400px',
        borderRadius: '12px',
        padding: { top: 32, bottom: 32, left: 24, right: 24 },
        contentPadding: { top: 20, bottom: 20, left: 24, right: 24 },
        backgroundColor: '#ffffff',
        nameFontSize: '24px',
        nameColor: '#111827',
        priceFontSize: '28px',
        priceColor: '#111827',
        descriptionFontSize: '14px',
        descriptionColor: '#6b7280',
      };
    
    case 'badge-overlay':
      return {
        badgePosition: 'top-right',
        badgeSize: 'medium',
        badgeBackgroundColor: '#ef4444',
        badgeTextColor: '#ffffff',
        badgeFontSize: '16px',
        badgeFontWeight: 700,
        imageHeight: '400px',
        borderRadius: '8px',
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
      };
    
    // Advanced Interactive Blocks
    case 'carousel':
      return {
        slideHeight: '400px',
        showIndicators: true,
        indicatorColor: '#d1d5db',
        indicatorActiveColor: '#7c3aed',
        autoPlay: false,
        autoPlayInterval: 5000,
        borderRadius: '8px',
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
      };
    
    case 'tab-container':
      return {
        tabStyle: 'pills',
        tabPosition: 'top',
        activeTabColor: '#7c3aed',
        activeTabTextColor: '#ffffff',
        inactiveTabTextColor: '#6b7280',
        contentPadding: { top: 32, bottom: 32, left: 24, right: 24 },
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
      };
    
    case 'accordion':
      return {
        allowMultiple: false,
        titleFontSize: '18px',
        titleFontWeight: 600,
        titleColor: '#1f2937',
        contentFontSize: '16px',
        contentColor: '#6b7280',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
        itemSpacing: 16,
      };
    
    case 'masonry-grid':
      return {
        columns: 3,
        gap: 16,
        itemBorderRadius: '8px',
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
      };
    
    case 'dynamic-column':
      return {
        columnCount: 3,
        columnGap: 24,
        verticalAlign: 'top',
        mobileStack: true,
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
      };
    
    case 'container':
      return {
        layout: 'stack',
        gridColumns: 2,
        gap: 24,
        borderWidth: 0,
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
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
        imageUrl: '{{logo_url}}',
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
        imageUrl: '{{image_url}}',
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
    
    case 'two-column':
      return {
        leftColumn: {
          type: 'image',
          imageUrl: 'https://via.placeholder.com/600x400',
          imageAltText: 'Image',
        },
        rightColumn: {
          type: 'rich-content',
          richContent: {
            heading: 'Your Heading Here',
            headingSize: '32px',
            headingColor: '#111827',
            body: 'Your content goes here. Add your message and details.',
            bodySize: '16px',
            bodyColor: '#6b7280',
            buttonText: 'Learn More',
            buttonUrl: 'https://example.com',
            buttonColor: '#2563eb',
            buttonTextColor: '#ffffff',
          },
        },
      };
    
    case 'image-overlay':
      return {
        imageUrl: 'https://via.placeholder.com/1200x600',
        imageAltText: 'Hero image',
        heading: 'Your Headline Here',
        headingSize: '48px',
        headingColor: '#ffffff',
        subheading: 'Your subheading text',
        subheadingSize: '20px',
        subheadingColor: '#e5e7eb',
        buttonText: 'Get Started',
        buttonUrl: 'https://example.com',
        buttonColor: '#2563eb',
        buttonTextColor: '#ffffff',
      };
    
    case 'image-grid-2x2':
      return {
        images: [
          { imageUrl: 'https://via.placeholder.com/300x300', altText: 'Image 1', caption: 'Caption 1', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/300x300', altText: 'Image 2', caption: 'Caption 2', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/300x300', altText: 'Image 3', caption: 'Caption 3', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/300x300', altText: 'Image 4', caption: 'Caption 4', linkUrl: 'https://example.com' },
        ],
      };
    
    case 'image-grid-3x3':
      return {
        images: [
          { imageUrl: 'https://via.placeholder.com/200x200', altText: 'Image 1', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/200x200', altText: 'Image 2', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/200x200', altText: 'Image 3', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/200x200', altText: 'Image 4', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/200x200', altText: 'Image 5', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/200x200', altText: 'Image 6', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/200x200', altText: 'Image 7', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/200x200', altText: 'Image 8', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/200x200', altText: 'Image 9', linkUrl: 'https://example.com' },
        ],
      };
    
    case 'image-collage':
      return {
        featuredImage: {
          imageUrl: 'https://via.placeholder.com/600x800',
          altText: 'Featured image',
          linkUrl: 'https://example.com',
        },
        secondaryImages: [
          { imageUrl: 'https://via.placeholder.com/300x400', altText: 'Image 1', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/300x400', altText: 'Image 2', linkUrl: 'https://example.com' },
          { imageUrl: 'https://via.placeholder.com/300x400', altText: 'Image 3', linkUrl: 'https://example.com' },
        ],
      };
    
    case 'three-column':
      return {
        columns: [
          {
            heading: 'Feature 1',
            headingSize: '20px',
            headingColor: '#111827',
            body: 'Description for feature 1',
            bodySize: '14px',
            bodyColor: '#6b7280',
          },
          {
            heading: 'Feature 2',
            headingSize: '20px',
            headingColor: '#111827',
            body: 'Description for feature 2',
            bodySize: '14px',
            bodyColor: '#6b7280',
          },
          {
            heading: 'Feature 3',
            headingSize: '20px',
            headingColor: '#111827',
            body: 'Description for feature 3',
            bodySize: '14px',
            bodyColor: '#6b7280',
          },
        ],
      };
    
    case 'zigzag':
      return {
        rows: [
          {
            imageUrl: 'https://via.placeholder.com/600x400',
            imageAltText: 'Feature 1',
            imagePosition: 'left',
            heading: 'Feature One',
            headingSize: '32px',
            headingColor: '#111827',
            body: 'Description of your first feature',
            bodySize: '16px',
            bodyColor: '#6b7280',
          },
          {
            imageUrl: 'https://via.placeholder.com/600x400',
            imageAltText: 'Feature 2',
            imagePosition: 'right',
            heading: 'Feature Two',
            headingSize: '32px',
            headingColor: '#111827',
            body: 'Description of your second feature',
            bodySize: '16px',
            bodyColor: '#6b7280',
          },
        ],
      };
    
    case 'split-background':
      return {
        leftColumn: {
          heading: 'Your Message',
          headingSize: '44px',
          headingColor: '#ffffff',
          body: 'Your description text goes here',
          bodySize: '18px',
          bodyColor: '#d1d5db',
          buttonText: 'Get Started',
          buttonUrl: 'https://example.com',
          buttonColor: '#fbbf24',
          buttonTextColor: '#111827',
        },
        rightColumn: {
          imageUrl: 'https://via.placeholder.com/600x800',
          imageAltText: 'Hero image',
        },
      };
    
    case 'product-card':
      return {
        productImage: 'https://via.placeholder.com/600x800',
        productImageAlt: 'Product',
        badge: 'NEW',
        badgeColor: '#ef4444',
        badgeTextColor: '#ffffff',
        productName: 'Product Name',
        price: '$99',
        originalPrice: '$129',
        description: 'Product description goes here',
        buttonText: 'Shop Now',
        buttonUrl: 'https://example.com',
        buttonColor: '#2563eb',
        buttonTextColor: '#ffffff',
      };
    
    case 'badge-overlay':
      return {
        imageUrl: 'https://via.placeholder.com/1200x600',
        imageAltText: 'Product',
        badgeText: '50% OFF',
        linkUrl: 'https://example.com',
      };
    
    // Advanced Interactive Blocks
    case 'carousel':
      return {
        slides: [
          {
            imageUrl: 'https://via.placeholder.com/1200x600',
            imageAltText: 'Slide 1',
            heading: 'Welcome',
            text: 'Discover our products',
            buttonText: 'Learn More',
            buttonUrl: 'https://example.com',
          },
          {
            imageUrl: 'https://via.placeholder.com/1200x600',
            imageAltText: 'Slide 2',
            heading: 'Featured',
            text: 'Check out our best sellers',
            buttonText: 'Shop Now',
            buttonUrl: 'https://example.com',
          },
        ],
      };
    
    case 'tab-container':
      return {
        tabs: [
          {
            label: 'Option 1',
            heading: 'First Option',
            text: 'Description for the first option',
            buttonText: 'Get Started',
            buttonUrl: 'https://example.com',
          },
          {
            label: 'Option 2',
            heading: 'Second Option',
            text: 'Description for the second option',
            buttonText: 'Get Started',
            buttonUrl: 'https://example.com',
          },
        ],
      };
    
    case 'accordion':
      return {
        items: [
          {
            title: 'Question 1',
            content: 'Answer to the first question',
            defaultOpen: true,
          },
          {
            title: 'Question 2',
            content: 'Answer to the second question',
            defaultOpen: false,
          },
        ],
      };
    
    case 'masonry-grid':
      return {
        items: [
          {
            type: 'image',
            imageUrl: 'https://via.placeholder.com/400x300',
            imageAltText: 'Item 1',
          },
          {
            type: 'card',
            heading: 'Card Item',
            text: 'Card content',
            backgroundColor: '#f9fafb',
          },
          {
            type: 'image',
            imageUrl: 'https://via.placeholder.com/400x500',
            imageAltText: 'Item 2',
          },
        ],
      };
    
    case 'dynamic-column':
      return {
        columns: [
          {
            heading: 'Column 1',
            text: 'Content for first column',
          },
          {
            heading: 'Column 2',
            text: 'Content for second column',
          },
          {
            heading: 'Column 3',
            text: 'Content for third column',
          },
        ],
      };
    
    case 'container':
      return {
        children: [],
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

