/**
 * Avatars Template Mappings
 * 
 * Defines how to inject AvatarsBlock data into avatar templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const avatarsMappings: TemplateMapping[] = [
  {
    blockType: 'avatars',
    variant: 'group-stacked',
    description: 'Group of stacked avatars',
    mappings: [
      {
        selector: 'img[alt]',
        repeat: true,
        arrayPath: 'avatars',
        itemMappings: {
          attributes: [
            { attribute: 'src', valuePath: 'imageUrl' },
            { attribute: 'alt', valuePath: 'name' },
          ],
        },
      },
    ],
  },
  {
    blockType: 'avatars',
    variant: 'with-text',
    description: 'Avatars with text labels',
    mappings: [
      {
        selector: 'img[alt]',
        repeat: true,
        arrayPath: 'avatars',
        itemMappings: {
          attributes: [
            { attribute: 'src', valuePath: 'imageUrl' },
            { attribute: 'alt', valuePath: 'name' },
          ],
        },
      },
    ],
  },
  {
    blockType: 'avatars',
    variant: 'circular',
    description: 'Circular avatars',
    mappings: [
      {
        selector: 'img[alt]',
        repeat: true,
        arrayPath: 'avatars',
        itemMappings: {
          attributes: [
            { attribute: 'src', valuePath: 'imageUrl' },
            { attribute: 'alt', valuePath: 'name' },
          ],
        },
      },
    ],
  },
];


// Register all mappings
avatarsMappings.forEach(registerMapping);
