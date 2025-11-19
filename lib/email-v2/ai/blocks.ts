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
  imageUrl: z.string().url('Invalid image URL').optional(),
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
  })).min(2, 'At least 2 features required').max(4, 'Maximum 4 features allowed'),
  layout: z.enum(['grid', 'list']).default('grid'),
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
  authorImage: z.string().url('Invalid author image URL').optional(),
  rating: z.number().int().min(1).max(5).optional(),
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

// TypeScript type exports
export type HeroBlock = z.infer<typeof HeroBlockSchema>;
export type FeaturesBlock = z.infer<typeof FeaturesBlockSchema>;
export type ContentBlock = z.infer<typeof ContentBlockSchema>;
export type TestimonialBlock = z.infer<typeof TestimonialBlockSchema>;
export type CtaBlock = z.infer<typeof CtaBlockSchema>;
export type FooterBlock = z.infer<typeof FooterBlockSchema>;
export type SemanticBlock = z.infer<typeof SemanticBlockSchema>;
export type EmailContent = z.infer<typeof EmailContentSchema>;

