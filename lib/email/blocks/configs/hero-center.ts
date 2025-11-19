/**
 * Hero Center Layout Configuration
 * 
 * Single-column vertically stacked layout with centered content.
 * Elements: header (eyebrow), title, divider, paragraph, button
 */

import type { LayoutConfig } from './types';

export const heroCenterConfig: LayoutConfig = {
  id: 'hero-center',
  name: 'Hero Center',
  description: 'Vertically stacked hero section with centered content',
  structure: 'single-column',
  category: 'content',
  
  elements: [
    {
      type: 'header',
      contentKey: 'header',
      label: 'Eyebrow Text',
      required: false,
      visibilityKey: 'showHeader',
      defaultVisible: true,
    },
    {
      type: 'title',
      contentKey: 'title',
      label: 'Headline',
      required: true,
      visibilityKey: 'showTitle',
      defaultVisible: true,
    },
    {
      type: 'divider',
      contentKey: 'divider',
      label: 'Divider Line',
      required: false,
      visibilityKey: 'showDivider',
      defaultVisible: false,
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
    toggles: ['showHeader', 'showTitle', 'showDivider', 'showParagraph', 'showButton'],
    colors: [
      { key: 'backgroundColor', label: 'Background Color', defaultValue: 'transparent' },
    ],
    spacing: true,
    alignment: true,
    flip: false,
  },
  
  defaults: {
    backgroundColor: 'transparent',
    padding: {
      top: 80,
      right: 40,
      bottom: 80,
      left: 40,
    },
    align: 'center',
  },
  
  aiHints: [
    'email opening',
    'major announcement',
    'centered headline',
    'product launch',
    'newsletter intro',
  ],
};

