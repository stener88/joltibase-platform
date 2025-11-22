/**
 * CTA Template Mappings
 * 
 * Defines how to inject CtaBlock data into CTA templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const ctaMappings: TemplateMapping[] = [
  {
    blockType: 'cta',
    variant: 'simple',
    description: 'Simple call-to-action section',
    mappings: [
      {
        selector: 'h2',
        content: 'headline',
      },
      {
        selector: 'p',
        content: 'subheadline',
      },
      {
        selector: 'a',
        attributes: [
          { attribute: 'href', valuePath: 'buttonUrl' },
        ],
        content: 'buttonText',
      },
    ],
  },
  // Map style variants to same mapping (template registry maps them to simple template)
  {
    blockType: 'cta',
    variant: 'primary',
    description: 'Primary CTA (maps to simple template)',
    mappings: [
      {
        selector: 'h2',
        content: 'headline',
      },
      {
        selector: 'p',
        content: 'subheadline',
      },
      {
        selector: 'a',
        attributes: [
          { attribute: 'href', valuePath: 'buttonUrl' },
        ],
        content: 'buttonText',
      },
    ],
  },
  {
    blockType: 'cta',
    variant: 'secondary',
    description: 'Secondary CTA (maps to simple template)',
    mappings: [
      {
        selector: 'h2',
        content: 'headline',
      },
      {
        selector: 'p',
        content: 'subheadline',
      },
      {
        selector: 'a',
        attributes: [
          { attribute: 'href', valuePath: 'buttonUrl' },
        ],
        content: 'buttonText',
      },
    ],
  },
  {
    blockType: 'cta',
    variant: 'outline',
    description: 'Outline CTA (maps to simple template)',
    mappings: [
      {
        selector: 'h2',
        content: 'headline',
      },
      {
        selector: 'p',
        content: 'subheadline',
      },
      {
        selector: 'a',
        attributes: [
          { attribute: 'href', valuePath: 'buttonUrl' },
        ],
        content: 'buttonText',
      },
    ],
  },
];

// Register all CTA mappings
ctaMappings.forEach(registerMapping);

