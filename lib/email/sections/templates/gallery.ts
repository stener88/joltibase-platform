/**
 * Gallery Section Templates
 * 
 * Image grid and collage layouts for visual storytelling
 */

import type { SectionTemplate } from '../types';

export const GALLERY_TEMPLATES: SectionTemplate[] = [
  {
    id: 'gallery-grid-2x2',
    name: 'Product Grid (2x2)',
    category: 'content',
    description: '2x2 product grid with captions and shop links',
    designStyle: 'modern',
    colorScheme: 'neutral',
    complexity: 'simple',
    useCases: ['product-catalog', 'portfolio', 'gallery'],
    aiContext: {
      keywords: ['grid', 'gallery', 'products', 'catalog', '2x2', 'four'],
      selectionWeight: 85,
      bestFor: ['product showcases', 'portfolio displays', 'visual catalogs'],
    },
    blocks: [
      {
        id: 'gal-01',
        type: 'image-grid-2x2',
        position: 0,
        settings: {
          gridGap: 16,
          imageHeight: '200px',
          borderRadius: '8px',
          showCaptions: true,
          captionFontSize: '14px',
          captionColor: '#374151',
          padding: { top: 32, right: 24, bottom: 32, left: 24 },
        },
        content: {
          images: [
            {
              imageUrl: 'https://via.placeholder.com/300x300',
              altText: 'Product 1',
              caption: 'Premium Headphones',
              linkUrl: 'https://example.com/product1',
            },
            {
              imageUrl: 'https://via.placeholder.com/300x300',
              altText: 'Product 2',
              caption: 'Smart Watch',
              linkUrl: 'https://example.com/product2',
            },
            {
              imageUrl: 'https://via.placeholder.com/300x300',
              altText: 'Product 3',
              caption: 'Designer Sunglasses',
              linkUrl: 'https://example.com/product3',
            },
            {
              imageUrl: 'https://via.placeholder.com/300x300',
              altText: 'Product 4',
              caption: 'Leather Bag',
              linkUrl: 'https://example.com/product4',
            },
          ],
        },
      },
    ],
  },

  {
    id: 'gallery-collage',
    name: 'Featured Product Collage',
    category: 'content',
    description: 'Asymmetric collage with featured product and detail shots',
    designStyle: 'modern',
    colorScheme: 'neutral',
    complexity: 'moderate',
    useCases: ['product-showcase', 'featured-collection', 'visual-story'],
    aiContext: {
      keywords: ['collage', 'featured', 'asymmetric', 'product', 'details'],
      selectionWeight: 90,
      bestFor: ['featured products', 'product details', 'visual storytelling'],
    },
    blocks: [
      {
        id: 'gal-03',
        type: 'image-collage',
        position: 0,
        settings: {
          layout: 'featured-left',
          gridGap: 12,
          borderRadius: '8px',
          padding: { top: 32, right: 24, bottom: 32, left: 24 },
        },
        content: {
          featuredImage: {
            imageUrl: 'https://via.placeholder.com/600x800',
            altText: 'Featured product',
            linkUrl: 'https://example.com/featured',
          },
          secondaryImages: [
            {
              imageUrl: 'https://via.placeholder.com/300x400',
              altText: 'Product detail 1',
              linkUrl: 'https://example.com/detail1',
            },
            {
              imageUrl: 'https://via.placeholder.com/300x400',
              altText: 'Product detail 2',
              linkUrl: 'https://example.com/detail2',
            },
            {
              imageUrl: 'https://via.placeholder.com/300x400',
              altText: 'Product detail 3',
              linkUrl: 'https://example.com/detail3',
            },
          ],
        },
      },
    ],
  },

];

