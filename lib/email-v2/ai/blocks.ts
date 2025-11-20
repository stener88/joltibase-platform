/**
 * Semantic Block Schemas for AI Email Generation
 * 
 * Defines content block types that AI generates (hero, features, etc.)
 * These are then transformed into React Email components deterministically
 */

import { z } from 'zod';

/**
 * Hero Section Block
 * Full-width header with headline, optional subtitle, and CTA button
 */
export const HeroBlockSchema = z.object({
  blockType: z.literal('hero'),
  headline: z.string().min(1, 'Headline is required').max(100, 'Headline too long'),
  subheadline: z.string().max(200, 'Subheadline too long').optional(),
  ctaText: z.string().min(1, 'CTA text is required').max(50, 'CTA text too long'),
  ctaUrl: z.string().url('Invalid CTA URL'),
  imageKeyword: z.string().max(60, 'Image keyword too long').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  variant: z.enum(['centered', 'split']).default('centered'),
});

/**
 * Features Section Block
 * Grid of 2-4 features with titles and descriptions
 */
export const FeaturesBlockSchema = z.object({
  blockType: z.literal('features'),
  heading: z.string().max(100, 'Heading too long').optional(),
  subheading: z.string().max(200, 'Subheading too long').optional(),
  features: z.array(z.object({
    title: z.string().min(1, 'Feature title is required').max(50, 'Feature title too long'),
    description: z.string().min(1, 'Feature description is required').max(200, 'Feature description too long'),
    icon: z.enum(['check', 'star', 'heart', 'lightning', 'shield', 'lock', 'clock', 'globe']).optional(),
    imageKeyword: z.string().max(60, 'Image keyword too long').optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
  })).min(2, 'At least 2 features required').max(4, 'Maximum 4 features allowed'),
  layout: z.enum(['grid', 'list']).default('grid'),
  variant: z.enum(['grid', 'list', 'numbered', 'icons-2col', 'icons-centered']).default('grid'),
});

/**
 * Content Section Block
 * Text content with optional heading and image
 */
export const ContentBlockSchema = z.object({
  blockType: z.literal('content'),
  heading: z.string().max(100, 'Heading too long').optional(),
  paragraphs: z.array(z.string().min(1, 'Paragraph cannot be empty').max(500, 'Paragraph too long'))
    .min(1, 'At least 1 paragraph required')
    .max(5, 'Maximum 5 paragraphs allowed'),
  imageKeyword: z.string().max(60, 'Image keyword too long').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  imageAlt: z.string().max(100, 'Image alt text too long').optional(),
  imagePosition: z.enum(['left', 'right', 'top', 'bottom']).default('top'),
});

/**
 * Testimonial Section Block
 * Customer quote with author information
 */
export const TestimonialBlockSchema = z.object({
  blockType: z.literal('testimonial'),
  quote: z.string().min(10, 'Quote too short').max(300, 'Quote too long'),
  authorName: z.string().min(1, 'Author name is required').max(100, 'Author name too long'),
  authorTitle: z.string().max(100, 'Author title too long').optional(),
  authorCompany: z.string().max(100, 'Author company too long').optional(),
  authorImageKeyword: z.string().max(50, 'Author image keyword too long').optional(),
  authorImage: z.string().url('Invalid author image URL').optional(),
  rating: z.number().int().min(1).max(5).optional(),
  variant: z.enum(['centered', 'large-avatar']).default('centered'),
});

/**
 * CTA Section Block
 * Centered call-to-action with headline and button
 */
