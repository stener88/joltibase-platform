/**
 * Magazine Feature Layout Configuration
 * 
 * Vertical magazine-style layout with title, square image, badge, and description.
 * Unique editorial design for featured content.
 */

import type { LayoutConfig } from './types';

export const magazineFeatureConfig: LayoutConfig = {
  id: 'magazine-feature',
  name: 'Magazine Feature',
  description: 'Editorial-style vertical layout with featured image',
  structure: 'single-column',
  category: 'advanced',
  
  elements: [
    {
      type: 'title',
      contentKey: 'title',
      label: 'Title',
      required: false,
    },
    {
      type: 'image',
      contentKey: 'image',
      label: 'Featured Image',
      required: false,
      options: {
        includeAltText: true,
      },
    },
    {
      type: 'badge',
      contentKey: 'badge',
      label: 'Badge/Number',
      required: false,
    },
    {
      type: 'paragraph',
      contentKey: 'paragraph',
      label: 'Description',
      required: false,
    },
  ],
  
  settingsControls: {
    toggles: [],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: '#9CADB7' },
      { key: 'titleColor', label: 'Title Color', defaultValue: '#111827' },
      { key: 'paragraphColor', label: 'Text Color', defaultValue: '#111827' },
    ],
    spacing: true,
    alignment: false,
    flip: false,
  },
  
  defaults: {
    backgroundColor: '#9CADB7',
    padding: {
      top: 60,
      right: 40,
      bottom: 60,
      left: 40,
    },
    titleColor: '#111827',
    paragraphColor: '#111827',
    titleFontSize: '48px',
  },
  
  aiHints: [
    'magazine style',
    'editorial',
    'featured article',
    'vertical layout',
  ],
};

