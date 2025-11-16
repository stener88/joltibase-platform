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
  
  // Two text-area elements for left and right columns
  elements: [
    {
      type: 'text-area',
      contentKey: 'leftColumn',
      label: 'Left Column Text',
      required: false,
      options: {
        rows: 6,
      },
    },
    {
      type: 'text-area',
      contentKey: 'rightColumn',
      label: 'Right Column Text',
      required: false,
      options: {
        rows: 6,
      },
    },
  ],
  
  settingsControls: {
    toggles: [],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: 'transparent' },
      { key: 'paragraphColor', label: 'Text Color', defaultValue: '#374151' },
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
    paragraphColor: '#374151',
    paragraphFontSize: '16px',
  },
  
  aiHints: [
    'text only',
    'side by side text',
    'no images',
    'content focus',
    'article layout',
  ],
};

