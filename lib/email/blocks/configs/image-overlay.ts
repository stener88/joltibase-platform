/**
 * Image Overlay Layout Configuration
 * 
 * Full-width background image with text overlay.
 * Special positioning for badge and text elements.
 */

import type { LayoutConfig } from './types';

export const imageOverlayConfig: LayoutConfig = {
  id: 'image-overlay',
  name: 'Image Overlay',
  description: 'Full-width image with text overlay',
  structure: 'single-column',
  category: 'advanced',
  
  elements: [
    {
      type: 'image',
      contentKey: 'image',
      label: 'Background Image',
      required: false,
      options: {
        includeAltText: true,
      },
    },
    {
      type: 'badge',
      contentKey: 'badge',
      label: 'Badge Text',
      required: false,
    },
    {
      type: 'title',
      contentKey: 'title',
      label: 'Title',
      required: false,
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
      { key: 'titleColor', label: 'Text Color', defaultValue: '#111827' },
      { key: 'buttonBackgroundColor', label: 'Button Background', defaultValue: '#7c3aed' },
      { key: 'buttonTextColor', label: 'Button Text Color', defaultValue: '#ffffff' },
    ],
    spacing: true,
    alignment: false,
    flip: true, // Controls vertical positioning (top/bottom)
  },
  
  defaults: {
    backgroundColor: '#f9fafb',
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    titleColor: '#111827',
    buttonBackgroundColor: '#7c3aed',
    buttonTextColor: '#ffffff',
  },
  
  aiHints: [
    'hero image',
    'full width background',
    'dramatic opening',
    'visual first',
  ],
};

