// Central export for all React Email components

export interface ComponentPattern {
  id: string;
  name: string;
  description: string;
  category: 'header' | 'footer' | 'hero' | 'feature' | 'cta' | 'content' | 'navigation' | 'social' | 'testimonial' | 'divider';
  components: string[]; // React Email components used
  template: string;
  placeholders?: string[]; // What needs to be replaced (e.g., ['logoUrl', 'heading', 'ctaText'])
  preview?: string; // For AI to understand when to use it
}

// Import all category files
import { HEADER_COMPONENTS } from './headers';
import { FOOTER_COMPONENTS } from './footers';
import { HERO_COMPONENTS } from './heroes';
import { FEATURE_COMPONENTS } from './features';
import { CTA_COMPONENTS } from './ctas';
import { TESTIMONIAL_COMPONENTS } from './testimonials';
import { CONTENT_COMPONENTS } from './content';
import { IMAGE_COMPONENTS } from './images';
import { AVATAR_COMPONENTS } from './avatars';
import { GALLERY_COMPONENTS } from './galleries';
import { LAYOUT_COMPONENTS } from './layouts';
import { LIST_COMPONENTS } from './lists';
import { CODE_BLOCK_COMPONENTS } from './code-blocks';
import { MARKDOWN_COMPONENTS } from './markdown';
import { ARTICLE_COMPONENTS } from './articles';
import { STATS_COMPONENTS } from './stats';
import { FEEDBACK_COMPONENTS } from './feedback';
import { PRICING_COMPONENTS } from './pricing';
import { ECOMMERCE_COMPONENTS } from './ecommerce';
import { MARKETING_COMPONENTS } from './marketing';
import { NAVIGATION_COMPONENTS } from './navigation';
import { SOCIAL_COMPONENTS } from './social';
import { DIVIDER_COMPONENTS } from './dividers';

// Re-export all
export * from './headers';
export * from './footers';
export * from './heroes';
export * from './features';
export * from './ctas';
export * from './testimonials';
export * from './content';
export * from './images';
export * from './avatars';
export * from './galleries';
export * from './layouts';
export * from './lists';
export * from './code-blocks';
export * from './markdown';
export * from './articles';
export * from './stats';
export * from './feedback';
export * from './pricing';
export * from './ecommerce';
export * from './marketing';
export * from './navigation';
export * from './social';
export * from './dividers';

// Combined collection
export const ALL_COMPONENTS: ComponentPattern[] = [
  ...HEADER_COMPONENTS,
  ...FOOTER_COMPONENTS,
  ...HERO_COMPONENTS,
  ...FEATURE_COMPONENTS,
  ...CTA_COMPONENTS,
  ...TESTIMONIAL_COMPONENTS,
  ...CONTENT_COMPONENTS,
  ...IMAGE_COMPONENTS,
  ...AVATAR_COMPONENTS,
  ...GALLERY_COMPONENTS,
  ...LAYOUT_COMPONENTS,
  ...LIST_COMPONENTS,
  ...CODE_BLOCK_COMPONENTS,
  ...MARKDOWN_COMPONENTS,
  ...ARTICLE_COMPONENTS,
  ...STATS_COMPONENTS,
  ...FEEDBACK_COMPONENTS,
  ...PRICING_COMPONENTS,
  ...ECOMMERCE_COMPONENTS,
  ...MARKETING_COMPONENTS,
  ...NAVIGATION_COMPONENTS,
  ...SOCIAL_COMPONENTS,
  ...DIVIDER_COMPONENTS,
];

// Helper functions for agents
export function getComponentsByCategory(category: ComponentPattern['category']): ComponentPattern[] {
  return ALL_COMPONENTS.filter(c => c.category === category);
}

export function searchComponents(query: string): ComponentPattern[] {
  const lower = query.toLowerCase();
  return ALL_COMPONENTS.filter(c => 
    c.name.toLowerCase().includes(lower) ||
    c.description.toLowerCase().includes(lower) ||
    c.preview?.toLowerCase().includes(lower)
  );
}

export function getComponentById(id: string): ComponentPattern | undefined {
  return ALL_COMPONENTS.find(c => c.id === id);
}

// Stats for debugging
export const COMPONENT_STATS = {
  total: ALL_COMPONENTS.length,
  byCategory: {
    header: HEADER_COMPONENTS.length,
    footer: FOOTER_COMPONENTS.length,
    hero: HERO_COMPONENTS.length,
    feature: FEATURE_COMPONENTS.length,
    cta: CTA_COMPONENTS.length,
    testimonial: TESTIMONIAL_COMPONENTS.length,
    content: CONTENT_COMPONENTS.length,
    images: IMAGE_COMPONENTS.length,
    avatars: AVATAR_COMPONENTS.length,
    galleries: GALLERY_COMPONENTS.length,
    layouts: LAYOUT_COMPONENTS.length,
    lists: LIST_COMPONENTS.length,
    codeBlocks: CODE_BLOCK_COMPONENTS.length,
    markdown: MARKDOWN_COMPONENTS.length,
    articles: ARTICLE_COMPONENTS.length,
    stats: STATS_COMPONENTS.length,
    feedback: FEEDBACK_COMPONENTS.length,
    pricing: PRICING_COMPONENTS.length,
    ecommerce: ECOMMERCE_COMPONENTS.length,
    marketing: MARKETING_COMPONENTS.length,
    navigation: NAVIGATION_COMPONENTS.length,
    social: SOCIAL_COMPONENTS.length,
    divider: DIVIDER_COMPONENTS.length,
  }
};

