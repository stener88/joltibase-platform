/**
 * Hero Template Mappings
 * 
 * Defines how to inject HeroBlock data into hero templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const heroMappings: TemplateMapping[] = [
  {
    blockType: 'hero',
    variant: 'simple',
    description: 'Simple hero section with headline, subheadline, and CTA',
    mappings: [
      {
        selector: 'h1',
        content: 'headline',
      },
      {
        selector: 'p',
        content: 'subheadline',
      },
      {
        selector: 'a',
        attributes: [
          { attribute: 'href', valuePath: 'ctaUrl' },
        ],
        content: 'ctaText',
      },
    ],
  },
];

// Register all hero mappings
heroMappings.forEach(registerMapping);

