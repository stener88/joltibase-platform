/**
 * Image Template Mappings
 * 
 * Defines how to inject ImageBlock data into image templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const imageMappings: TemplateMapping[] = [
  {
    blockType: 'image',
    variant: 'simple-image',
    description: 'Simple image',
    mappings: [
      {
        selector: 'img',
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'alt' },
        ],
      },
    ],
  },
  {
    blockType: 'image',
    variant: 'rounded-image',
    description: 'Rounded image',
    mappings: [
      {
        selector: 'img',
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'alt' },
        ],
      },
    ],
  },
  {
    blockType: 'image',
    variant: 'varying-sizes',
    description: 'Images with varying sizes',
    mappings: [
      {
        selector: 'img',
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'alt' },
        ],
      },
    ],
  },
];


// Register all mappings
imageMappings.forEach(registerMapping);
