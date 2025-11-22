/**
 * Text Template Mappings
 * 
 * Defines how to inject TextBlock data into text templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const textMappings: TemplateMapping[] = [
  {
    blockType: 'text',
    variant: 'simple-text',
    description: 'Simple text paragraph',
    mappings: [
      {
        selector: 'p',
        content: 'content',
      },
    ],
  },
  {
    blockType: 'text',
    variant: 'text-with-styling',
    description: 'Text with styling',
    mappings: [
      {
        selector: 'p[style*="font-size:24px"]',
        content: 'content',
      },
      {
        selector: 'p[style*="font-size:16px"]',
        content: 'content',
      },
    ],
  },
];


// Register all mappings
textMappings.forEach(registerMapping);
