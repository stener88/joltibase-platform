/**
 * Advanced Layout Section Templates
 * 
 * Sophisticated multi-column and alternating layouts
 */

import type { SectionTemplate } from '../types';

export const ADVANCED_TEMPLATES: SectionTemplate[] = [
  {
    id: 'zigzag-features',
    name: 'Zigzag Features',
    category: 'features',
    description: 'Alternating image-text rows for dynamic feature presentation',
    designStyle: 'modern',
    colorScheme: 'neutral',
    complexity: 'complex',
    useCases: ['feature-list', 'product-tour', 'benefits'],
    aiContext: {
      keywords: ['zigzag', 'alternating', 'features', 'showcase', 'benefits', 'tour'],
      selectionWeight: 90,
      bestFor: ['feature showcases', 'product tours', 'benefit listings'],
    },
    blocks: [
      {
        id: 'zz-01',
        type: 'zigzag',
        position: 0,
        settings: {
          imageWidth: '50%',
          columnGap: 48,
          rowGap: 64,
          verticalAlign: 'middle',
          backgroundColor: '#ffffff',
          padding: { top: 48, right: 24, bottom: 48, left: 24 },
          imageBorderRadius: '12px',
        },
        content: {
          rows: [
            {
              imageUrl: 'https://via.placeholder.com/600x400',
              imageAltText: 'Feature 1',
              heading: 'Powerful Analytics',
              headingSize: '32px',
              headingColor: '#111827',
              body: 'Get deep insights into your performance with real-time dashboards and custom reports. Track what matters and make data-driven decisions.',
              bodySize: '16px',
              bodyColor: '#6b7280',
              buttonText: 'See Analytics',
              buttonUrl: 'https://example.com/analytics',
              buttonColor: '#2563eb',
              buttonTextColor: '#ffffff',
            },
            {
              imageUrl: 'https://via.placeholder.com/600x400',
              imageAltText: 'Feature 2',
              heading: 'Seamless Integration',
              headingSize: '32px',
              headingColor: '#111827',
              body: 'Connect with your favorite tools in minutes. We integrate with over 1000+ apps to streamline your workflow.',
              bodySize: '16px',
              bodyColor: '#6b7280',
              buttonText: 'View Integrations',
              buttonUrl: 'https://example.com/integrations',
              buttonColor: '#2563eb',
              buttonTextColor: '#ffffff',
            },
          ],
        },
      },
    ],
  },

  {
    id: 'three-column',
    name: 'Split Background Contrast',
    category: 'hero',
    description: 'Dramatic split hero with contrasting dark/light backgrounds',
    designStyle: 'bold',
    colorScheme: 'high-contrast',
    complexity: 'complex',
    useCases: ['hero', 'announcement', 'campaign'],
    aiContext: {
      keywords: ['split', 'hero', 'contrast', 'bold', 'dramatic', 'modern'],
      selectionWeight: 90,
      bestFor: ['bold announcements', 'hero sections', 'brand statements'],
    },
    blocks: [
      {
        id: 'sb-01',
        type: 'split-background',
        position: 0,
        settings: {
          layout: '50-50',
          leftBackgroundColor: '#111827',
          rightBackgroundColor: '#fbbf24',
          columnGap: 0,
          verticalAlign: 'middle',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          leftColumnPadding: { top: 64, right: 40, bottom: 64, left: 40 },
          rightColumnPadding: { top: 64, right: 40, bottom: 64, left: 40 },
        },
        content: {
          leftColumn: {
            heading: 'Bold. Different. Powerful.',
            headingSize: '40px',
            headingColor: '#ffffff',
            body: 'Experience a new way of working that breaks all the rules. Built for innovators and leaders.',
            bodySize: '18px',
            bodyColor: '#d1d5db',
            buttonText: 'Start Free Trial',
            buttonUrl: 'https://example.com/trial',
            buttonColor: '#fbbf24',
            buttonTextColor: '#111827',
          },
          rightColumn: {
            heading: '10,000+',
            headingSize: '64px',
            headingColor: '#111827',
            body: 'Companies worldwide trust us to deliver results. Join the movement.',
            bodySize: '18px',
            bodyColor: '#374151',
          },
        },
      },
    ],
  },

];

