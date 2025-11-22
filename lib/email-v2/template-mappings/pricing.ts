/**
 * Pricing Template Mappings
 * 
 * Defines how to inject PricingBlock data into pricing templates
 */

import { registerMapping, type TemplateMapping } from './types';

/**
 * Simple Pricing Table Mapping
 * Template: templates/pricing/simple-pricing-table.html
 * 
 * Structure:
 * - Plan name/eyebrow text
 * - Price (with currency and interval)
 * - Description
 * - Features list (repeating)
 * - CTA button
 */
const simplePricingTableMapping: TemplateMapping = {
  blockType: 'pricing',
  variant: 'simple-pricing-table',
  description: 'Single pricing card with features',
  mappings: [
    // Eyebrow text
    {
      selector: 'p[style*="text-transform:uppercase"]',
      content: 'plans.0.name',
    },
    // Price
    {
      selector: 'p[style*="font-size:30px"] span[style*="color:rgb(16,24,40)"]',
      content: 'plans.0.price',
    },
    // Price interval
    {
      selector: 'p[style*="font-size:30px"] span[style*="font-size:16px"]',
      content: 'plans.0.interval',
    },
    // Description
    {
      selector: 'p[style*="font-size:14px"][style*="color:rgb(55,65,81)"]',
      content: 'plans.0.description',
    },
    // Features list (repeating)
    {
      selector: 'ul li span',
      repeat: true,
      arrayPath: 'plans.0.features',
      itemMappings: {
        content: '.',
      },
    },
    // CTA button
    {
      selector: 'a[style*="background-color:rgb(79,70,229)"]',
      attributes: [
        { attribute: 'href', valuePath: 'plans.0.ctaUrl' },
      ],
      content: 'plans.0.ctaText',
    },
  ],
};

// Register all pricing mappings
registerMapping(simplePricingTableMapping);

// Export array for index.ts
export const pricingMappings: TemplateMapping[] = [
  simplePricingTableMapping,
];

