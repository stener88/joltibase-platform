/**
 * Code Template Mappings
 * 
 * Defines how to inject CodeBlock data into code templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const codeMappings: TemplateMapping[] = [
  {
    blockType: 'code',
    variant: 'inline-simple',
    description: 'Simple inline code',
    mappings: [
      {
        selector: 'code',
        content: 'code',
      },
    ],
  },
  {
    blockType: 'code',
    variant: 'inline-colors',
    description: 'Inline code with colors',
    mappings: [
      {
        selector: 'code',
        content: 'code',
      },
    ],
  },
  {
    blockType: 'code',
    variant: 'block-no-theme',
    description: 'Code block without theme',
    mappings: [
      {
        selector: 'code, pre',
        content: 'code',
      },
    ],
  },
  {
    blockType: 'code',
    variant: 'predefined-theme',
    description: 'Code block with predefined theme',
    mappings: [
      {
        selector: 'code, pre',
        content: 'code',
      },
    ],
  },
  {
    blockType: 'code',
    variant: 'custom-theme',
    description: 'Code block with custom theme',
    mappings: [
      {
        selector: 'code, pre',
        content: 'code',
      },
    ],
  },
  {
    blockType: 'code',
    variant: 'line-numbers',
    description: 'Code block with line numbers',
    mappings: [
      {
        selector: 'code, pre',
        content: 'code',
      },
    ],
  },
];


// Register all mappings
codeMappings.forEach(registerMapping);
