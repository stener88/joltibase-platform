/**
 * Two Column 30/70 Layout Configuration
 * 
 * Side-by-side layout with narrow left column (30%) and dominant right column (70%).
 * Elements: image, title, paragraph, button
 */

import type { LayoutConfig } from './types';

export const twoColumn3070Config: LayoutConfig = {
  id: 'two-column-30-70',
  name: 'Two Columns (30/70)',
  description: 'Side-by-side layout with 30% left, 70% right columns',
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
    alignment: false,
    flip: true,
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
    'text-heavy',
    '30/70 split',
    'sidebar layout',
  ],
};

