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
      { key: 'titleColor', label: 'Title Color', defaultValue: '#111827' },
      { key: 'paragraphColor', label: 'Text Color', defaultValue: '#6b7280' },
      { key: 'dividerColor', label: 'Divider Color', defaultValue: '#e5e7eb' },
      { key: 'buttonBackgroundColor', label: 'Button Background', defaultValue: '#9ca3af' },
      { key: 'buttonTextColor', label: 'Button Text Color', defaultValue: '#ffffff' },
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
    titleColor: '#111827',
    paragraphColor: '#6b7280',
    dividerColor: '#e5e7eb',
    buttonBackgroundColor: '#9ca3af',
    buttonTextColor: '#ffffff',
  },
  
  aiHints: [
    'centered card',
    'prominent number',
    'featured content',
    'highlighted item',
  ],
};

