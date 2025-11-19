/**
 * Stats 2 Column Layout Configuration
 * 
 * Two-column grid displaying statistics/metrics.
 * Uses items array for multiple stat entries.
 */

import type { LayoutConfig } from './types';

export const stats2ColConfig: LayoutConfig = {
  id: 'stats-2-col',
  name: 'Stats (2 Columns)',
  description: 'Two impressive statistics side-by-side',
  structure: 'multi-column',
  category: 'multi-column',
  
  // Stats use items array, not individual elements
  // Renderer: renderStatsLayout() in layout-blocks.ts
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
    'statistics',
    'metrics',
    'numbers',
    'achievements',
    'key figures',
  ],
};

