/**
 * Markdown Template Mappings
 * 
 * Defines how to inject MarkdownBlock data into markdown templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const markdownMappings: TemplateMapping[] = [
  {
    blockType: 'markdown',
    variant: 'simple',
    description: 'Simple markdown rendering',
    mappings: [
      {
        selector: 'div[data-id="react-email-markdown"]',
        content: 'content',
      },
    ],
  },
  {
    blockType: 'markdown',
    variant: 'container-styles',
    description: 'Markdown with container styles',
    mappings: [
      {
        selector: 'div[data-id="react-email-markdown"]',
        content: 'content',
      },
    ],
  },
  {
    blockType: 'markdown',
    variant: 'custom-styles',
    description: 'Markdown with custom styles',
    mappings: [
      {
        selector: 'div[data-id="react-email-markdown"]',
        content: 'content',
      },
    ],
  },
];


// Register all mappings
markdownMappings.forEach(registerMapping);
