/**
 * Two Column 50/50 Layout Configuration
 * 
 * Side-by-side layout with equal width columns.
 * Elements: image, title, paragraph, button
 */

import type { LayoutConfig } from './types';

export const twoColumn5050Config: LayoutConfig = {
  id: 'two-column-50-50',
  name: 'Two Columns (50/50)',
  description: 'Side-by-side layout with equal width columns',
  structure: 'two-column',
  category: 'two-column',
  
  elements: [
    {
      type: 'image',
      contentKey: 'image',
      label: 'Image',
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
      visibilityKey: 'showTitle',
      defaultVisible: true,
    },
    {
      type: 'paragraph',
      contentKey: 'paragraph',
      label: 'Description',
      required: false,
      visibilityKey: 'showParagraph',
      defaultVisible: true,
    },
    {
      type: 'button',
      contentKey: 'button',
      label: 'Call to Action',
      required: false,
      visibilityKey: 'showButton',
      defaultVisible: true,
      options: {
        includeUrl: true,
      },
    },
  ],
  
  settingsControls: {
    toggles: ['showTitle', 'showParagraph', 'showButton'],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: 'transparent' },
    ],
    spacing: true,
    alignment: false, // Two-column uses left alignment for text
    flip: true, // Allow swapping image/text columns
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
    'side by side',
    'image and text',
    'equal width columns',
    'balanced layout',
  ],
};

