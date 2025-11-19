/**
 * Stats 3 Column Layout Configuration
 * 
 * Three-column grid displaying statistics/metrics.
 * Uses items array for multiple stat entries.
 */

import type { LayoutConfig } from './types';

export const stats3ColConfig: LayoutConfig = {
  id: 'stats-3-col',
  name: 'Stats (3 Columns)',
  description: 'Three impressive statistics in a row',
  structure: 'multi-column',
  category: 'multi-column',
  
  elements: [
    {
      type: 'items',
      contentKey: 'items',
      label: 'Stats Items',
      required: false,
      options: {
        itemFields: [
          { key: 'value', label: 'Value', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
        ],
      },
    },
  ],
  
  settingsControls: {
    toggles: [],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: 'transparent' },
    ],
    spacing: true,
    alignment: true,
    flip: false,
  },
  
  defaults: {
    backgroundColor: 'transparent',
    padding: {
      top: 40,
      right: 20,
      bottom: 40,
      left: 20,
    },
    align: 'center',
  },
  
  aiHints: [
    'three metrics',
    'key numbers',
    'statistics',
    'achievements',
  ],
};

