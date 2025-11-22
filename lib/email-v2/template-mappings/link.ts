/**
 * Link Template Mappings
 * 
 * Defines how to inject LinkBlock data into link templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const linkMappings: TemplateMapping[] = [
  {
    blockType: 'link',
    variant: 'simple-link',
    description: 'Simple link',
    mappings: [
      {
        selector: 'a[href]',
        attributes: [
          { attribute: 'href', valuePath: 'url' },
        ],
        content: 'text',
      },
    ],
  },
  {
    blockType: 'link',
    variant: 'inline-link',
    description: 'Inline link within text',
    mappings: [
      {
        selector: 'a[href]',
        attributes: [
          { attribute: 'href', valuePath: 'url' },
        ],
        content: 'text',
      },
    ],
  },
];


// Register all mappings
linkMappings.forEach(registerMapping);
