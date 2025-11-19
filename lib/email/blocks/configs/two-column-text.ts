/**
 * Two Column Text Layout Configuration
 * 
 * Side-by-side text-only layout with left and right columns.
 * No images or buttons - pure content focus.
 */

import type { LayoutConfig } from './types';

export const twoColumnTextConfig: LayoutConfig = {
  id: 'two-column-text',
  name: 'Two Column Text',
  description: 'Side-by-side text-only layout',
  structure: 'two-column',
  category: 'two-column',
  
  // Two paragraph elements for left and right columns
  elements: [
    {
      type: 'paragraph',
      contentKey: 'leftColumn',
      label: 'Left Column Text',
      required: false,
    },
    {
      type: 'paragraph',
      contentKey: 'rightColumn',
      label: 'Right Column Text',
      required: false,
    },
  ],
  
  settingsControls: {
    toggles: [],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: 'transparent' },
    ],
    spacing: true,
    alignment: false,
    flip: false,
    custom: [
      {
        type: 'select',
        key: 'verticalAlign',
        label: 'Column Alignment',
        options: ['top', 'middle', 'bottom'],
        defaultValue: 'top',
      },
    ],
  },
  
  defaults: {
    backgroundColor: 'transparent',
    padding: {
      top: 40,
      right: 20,
      bottom: 40,
      left: 20,
    },
    align: 'left',
  },
  
  aiHints: [
    'text only',
    'side by side text',
    'no images',
    'content focus',
    'article layout',
  ],
};