export const CtaBlockSchema = z.object({
  blockType: z.literal('cta'),
  headline: z.string().min(1, 'Headline is required').max(100, 'Headline too long'),
  subheadline: z.string().max(200, 'Subheadline too long').optional(),
  buttonText: z.string().min(1, 'Button text is required').max(50, 'Button text too long'),
  buttonUrl: z.string().url('Invalid button URL'),
  style: z.enum(['primary', 'secondary', 'outline']).default('primary'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
});

/**
 * Footer Section Block
 * Company info, links, and unsubscribe
 */
export const FooterBlockSchema = z.object({
  blockType: z.literal('footer'),
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  address: z.string().max(200, 'Address too long').optional(),
  unsubscribeUrl: z.string().url('Invalid unsubscribe URL'),
  preferenceUrl: z.string().url('Invalid preference URL').optional(),
  socialLinks: z.array(z.object({
    platform: z.enum(['twitter', 'linkedin', 'facebook', 'instagram', 'youtube', 'github']),
    url: z.string().url('Invalid social link URL'),
  })).max(5, 'Maximum 5 social links allowed').optional(),
  additionalLinks: z.array(z.object({
    text: z.string().max(50, 'Link text too long'),
    url: z.string().url('Invalid link URL'),
  })).max(5, 'Maximum 5 additional links allowed').optional(),
  variant: z.enum(['one-column', 'two-column']).default('one-column'),
  photoCredits: z.array(z.string()).optional(),
});

/**
 * Gallery Section Block
 * Image gallery with multiple layout options
 */
export const GalleryBlockSchema = z.object({
  blockType: z.literal('gallery'),
  heading: z.string().max(100, 'Heading too long').optional(),
  subheading: z.string().max(200, 'Subheading too long').optional(),
  images: z.array(z.object({
    keyword: z.string().max(60, 'Image keyword too long').optional(),
    url: z.string().url('Invalid image URL'),
    alt: z.string().max(100, 'Image alt text too long'),
    link: z.string().url('Invalid link URL').optional(),
  })).min(2, 'At least 2 images required').max(6, 'Maximum 6 images required'),
  variant: z.enum(['grid-2x2', '3-column', 'horizontal-split', 'vertical-split']).default('grid-2x2'),
});

/**
 * Stats Section Block
 * Display key metrics and statistics
 */
export const StatsBlockSchema = z.object({
  blockType: z.literal('stats'),
  heading: z.string().max(100, 'Heading too long').optional(),
  subheading: z.string().max(200, 'Subheading too long').optional(),
  stats: z.array(z.object({
    value: z.string().max(20, 'Stat value too long'),
    label: z.string().max(50, 'Stat label too long'),
    description: z.string().max(200, 'Stat description too long').optional(),
  })).min(2, 'At least 2 stats required').max(4, 'Maximum 4 stats allowed'),
  variant: z.enum(['simple', 'stepped']).default('simple'),
});

/**
 * Pricing Section Block
 * Pricing table or card
 */
export const PricingBlockSchema = z.object({
  blockType: z.literal('pricing'),
  heading: z.string().max(100, 'Heading too long').optional(),
  subheading: z.string().max(200, 'Subheading too long').optional(),
  plans: z.array(z.object({
    name: z.string().max(50, 'Plan name too long'),
    price: z.string().max(30, 'Price too long'),
    interval: z.string().max(20, 'Interval too long').optional(),
    description: z.string().max(200, 'Description too long').optional(),
    features: z.array(z.string().max(100, 'Feature too long')).max(10, 'Maximum 10 features'),
    ctaText: z.string().max(30, 'CTA text too long'),
    ctaUrl: z.string().url('Invalid CTA URL'),
    highlighted: z.boolean().default(false),
  })).min(1, 'At least 1 plan required').max(3, 'Maximum 3 plans allowed'),
  variant: z.enum(['simple', 'two-tier']).default('simple'),
});

/**
 * Article Section Block
 * Article or blog post content with various layouts
 */
export const ArticleBlockSchema = z.object({
  blockType: z.literal('article'),
  eyebrow: z.string().max(50, 'Eyebrow too long').optional(),
  headline: z.string().min(1, 'Headline is required').max(150, 'Headline too long'),
  excerpt: z.string().max(500, 'Excerpt too long').optional(),
  imageKeyword: z.string().max(60, 'Image keyword too long').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  imageAlt: z.string().max(100, 'Image alt text too long').optional(),
  ctaText: z.string().max(30, 'CTA text too long').optional(),
  ctaUrl: z.string().url('Invalid CTA URL').optional(),
  author: z.object({
    name: z.string().max(100, 'Author name too long'),
    title: z.string().max(100, 'Author title too long').optional(),
    imageKeyword: z.string().max(60, 'Author image keyword too long').optional(),
    imageUrl: z.string().url('Invalid author image URL').optional(),
    socialLinks: z.array(z.object({
      platform: z.enum(['twitter', 'linkedin']),
      url: z.string().url('Invalid social URL'),
    })).max(2, 'Maximum 2 social links').optional(),
  }).optional(),
  variant: z.enum(['image-top', 'image-right', 'image-background', 'two-cards', 'single-author', 'multiple-authors']).default('image-top'),
});

/**
 * List Section Block
 * Numbered or bulleted list with optional images
 */
export const ListBlockSchema = z.object({
  blockType: z.literal('list'),
  heading: z.string().max(100, 'Heading too long').optional(),
  items: z.array(z.object({
    title: z.string().max(100, 'Item title too long'),
    description: z.string().max(300, 'Item description too long'),
    imageKeyword: z.string().max(60, 'Image keyword too long').optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
    link: z.string().url('Invalid link URL').optional(),
  })).min(2, 'At least 2 items required').max(5, 'Maximum 5 items allowed'),
  variant: z.enum(['numbered', 'image-left']).default('numbered'),
});

/**
 * Ecommerce Product Block
 * Product showcase with various layouts
 */
export const EcommerceBlockSchema = z.object({
  blockType: z.literal('ecommerce'),
  heading: z.string().max(100, 'Heading too long').optional(),
  subheading: z.string().max(200, 'Subheading too long').optional(),
  products: z.array(z.object({
    name: z.string().max(100, 'Product name too long'),
    description: z.string().max(300, 'Product description too long').optional(),
    price: z.string().max(30, 'Price too long'),
    imageKeyword: z.string().max(60, 'Image keyword too long').optional(),
    imageUrl: z.string().url('Invalid image URL'),
    ctaText: z.string().max(30, 'CTA text too long'),
    ctaUrl: z.string().url('Invalid CTA URL'),
  })).min(1, 'At least 1 product required').max(4, 'Maximum 4 products allowed'),
  variant: z.enum(['single', 'image-left', '3-column', '4-grid', 'checkout']).default('single'),
});

/**
 * Marketing Block (Bento Grid)
 * Featured product showcase with asymmetric grid layout
 */
export const MarketingBlockSchema = z.object({
  blockType: z.literal('marketing'),
  heading: z.string().max(100, 'Heading too long').optional(),
  subheading: z.string().max(200, 'Subheading too long').optional(),
  featuredItem: z.object({
    title: z.string().max(100, 'Title too long'),
    description: z.string().max(300, 'Description too long').optional(),
    imageKeyword: z.string().max(60, 'Image keyword too long').optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
    imageAlt: z.string().max(100, 'Image alt text too long').optional(),
    ctaText: z.string().max(30, 'CTA text too long').optional(),
    ctaUrl: z.string().url('Invalid CTA URL').optional(),
  }),
  items: z.array(z.object({
    title: z.string().max(100, 'Title too long'),
    description: z.string().max(300, 'Description too long').optional(),
    imageKeyword: z.string().max(60, 'Image keyword too long').optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
    imageAlt: z.string().max(100, 'Image alt text too long').optional(),
    ctaText: z.string().max(30, 'CTA text too long').optional(),
    ctaUrl: z.string().url('Invalid CTA URL').optional(),
  })).min(2, 'At least 2 items required').max(4, 'Maximum 4 items allowed'),
  variant: z.enum(['bento-grid']).default('bento-grid'),
});

/**
 * Header Block
 * Newsletter header with logo and navigation
 */
export const HeaderBlockSchema = z.object({
  blockType: z.literal('header'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  logoAlt: z.string().max(100, 'Logo alt text too long').optional(),
  companyName: z.string().max(100, 'Company name too long').optional(),
  menuItems: z.array(z.object({
    label: z.string().max(50, 'Menu label too long'),
    url: z.string().url('Invalid menu URL'),
  })).max(6, 'Maximum 6 menu items allowed').optional(),
  socialLinks: z.array(z.object({
    platform: z.enum(['twitter', 'facebook', 'instagram', 'linkedin']),
    url: z.string().url('Invalid social URL'),
    icon: z.boolean().optional(),
  })).max(5, 'Maximum 5 social links allowed').optional(),
  variant: z.enum(['centered-menu', 'side-menu', 'social-icons']).default('centered-menu'),
});

/**
 * Feedback Block
 * Customer feedback collection and display
 */
export const FeedbackBlockSchema = z.object({
  blockType: z.literal('feedback'),
  heading: z.string().max(100, 'Heading too long').optional(),
  subheading: z.string().max(200, 'Subheading too long').optional(),
  ctaText: z.string().max(50, 'CTA text too long').optional(),
  ctaUrl: z.string().url('Invalid CTA URL').optional(),
  questions: z.array(z.object({
    text: z.string().max(200, 'Question text too long'),
    options: z.array(z.string().max(100, 'Option text too long')).optional(),
  })).max(5, 'Maximum 5 questions allowed').optional(),
  reviews: z.array(z.object({
    text: z.string().max(500, 'Review text too long'),
    authorName: z.string().max(100, 'Author name too long'),
    authorTitle: z.string().max(100, 'Author title too long').optional(),
    rating: z.number().int().min(1).max(5).optional(),
  })).max(4, 'Maximum 4 reviews allowed').optional(),
  variant: z.enum(['simple-rating', 'survey', 'customer-reviews']).default('simple-rating'),
});

/**
 * Discriminated union of all block types
 * Uses blockType as discriminator for type-safe handling
 */
export const SemanticBlockSchema = z.discriminatedUnion('blockType', [
  HeroBlockSchema,
  FeaturesBlockSchema,
  ContentBlockSchema,
  TestimonialBlockSchema,
  CtaBlockSchema,
  FooterBlockSchema,
  GalleryBlockSchema,
  StatsBlockSchema,
  PricingBlockSchema,
  ArticleBlockSchema,
  ListBlockSchema,
  EcommerceBlockSchema,
  MarketingBlockSchema,
  HeaderBlockSchema,
  FeedbackBlockSchema,
]);

/**
 * Complete email content structure
 * Includes preview text and array of semantic blocks
 */
export const EmailContentSchema = z.object({
  previewText: z.string()
    .min(1, 'Preview text is required')
    .max(140, 'Preview text too long (max 140 characters)'),
  blocks: z.array(SemanticBlockSchema)
    .min(2, 'At least 2 blocks required (hero + footer recommended)')
    .max(8, 'Maximum 8 blocks allowed'),
});

/**
 * Create dynamic email content schema with configurable block limit
 * Used for complex campaigns that need more blocks
 */
export function createEmailContentSchema(maxBlocks: number = 8) {
  return z.object({
    previewText: z.string()
      .min(1, 'Preview text is required')
      .max(140, 'Preview text too long (max 140 characters)'),
    blocks: z.array(SemanticBlockSchema)
      .min(2, 'At least 2 blocks required (hero + footer recommended)')
      .max(maxBlocks, `Maximum ${maxBlocks} blocks allowed`),
  });
}

/**
 * Get appropriate max blocks based on campaign type and prompt context
 * 
 * @param campaignType - Campaign type (one-time, sequence, newsletter, etc.)
 * @param prompt - User's prompt text
 * @param structureHints - Optional structure hints from prompt analysis (item count, grid layout, etc.)
 * @returns Maximum number of blocks allowed
 */
export function getMaxBlocksForCampaign(
  campaignType?: string, 
  prompt?: string,
  structureHints?: { itemCount?: number; gridLayout?: { columns: number; rows: number } }
): number {
  // NEW: If structure hints suggest many items, increase block limit
  if (structureHints?.itemCount) {
    if (structureHints.itemCount > 20) {
      return 15; // Very large grids need more blocks
    } else if (structureHints.itemCount > 12) {
      return 12; // Large grids
    } else if (structureHints.itemCount > 8) {
      return 10; // Medium grids
    }
  }
  
  // Check prompt for promotional keywords
  const promotionalKeywords = ['black friday', 'sale', 'discount', 'promotion', 'deal', 'offer', 'limited time', 'flash sale', 'cyber monday', 'holiday sale', 'launch'];
  const isPromotional = prompt ? promotionalKeywords.some(keyword => prompt.toLowerCase().includes(keyword)) : false;
  
  // If promotional content detected in prompt, use higher limit
  if (isPromotional) {
    return 12;
  }
  
  // Otherwise check campaign type
  switch (campaignType?.toLowerCase()) {
    case 'promotional':
    case 'sale':
    case 'black-friday':
    case 'holiday':
    case 'launch':
      return 12; // Complex promotional campaigns
    
    case 'newsletter':
    case 'announcement':
      return 10; // Medium complexity
    
    case 'transactional':
    case 'welcome':
    case 'notification':
      return 6; // Simple transactional emails
    
    default:
      return 8; // Standard campaigns
  }
}

// TypeScript type exports
export type HeroBlock = z.infer<typeof HeroBlockSchema>;
export type FeaturesBlock = z.infer<typeof FeaturesBlockSchema>;
export type ContentBlock = z.infer<typeof ContentBlockSchema>;
export type TestimonialBlock = z.infer<typeof TestimonialBlockSchema>;
export type CtaBlock = z.infer<typeof CtaBlockSchema>;
export type FooterBlock = z.infer<typeof FooterBlockSchema>;
export type GalleryBlock = z.infer<typeof GalleryBlockSchema>;
export type StatsBlock = z.infer<typeof StatsBlockSchema>;
export type PricingBlock = z.infer<typeof PricingBlockSchema>;
export type ArticleBlock = z.infer<typeof ArticleBlockSchema>;
export type ListBlock = z.infer<typeof ListBlockSchema>;
export type EcommerceBlock = z.infer<typeof EcommerceBlockSchema>;
export type MarketingBlock = z.infer<typeof MarketingBlockSchema>;
export type HeaderBlock = z.infer<typeof HeaderBlockSchema>;
export type FeedbackBlock = z.infer<typeof FeedbackBlockSchema>;
export type SemanticBlock = z.infer<typeof SemanticBlockSchema>;
export type EmailContent = z.infer<typeof EmailContentSchema>;


