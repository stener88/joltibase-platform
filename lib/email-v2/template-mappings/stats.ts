/**
 * Stats Template Mappings
 * 
 * Defines how to inject StatsBlock data into stats templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const statsMappings: TemplateMapping[] = [
  {
    blockType: 'stats',
    variant: 'simple',
    description: 'Simple stats display',
    mappings: [
      {
        selector: 'p',
        repeat: true,
        arrayPath: 'stats',
        itemMappings: {
          content: 'value',
        },
      },
    ],
  },
  {
    blockType: 'stats',
    variant: 'stepped',
    description: 'Stepped stats display',
    mappings: [
      {
        selector: 'p',
        repeat: true,
        arrayPath: 'stats',
        itemMappings: {
          content: 'value',
        },
      },
    ],
  },
];


// Register all mappings
statsMappings.forEach(registerMapping);
