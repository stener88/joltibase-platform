/**
 * Two Column 70/30 Layout Configuration
 * 
 * Side-by-side layout with dominant left column (70%) and narrow right column (30%).
 * Elements: image, title, paragraph, button
 */

import type { LayoutConfig } from './types';

export const twoColumn7030Config: LayoutConfig = {
  id: 'two-column-70-30',
  name: 'Two Columns (70/30)',
  description: 'Side-by-side layout with 70% left, 30% right columns',
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
      { key: 'titleColor', label: 'Title Color', defaultValue: '#111827' },
      { key: 'paragraphColor', label: 'Text Color', defaultValue: '#374151' },
      { key: 'buttonBackgroundColor', label: 'Button Background', defaultValue: '#7c3aed' },
      { key: 'buttonTextColor', label: 'Button Text Color', defaultValue: '#ffffff' },
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
    titleColor: '#111827',
    paragraphColor: '#374151',
    buttonBackgroundColor: '#7c3aed',
    buttonTextColor: '#ffffff',
  },
  
  aiHints: [
    'side by side',
    'prominent content',
    '70/30 split',
    'content dominant',
  ],
};

