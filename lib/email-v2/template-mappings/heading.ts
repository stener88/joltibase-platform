/**
 * Heading Template Mappings
 * 
 * Defines how to inject HeadingBlock data into heading templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const headingMappings: TemplateMapping[] = [
  {
    blockType: 'heading',
    variant: 'simple-heading',
    description: 'Simple single heading',
    mappings: [
      {
        selector: 'h1',
        content: 'heading',
      },
    ],
  },
  {
    blockType: 'heading',
    variant: 'multiple-headings',
    description: 'Multiple headings',
    mappings: [
      {
        selector: 'h1[data-id="react-email-heading"]',
        repeat: true,
        arrayPath: 'headings',
        itemMappings: {
          content: 'text',
        },
      },
      {
        selector: 'h2[data-id="react-email-heading"]',
        repeat: true,
        arrayPath: 'headings',
        itemMappings: {
          content: 'text',
        },
      },
      {
        selector: 'h3[data-id="react-email-heading"]',
        repeat: true,
        arrayPath: 'headings',
        itemMappings: {
          content: 'text',
        },
      },
    ],
  },
  {
    blockType: 'heading',
    variant: 'multiple-headings-alt',
    description: 'Multiple headings alternative layout',
    mappings: [
      {
        selector: 'h1[data-id="react-email-heading"], h2[data-id="react-email-heading"], h3[data-id="react-email-heading"]',
        repeat: true,
        arrayPath: 'headings',
        itemMappings: {
          content: 'text',
        },
      },
    ],
  },
];

// Register all heading mappings
headingMappings.forEach(registerMapping);
