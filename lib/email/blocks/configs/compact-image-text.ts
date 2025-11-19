/**
 * Compact Image Text Layout Configuration
 * 
 * Small image with text inline.
 * Compact horizontal layout for lists or summaries.
 */

import type { LayoutConfig } from './types';

export const compactImageTextConfig: LayoutConfig = {
  id: 'compact-image-text',
  name: 'Compact Image Text',
  description: 'Small image with inline text',
  structure: 'two-column',
  category: 'advanced',
  
  elements: [
    {
      type: 'image',
      contentKey: 'image',
      label: 'Small Image',
      required: false,
      options: {
        includeAltText: true,
      },
    },
    {
      type: 'title',
      contentKey: 'title',
      label: 'Title',
      required: false,
    },
    {
      type: 'subtitle',
      contentKey: 'subtitle',
      label: 'Subtitle',
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
  },
  
  defaults: {
    backgroundColor: 'transparent',
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  },
  
  aiHints: [
    'list item',
    'compact layout',
    'inline image',
    'summary',
  ],
};

