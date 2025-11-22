/**
 * Buttons Template Mappings
 * 
 * Defines how to inject ButtonsBlock data into button templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const buttonsMappings: TemplateMapping[] = [
  {
    blockType: 'buttons',
    variant: 'single-button',
    description: 'Single button',
    mappings: [
      {
        selector: 'a[href]',
        repeat: true,
        arrayPath: 'buttons',
        itemMappings: {
          attributes: [
            { attribute: 'href', valuePath: 'url' },
          ],
          content: 'text',
        },
      },
    ],
  },
  {
    blockType: 'buttons',
    variant: 'two-buttons',
    description: 'Two buttons side by side',
    mappings: [
      {
        selector: 'a[href]',
        repeat: true,
        arrayPath: 'buttons',
        itemMappings: {
          attributes: [
            { attribute: 'href', valuePath: 'url' },
          ],
          content: 'text',
        },
      },
    ],
  },
  {
    blockType: 'buttons',
    variant: 'download-buttons',
    description: 'Download buttons',
    mappings: [
      {
        selector: 'a[href]',
        repeat: true,
        arrayPath: 'buttons',
        itemMappings: {
          attributes: [
            { attribute: 'href', valuePath: 'url' },
          ],
          content: 'text',
        },
      },
    ],
  },
];


// Register all mappings
buttonsMappings.forEach(registerMapping);
