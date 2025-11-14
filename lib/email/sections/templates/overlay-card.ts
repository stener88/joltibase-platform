/**
 * Overlay & Card Section Templates
 * 
 * Image overlays, product cards, and badge designs for impactful visuals
 */

import type { SectionTemplate } from '../types';

export const OVERLAY_CARD_TEMPLATES: SectionTemplate[] = [
  {
    id: 'image-overlay-hero',
    name: 'Image Overlay Hero',
    category: 'hero',
    description: 'Dramatic hero with centered overlay text and CTA',
    designStyle: 'bold',
    colorScheme: 'high-contrast',
    complexity: 'moderate',
    useCases: ['hero', 'campaign', 'announcement'],
    aiContext: {
      keywords: ['hero', 'overlay', 'dramatic', 'sale', 'campaign', 'centered'],
      selectionWeight: 95,
      bestFor: ['sales campaigns', 'major announcements', 'hero sections'],
    },
    blocks: [
      {
        id: 'ov-01',
        type: 'image-overlay',
        position: 0,
        settings: {
          overlayPosition: 'center',
          overlayBackgroundColor: '#000000',
          overlayBackgroundOpacity: 60,
          overlayPadding: { top: 40, right: 40, bottom: 40, left: 40 },
          overlayBorderRadius: '12px',
          imageHeight: '500px',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
        },
        content: {
          imageUrl: 'https://via.placeholder.com/1200x600',
          imageAltText: 'Hero background',
          heading: 'Summer Sale 2024',
          headingSize: '48px',
          headingColor: '#ffffff',
          subheading: 'Up to 50% off on selected items',
          subheadingSize: '20px',
          subheadingColor: '#e5e7eb',
          buttonText: 'Shop Now',
          buttonUrl: 'https://example.com/sale',
          buttonColor: '#fbbf24',
          buttonTextColor: '#111827',
        },
      },
    ],
  },

  {
    id: 'product-card',
    name: 'Product Card (Vertical)',
    category: 'promo',
    description: 'E-commerce product card with badge, pricing, and CTA',
    designStyle: 'modern',
    colorScheme: 'neutral',
    complexity: 'simple',
    useCases: ['product-showcase', 'e-commerce', 'catalog'],
    aiContext: {
      keywords: ['product', 'card', 'e-commerce', 'price', 'shop', 'badge'],
      selectionWeight: 90,
      bestFor: ['product showcases', 'e-commerce', 'shopping'],
    },
    blocks: [
      {
        id: 'pc-01',
        type: 'product-card',
        position: 0,
        settings: {
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          borderRadius: '12px',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          imagePosition: 'top',
          imageHeight: '300px',
          badgePosition: 'top-right',
          badgeBackgroundColor: '#dc2626',
          badgeTextColor: '#ffffff',
        },
        content: {
          imageUrl: 'https://via.placeholder.com/600x800',
          imageAltText: 'Premium Watch',
          badge: 'NEW',
          heading: 'Luxury Chronograph Watch',
          headingSize: '22px',
          headingColor: '#111827',
          description: 'Precision crafted with sapphire crystal and automatic movement. Water resistant to 100m.',
          descriptionSize: '14px',
          descriptionColor: '#6b7280',
          price: '$899',
          priceSize: '28px',
          priceColor: '#111827',
          originalPrice: '$1,299',
          buttonText: 'Add to Cart',
          buttonUrl: 'https://example.com/add-to-cart',
          buttonColor: '#2563eb',
          buttonTextColor: '#ffffff',
        },
      },
    ],
  },

];

