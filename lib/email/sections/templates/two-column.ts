/**
 * Two-Column Section Templates
 * 
 * Sophisticated side-by-side layouts using the two-column complex block
 */

import type { SectionTemplate } from '../types';

export const TWO_COLUMN_TEMPLATES: SectionTemplate[] = [
  {
    id: 'two-col-image-text',
    name: 'Two-Column: Image + Text',
    category: 'content',
    description: 'Balanced two-column layout with image and rich content',
    designStyle: 'modern',
    colorScheme: 'neutral',
    complexity: 'moderate',
    useCases: ['product-announcement', 'feature-highlight', 'story-telling'],
    aiContext: {
      keywords: ['two-column', 'image', 'text', 'feature', 'product', 'balanced'],
      selectionWeight: 90,
      bestFor: ['product features', 'side-by-side comparison', 'visual storytelling'],
    },
    blocks: [
      {
        id: 'tc-01',
        type: 'two-column',
        position: 0,
        settings: {
          layout: '50-50',
          verticalAlign: 'middle',
          columnGap: 32,
          padding: { top: 40, right: 24, bottom: 40, left: 24 },
        },
        content: {
          leftColumn: {
            type: 'image',
            imageUrl: 'https://via.placeholder.com/600x400',
            imageAltText: 'Product image',
          },
          rightColumn: {
            type: 'rich-content',
            richContent: {
              heading: 'Introducing Something Amazing',
              headingSize: '32px',
              headingColor: '#111827',
              body: 'Experience the future with our latest innovation. Designed for those who demand excellence and built to exceed expectations.',
              bodySize: '16px',
              bodyColor: '#6b7280',
              buttonText: 'Learn More',
              buttonUrl: 'https://example.com',
              buttonColor: '#2563eb',
              buttonTextColor: '#ffffff',
            },
          },
        },
      },
    ],
  },

  {
    id: 'two-col-dual-cta',
    name: 'Dual Content + CTAs',
    category: 'promo',
    description: 'Side-by-side comparison with separate CTAs for each option',
    designStyle: 'bold',
    colorScheme: 'split-contrast',
    complexity: 'moderate',
    useCases: ['comparison', 'tier-promotion', 'choice-presentation'],
    aiContext: {
      keywords: ['comparison', 'choice', 'dual', 'options', 'tiers', 'plans'],
      selectionWeight: 80,
      bestFor: ['plan comparisons', 'tier promotions', 'A/B choices'],
    },
    blocks: [
      {
        id: 'tc-03',
        type: 'two-column',
        position: 0,
        settings: {
          layout: '50-50',
          verticalAlign: 'top',
          columnGap: 16,
          padding: { top: 32, right: 16, bottom: 32, left: 16 },
          leftColumnBackgroundColor: '#eff6ff',
          rightColumnBackgroundColor: '#fef2f2',
          leftColumnPadding: { top: 24, right: 20, bottom: 24, left: 20 },
          rightColumnPadding: { top: 24, right: 20, bottom: 24, left: 20 },
        },
        content: {
          leftColumn: {
            type: 'rich-content',
            richContent: {
              heading: 'For Individuals',
              headingSize: '24px',
              headingColor: '#1e40af',
              body: 'Perfect for personal projects and small teams. Get started with all the essentials.',
              bodySize: '15px',
              bodyColor: '#374151',
              buttonText: 'Start Free',
              buttonUrl: 'https://example.com/individual',
              buttonColor: '#2563eb',
              buttonTextColor: '#ffffff',
            },
          },
          rightColumn: {
            type: 'rich-content',
            richContent: {
              heading: 'For Teams',
              headingSize: '24px',
              headingColor: '#991b1b',
              body: 'Built for collaboration at scale. Advanced features for growing organizations.',
              bodySize: '15px',
              bodyColor: '#374151',
              buttonText: 'Contact Sales',
              buttonUrl: 'https://example.com/teams',
              buttonColor: '#dc2626',
              buttonTextColor: '#ffffff',
            },
          },
        },
      },
    ],
  },

];

