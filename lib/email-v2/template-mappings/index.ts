/**
 * Template Mappings Index
 * 
 * Central registry for all template mappings
 * Import this file to register all mappings
 */

import type { TemplateMapping } from './types';
import { headerMappings } from './header';
import { headingMappings } from './heading';
import { textMappings } from './text';
import { linkMappings } from './link';
import { buttonsMappings } from './buttons';
import { imageMappings } from './image';
import { avatarsMappings } from './avatars';
import { codeMappings } from './code';
import { markdownMappings } from './markdown';
import { featuresMappings } from './features';
import { testimonialMappings } from './testimonial';
import { statsMappings } from './stats';
import { articleMappings } from './article';
import { articlesMappings } from './articles';
import { feedbackMappings } from './feedback';
import { pricingMappings } from './pricing';
import { ecommerceMappings } from './ecommerce';
import { marketingMappings } from './marketing';
import { heroMappings } from './hero';
import { ctaMappings } from './cta';
import { footerMappings } from './footer';
import { listMappings } from './list';

export * from './types';
export * from './header';
export * from './heading';
export * from './text';
export * from './link';
export * from './buttons';
export * from './image';
export * from './avatars';
export * from './code';
export * from './markdown';
export * from './features';
export * from './testimonial';
export * from './stats';
export * from './article';
export * from './articles';
export * from './feedback';
export * from './pricing';
export * from './ecommerce';
export * from './marketing';
export * from './hero';
export * from './cta';
export * from './footer';
export * from './list';

// Consolidate all mappings into a single array
export const allTemplateMappings: TemplateMapping[] = [
  ...headerMappings,
  ...headingMappings,
  ...textMappings,
  ...linkMappings,
  ...buttonsMappings,
  ...imageMappings,
  ...avatarsMappings,
  ...codeMappings,
  ...markdownMappings,
  ...featuresMappings,
  ...testimonialMappings,
  ...statsMappings,
  ...articleMappings,
  ...articlesMappings,
  ...feedbackMappings,
  ...pricingMappings,
  ...ecommerceMappings,
  ...marketingMappings,
  ...heroMappings,
  ...ctaMappings,
  ...footerMappings,
  ...listMappings,
];

// Create a map for efficient lookup
const templateMappingRegistry = new Map<string, TemplateMapping>();

allTemplateMappings.forEach(mapping => {
  const key = `${mapping.blockType}-${mapping.variant}`;
  templateMappingRegistry.set(key, mapping);
});

export function getTemplateMapping(blockType: string, variant: string): TemplateMapping | undefined {
  return templateMappingRegistry.get(`${blockType}-${variant}`);
}

