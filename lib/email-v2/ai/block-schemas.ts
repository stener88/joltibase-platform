/**
 * Block Content Schemas for Two-Pass Generation
 * 
 * Maps block types to their individual schemas (without blockType discriminator)
 * Used in Pass 2 to generate content for each block independently
 */

import { z } from 'zod';
import {
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
  ArticlesBlockSchema,
  ListBlockSchema,
  EcommerceBlockSchema,
  MarketingBlockSchema,
  HeaderBlockSchema,
  FeedbackBlockSchema,
  HeadingBlockSchema,
  TextBlockSchema,
  LinkBlockSchema,
  ButtonsBlockSchema,
  ImageBlockSchema,
  AvatarsBlockSchema,
  CodeBlockSchema,
  MarkdownBlockSchema,
} from './blocks';

/**
 * Individual block content schemas without the blockType discriminator
 * This makes each schema much simpler for Gemini to handle
 */
export const BLOCK_CONTENT_SCHEMAS: Record<string, z.ZodSchema> = {
  hero: HeroBlockSchema.omit({ blockType: true }),
  features: FeaturesBlockSchema.omit({ blockType: true }),
  content: ContentBlockSchema.omit({ blockType: true }),
  testimonial: TestimonialBlockSchema.omit({ blockType: true }),
  cta: CtaBlockSchema.omit({ blockType: true }),
  footer: FooterBlockSchema.omit({ blockType: true }),
  gallery: GalleryBlockSchema.omit({ blockType: true }),
  stats: StatsBlockSchema.omit({ blockType: true }),
  pricing: PricingBlockSchema.omit({ blockType: true }),
  article: ArticleBlockSchema.omit({ blockType: true }),
  articles: ArticlesBlockSchema.omit({ blockType: true }),
  list: ListBlockSchema.omit({ blockType: true }),
  ecommerce: EcommerceBlockSchema.omit({ blockType: true }),
  marketing: MarketingBlockSchema.omit({ blockType: true }),
  header: HeaderBlockSchema.omit({ blockType: true }),
  feedback: FeedbackBlockSchema.omit({ blockType: true }),
  heading: HeadingBlockSchema.omit({ blockType: true }),
  text: TextBlockSchema.omit({ blockType: true }),
  link: LinkBlockSchema.omit({ blockType: true }),
  buttons: ButtonsBlockSchema.omit({ blockType: true }),
  image: ImageBlockSchema.omit({ blockType: true }),
  avatars: AvatarsBlockSchema.omit({ blockType: true }),
  code: CodeBlockSchema.omit({ blockType: true }),
  markdown: MarkdownBlockSchema.omit({ blockType: true }),
};

/**
 * Get schema for a specific block type
 */
export function getBlockSchema(blockType: string): z.ZodSchema | null {
  return BLOCK_CONTENT_SCHEMAS[blockType] || null;
}

