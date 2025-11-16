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
      { key: 'titleColor', label: 'Title Color', defaultValue: '#111827' },
      { key: 'paragraphColor', label: 'Text Color', defaultValue: '#374151' },
      { key: 'dividerColor', label: 'Divider Color', defaultValue: '#e5e7eb' },
      { key: 'buttonBackgroundColor', label: 'Button Background', defaultValue: '#7c3aed' },
      { key: 'buttonTextColor', label: 'Button Text Color', defaultValue: '#ffffff' },
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
    titleColor: '#111827',
    paragraphColor: '#374151',
    dividerColor: '#e5e7eb',
    titleFontSize: '32px',
    paragraphFontSize: '16px',
    buttonBackgroundColor: '#7c3aed',
    buttonTextColor: '#ffffff',
  },
  
  aiHints: [
    'email opening',
    'major announcement',
    'centered headline',
    'product launch',
    'newsletter intro',
  ],
};

