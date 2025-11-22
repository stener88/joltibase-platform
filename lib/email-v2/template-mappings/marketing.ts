/**
 * Marketing Template Mappings
 * 
 * Defines how to inject MarketingBlock data into marketing templates
 */

import { registerMapping, type TemplateMapping } from './types';

/**
 * Bento Grid Mapping
 * Template: templates/marketing/bento-grid.html
 * 
 * Structure:
 * - Featured item (large hero section with image)
 * - Secondary items (smaller cards below)
 */
const bentoGridMapping: TemplateMapping = {
  blockType: 'marketing',
  variant: 'bento-grid',
  description: 'Bento-style grid marketing layout',
  mappings: [
    // Featured item heading
    {
      selector: 'h1[style*="color:rgb(255,255,255)"]',
      content: 'featuredItem.title',
    },
    // Featured item description
    {
      selector: 'p[style*="color:rgb(255,255,255,0.6)"]',
      content: 'featuredItem.description',
    },
    // Featured item CTA link
    {
      selector: 'a[style*="color:rgb(255,255,255,0.8)"]',
      attributes: [
        { attribute: 'href', valuePath: 'featuredItem.ctaUrl' },
      ],
      content: 'featuredItem.ctaText',
    },
    // Featured item image
    {
      selector: 'td[data-id="__react-email-column"][style*="width:42%"] img',
      attributes: [
        { attribute: 'src', valuePath: 'featuredItem.imageUrl' },
        { attribute: 'alt', valuePath: 'featuredItem.imageAlt' },
      ],
    },
    // Secondary items (repeating)
    {
      selector: 'td[data-id="__react-email-column"][style*="max-width:180px"]',
      repeat: true,
      arrayPath: 'items',
      itemMappings: {
        attributes: [],
        content: '',
      },
    },
    // Secondary item images (repeating)
    {
      selector: 'td[data-id="__react-email-column"][style*="max-width:180px"] img',
      repeat: true,
      arrayPath: 'items',
      itemMappings: {
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'imageAlt' },
        ],
      },
    },
    // Secondary item titles (repeating)
    {
      selector: 'td[data-id="__react-email-column"][style*="max-width:180px"] h2',
      repeat: true,
      arrayPath: 'items',
      itemMappings: {
        content: 'title',
      },
    },
    // Secondary item descriptions (repeating)
    {
      selector: 'td[data-id="__react-email-column"][style*="max-width:180px"] p[style*="color:rgb(107,114,128)"]',
      repeat: true,
      arrayPath: 'items',
      itemMappings: {
        content: 'description',
      },
    },
  ],
};

// Register all marketing mappings
registerMapping(bentoGridMapping);

// Export array for index.ts
export const marketingMappings: TemplateMapping[] = [
  bentoGridMapping,
];

