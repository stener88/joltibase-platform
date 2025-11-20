/**
 * Pattern-Based Email Renderer
 * 
 * Renders semantic blocks directly to HTML using Pattern components
 * Bypasses EmailComponent intermediate format for faster generation
 */

import { render } from '@react-email/render';
import { Html, Head, Body, Container, Preview } from '@react-email/components';
import React from 'react';
import type { SemanticBlock } from './ai/blocks';
import type { GlobalEmailSettings } from './types';
import { HeroPattern } from './patterns/HeroPattern';
import { FeaturesPattern } from './patterns/FeaturesPattern';
import { ContentPattern } from './patterns/ContentPattern';
import { TestimonialPattern } from './patterns/TestimonialPattern';
import { CtaPattern } from './patterns/CtaPattern';
import { FooterPattern } from './patterns/FooterPattern';
import { GalleryPattern } from './patterns/GalleryPattern';
import { StatsPattern } from './patterns/StatsPattern';
import { PricingPattern } from './patterns/PricingPattern';
import { ArticlePattern } from './patterns/ArticlePattern';
import { ListPattern } from './patterns/ListPattern';
import { EcommercePattern } from './patterns/EcommercePattern';

/**
 * Map semantic block to Pattern component
 */
function renderBlock(block: SemanticBlock, settings: GlobalEmailSettings): React.ReactElement {
  switch (block.blockType) {
    case 'hero':
      return React.createElement(HeroPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'features':
      return React.createElement(FeaturesPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'content':
      return React.createElement(ContentPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'testimonial':
      return React.createElement(TestimonialPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'cta':
      return React.createElement(CtaPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'footer':
      return React.createElement(FooterPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'gallery':
      return React.createElement(GalleryPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'stats':
      return React.createElement(StatsPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'pricing':
      return React.createElement(PricingPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'article':
      return React.createElement(ArticlePattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'list':
      return React.createElement(ListPattern, { key: `block-${block.blockType}`, block, settings });
    
    case 'ecommerce':
      return React.createElement(EcommercePattern, { key: `block-${block.blockType}`, block, settings });
    
    default:
      console.warn(`[PatternRenderer] Unknown block type: ${(block as any).blockType}`);
      return React.createElement('div', { key: 'unknown' }, 'Unknown block type');
  }
}

/**
 * Render semantic blocks to HTML using Pattern components
 * 
 * @param blocks - Array of semantic content blocks
 * @param settings - Global email settings
 * @param previewText - Email preview text
 * @returns Rendered HTML string
 */
export async function renderPatternsToEmail(
  blocks: SemanticBlock[],
  settings: GlobalEmailSettings,
  previewText?: string
): Promise<string> {
  console.log('[PatternRenderer] Rendering', blocks.length, 'blocks to HTML');
  
  try {
    // Create pattern elements for each block
    const blockElements = blocks.map(block => renderBlock(block, settings));
    
    // Wrap in email structure
    const emailElement = React.createElement(
      Html,
      { lang: 'en' },
      React.createElement(
        Head,
        null,
        previewText && React.createElement(Preview, null, previewText)
      ),
      React.createElement(
        Body,
        {
          style: {
            fontFamily: settings.fontFamily,
            backgroundColor: settings.backgroundColor || '#ffffff',
            margin: 0,
            padding: 0,
          },
        },
        React.createElement(
          Container,
          {
            style: {
              maxWidth: settings.maxWidth,
              margin: '0 auto',
            },
          },
          ...blockElements
        )
      )
    );
    
    // Render to HTML
    const html = await render(emailElement, {
      pretty: false,
    });
    
    console.log('[PatternRenderer] Successfully rendered', html.length, 'characters');
    return html;
    
  } catch (error) {
    console.error('[PatternRenderer] Render error:', error);
    throw new Error(`Failed to render patterns: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Render patterns to plain text
 * 
 * @param blocks - Array of semantic content blocks
 * @returns Plain text version
 */
export function renderPatternsToPlainText(blocks: SemanticBlock[]): string {
  const textParts: string[] = [];
  
  for (const block of blocks) {
    switch (block.blockType) {
      case 'hero':
        textParts.push(block.headline);
        if (block.subheadline) textParts.push(block.subheadline);
        textParts.push(block.ctaText);
        break;
      
      case 'features':
        if (block.heading) textParts.push(block.heading);
        block.features.forEach(f => {
          textParts.push(`${f.title}: ${f.description}`);
        });
        break;
      
      case 'content':
        if (block.heading) textParts.push(block.heading);
        textParts.push(...block.paragraphs);
        break;
      
      case 'testimonial':
        textParts.push(`"${block.quote}"`);
        textParts.push(`- ${block.authorName}`);
        break;
      
      case 'cta':
        textParts.push(block.headline);
        if (block.subheadline) textParts.push(block.subheadline);
        textParts.push(block.buttonText);
        break;
      
      case 'footer':
        textParts.push(`© ${block.companyName}`);
        if (block.address) textParts.push(block.address);
        break;
      
      case 'gallery':
        if (block.heading) textParts.push(block.heading);
        if (block.subheading) textParts.push(block.subheading);
        block.images.forEach(img => textParts.push(img.alt));
        break;
      
      case 'stats':
        block.stats.forEach(stat => {
          textParts.push(`${stat.value} - ${stat.label}`);
        });
        break;
      
      case 'pricing':
        if (block.heading) textParts.push(block.heading);
        block.plans.forEach(plan => {
          textParts.push(`${plan.name}: ${plan.price}`);
        });
        break;
      
      case 'article':
        if (block.eyebrow) textParts.push(block.eyebrow);
        textParts.push(block.headline);
        if (block.excerpt) textParts.push(block.excerpt);
        break;
      
      case 'list':
        if (block.heading) textParts.push(block.heading);
        block.items.forEach(item => {
          textParts.push(`${item.title}: ${item.description}`);
        });
        break;
      
      case 'ecommerce':
        if (block.heading) textParts.push(block.heading);
        block.products.forEach(product => {
          textParts.push(`${product.name}: ${product.price}`);
        });
        break;
    }
  }
  
  return textParts.join('\n\n');
}

