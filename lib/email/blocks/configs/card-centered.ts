/**
 * Card Centered Layout Configuration
 * 
 * Centered card with large number, text, divider, and button.
 * Special card design with prominent display.
 */

import type { LayoutConfig } from './types';

export const cardCenteredConfig: LayoutConfig = {
  id: 'card-centered',
  name: 'Card Centered',
  description: 'Centered card with large number and text',
  structure: 'single-column',
  category: 'advanced',
  
  elements: [
    {
      type: 'title',
      contentKey: 'title',
      label: 'Large Number/Title',
      required: false,
    },
    {
      type: 'subtitle',
      contentKey: 'subtitle',
      label: 'Subtitle',
      required: false,
    },
    {
      type: 'divider',
      contentKey: 'divider',
      label: 'Divider',
      required: false,
      defaultVisible: true,
    },
    {
      type: 'paragraph',
      contentKey: 'paragraph',
      label: 'Description',
      required: false,
    },
    {
      type: 'button',
      contentKey: 'button',
      label: 'Call to Action',
      required: false,
      options: {
        includeUrl: true,
      },
    },
  ],
  
  settingsControls: {
    toggles: [],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: '#f9fafb' },
    ],
    spacing: true,
    alignment: false,
    flip: false,
  },
  
  defaults: {
    backgroundColor: '#f9fafb',
    padding: {
      top: 40,
      right: 20,
      bottom: 40,
      left: 20,
    },
  },
  
  aiHints: [
    'centered card',
    'prominent number',
    'featured content',
    'highlighted item',
  ],
};

