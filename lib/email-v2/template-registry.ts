/**
 * Template Registry
 * 
 * Manages HTML email templates - provides type-safe lookups and file loading
 * Maps semantic block types + variations to template file paths
 * 
 * NOTE: This module uses Node.js 'fs' and should only be used server-side
 * (e.g., in API routes, server components, or server actions)
 */

import type { SemanticBlock } from './ai/blocks';

// Dynamic import to ensure this only runs server-side
let readFileSync: typeof import('fs').readFileSync;
let join: typeof import('path').join;

if (typeof window === 'undefined') {
  // Only import fs/path on server-side
  readFileSync = require('fs').readFileSync;
  join = require('path').join;
}

/**
 * Template metadata
 */
export interface TemplateInfo {
  /** Block type this template is for */
  blockType: string;
  
  /** Variant name */
  variant: string;
  
  /** Relative path to template file */
  path: string;
  
  /** Description of this template */
  description?: string;
}

/**
 * Template registry - maps block type + variant to template paths
 * 
 * Templates are organized as: templates/{blockType}/{variant}.html
 * Example: templates/header/centered-menu.html
 */
const TEMPLATE_REGISTRY: Record<string, Record<string, string>> = {
  header: {
    'centered-menu': 'header/centered-menu.html',
    'side-menu': 'header/side-menu.html',
    'social-icons': 'header/social-icons.html',
  },
  hero: {
    'simple': 'hero/simple.html',
    'centered': 'hero/simple.html', // Map centered to simple template
    'split': 'hero/simple.html', // Map split to simple template
  },
  cta: {
    'simple': 'cta/simple.html',
    'primary': 'cta/simple.html', // Map style: 'primary' to simple template
    'secondary': 'cta/simple.html', // Map style: 'secondary' to simple template
    'outline': 'cta/simple.html', // Map style: 'outline' to simple template
  },
  footer: {
    'simple': 'footer/simple.html',
    'one-column': 'footer/simple.html', // Map to simple template
    'two-column': 'footer/simple.html', // Map to simple template
  },
  heading: {
    'multiple-headings': 'heading/multiple-headings.html',
    'simple-heading': 'heading/simple-heading.html',
    'multiple-headings-alt': 'heading/multiple-headings-alt.html',
  },
  text: {
    'simple-text': 'text/simple-text.html',
    'text-with-styling': 'text/text-with-styling.html',
  },
  link: {
    'simple-link': 'link/simple-link.html',
    'inline-link': 'link/inline-link.html',
  },
  buttons: {
    'single-button': 'buttons/single-button.html',
    'two-buttons': 'buttons/two-buttons.html',
    'download-buttons': 'buttons/download-buttons.html',
  },
  image: {
    'simple-image': 'image/simple-image.html',
    'rounded-image': 'image/rounded-image.html',
    'varying-sizes': 'image/varying-sizes.html',
  },
  avatars: {
    'group-stacked': 'avatars/group-stacked.html',
    'with-text': 'avatars/with-text.html',
    'circular': 'avatars/circular.html',
  },
  code: {
    'inline-simple': 'code/inline-simple.html',
    'inline-colors': 'code/inline-colors.html',
    'block-no-theme': 'code/block-no-theme.html',
    'predefined-theme': 'code/predefined-theme.html',
    'custom-theme': 'code/custom-theme.html',
    'line-numbers': 'code/line-numbers.html',
  },
  markdown: {
    'simple': 'markdown/simple.html',
    'container-styles': 'markdown/container-styles.html',
    'custom-styles': 'markdown/custom-styles.html',
  },
  features: {
    'grid': 'features/four-paragraphs-two-columns.html', // Map grid to fixed two-column template
    'list': 'features/list.html',
    'numbered': 'features/numbered.html',
    'icons-2col': 'features/icons-2col.html',
    'icons-centered': 'features/icons-centered.html',
    'list-items': 'features/list-items.html',
    'numbered-list': 'features/numbered-list.html',
    'four-paragraphs': 'features/four-paragraphs.html',
    'four-paragraphs-two-columns': 'features/four-paragraphs-two-columns.html',
    'three-centered-paragraphs': 'features/three-centered-paragraphs.html',
  },
  content: {
    'image-top': 'content/image-top.html',
    'image-left': 'content/image-left.html',
    'image-right': 'content/image-right.html',
    'image-bottom': 'content/image-bottom.html',
  },
  testimonial: {
    'centered': 'testimonial/centered.html',
    'large-avatar': 'testimonial/large-avatar.html',
    'simple-centered': 'testimonial/simple-centered.html',
  },
  gallery: {
    'grid-2x2': 'gallery/grid-2x2.html',
    '3-column': 'gallery/3-column.html',
    'horizontal-split': 'gallery/horizontal-split.html',
    'vertical-split': 'gallery/vertical-split.html',
    'four-images-grid': 'gallery/four-images-grid.html',
    'three-columns': 'gallery/three-columns.html',
    'horizontal-grid': 'gallery/horizontal-grid.html',
    'vertical-grid': 'gallery/vertical-grid.html',
  },
  stats: {
    'simple': 'stats/simple.html',
    'stepped': 'stats/stepped.html',
  },
  pricing: {
    'simple': 'pricing/simple.html',
    'simple-pricing-table': 'pricing/simple-pricing-table.html',
    'two-tier': 'pricing/two-tier.html',
  },
  article: {
    'image-top': 'article/image-top.html',
    'image-right': 'article/image-right.html',
    'image-background': 'article/image-background.html',
    'two-cards': 'article/two-cards.html',
    'single-author': 'article/single-author.html',
    'multiple-authors': 'article/multiple-authors.html',
  },
  articles: {
    'with-image': 'articles/with-image.html',
    'image-right': 'articles/image-right.html',
    'image-background': 'articles/image-background.html',
    'two-cards': 'articles/two-cards.html',
    'single-author': 'articles/single-author.html',
  },
  list: {
    'simple-list': 'list/simple-list.html',
    'image-left': 'list/image-left.html',
    'numbered': 'list/simple-list.html', // Map numbered to simple-list template
  },
  ecommerce: {
    'single': 'ecommerce/single.html',
    'one-product': 'ecommerce/one-product.html',
    'image-left': 'ecommerce/image-left.html',
    'one-product-left': 'ecommerce/one-product-left.html',
    '3-column': 'ecommerce/3-column.html',
    'three-cards-row': 'ecommerce/three-cards-row.html',
    '4-grid': 'ecommerce/4-grid.html',
    'four-cards': 'ecommerce/four-cards.html',
    'checkout': 'ecommerce/checkout.html',
  },
  marketing: {
    'bento-grid': 'marketing/bento-grid.html',
  },
  feedback: {
    'simple-rating': 'feedback/simple-rating.html',
    'survey': 'feedback/survey.html',
    'survey-section': 'feedback/survey-section.html',
    'customer-reviews': 'feedback/customer-reviews.html',
  },
};

/**
 * Get template path for a block type and variant
 * 
 * @param blockType - Semantic block type (e.g., 'hero', 'features')
 * @param variant - Template variant (e.g., 'centered', 'split')
 * @returns Relative path to template file or null if not found
 */
export function getTemplatePath(blockType: string, variant: string): string | null {
  const blockTemplates = TEMPLATE_REGISTRY[blockType];
  if (!blockTemplates) {
    console.warn(`[TemplateRegistry] No templates found for block type: ${blockType}`);
    return null;
  }
  
  const templatePath = blockTemplates[variant];
  if (!templatePath) {
    console.warn(`[TemplateRegistry] No template found for ${blockType}/${variant}`);
    return null;
  }
  
  return templatePath;
}

/**
 * Load template HTML from file system
 * 
 * @param blockType - Semantic block type
 * @param variant - Template variant
 * @returns HTML template string or null if not found
 */
export function loadTemplate(blockType: string, variant: string): string | null {
  // Ensure we're running server-side
  if (typeof window !== 'undefined') {
    console.error('[TemplateRegistry] loadTemplate can only be called server-side');
    return null;
  }
  
  const relativePath = getTemplatePath(blockType, variant);
  if (!relativePath) {
    return null;
  }
  
  try {
    // Templates are in lib/email-v2/templates/
    const templatesDir = join(process.cwd(), 'lib', 'email-v2', 'templates');
    const absolutePath = join(templatesDir, relativePath);
    
    const html = readFileSync(absolutePath, 'utf-8');
    console.log(`[TemplateRegistry] Loaded template: ${relativePath}`);
    return html;
    
  } catch (error) {
    console.error(`[TemplateRegistry] Failed to load template ${relativePath}:`, error);
    return null;
  }
}

/**
 * Load template for a semantic block
 * Automatically extracts blockType and variant from block
 * 
 * @param block - Semantic block with blockType and variant properties
 * @returns HTML template string or null if not found
 */
export function loadTemplateForBlock(block: SemanticBlock): string | null {
  // Ensure we're running server-side
  if (typeof window !== 'undefined') {
    console.error('[TemplateRegistry] loadTemplateForBlock can only be called server-side');
    return null;
  }
  
  const variant = getBlockVariant(block);
  return loadTemplate(block.blockType, variant);
}

/**
 * Get variant from block (with fallback to default variants)
 */
function getBlockVariant(block: SemanticBlock): string {
  // Check if block has a variant property
  const blockWithVariant = block as any;
  if (blockWithVariant.variant) {
    return blockWithVariant.variant;
  }
  
  // Fallback defaults for blocks without explicit variants
  const defaults: Record<string, string> = {
    header: 'centered-menu',
    hero: 'centered',
    heading: 'simple-heading',
    text: 'simple-text',
    link: 'simple-link',
    buttons: 'single-button',
    image: 'simple-image',
    avatars: 'group-stacked',
    code: 'inline-simple',
    markdown: 'simple',
    features: 'grid',
    content: 'image-top',
    testimonial: 'simple-centered',
    cta: 'primary',
    footer: 'one-column',
    gallery: 'four-images-grid',
    stats: 'simple',
    pricing: 'simple',
    article: 'image-top',
    articles: 'with-image',
    list: 'simple-list',
    ecommerce: 'single',
    marketing: 'bento-grid',
    feedback: 'simple-rating',
  };
  
  return defaults[block.blockType] || 'default';
}

/**
 * List all available templates
 * 
 * @returns Array of template info objects
 */
export function listTemplates(): TemplateInfo[] {
  const templates: TemplateInfo[] = [];
  
  for (const [blockType, variants] of Object.entries(TEMPLATE_REGISTRY)) {
    for (const [variant, path] of Object.entries(variants)) {
      templates.push({
        blockType,
        variant,
        path,
      });
    }
  }
  
  return templates;
}

/**
 * List available variants for a block type
 * 
 * @param blockType - Block type to query
 * @returns Array of variant names
 */
export function listVariants(blockType: string): string[] {
  const blockTemplates = TEMPLATE_REGISTRY[blockType];
  if (!blockTemplates) {
    return [];
  }
  
  return Object.keys(blockTemplates);
}

/**
 * Check if a template exists
 * 
 * @param blockType - Block type
 * @param variant - Variant name
 * @returns True if template exists
 */
export function templateExists(blockType: string, variant: string): boolean {
  return getTemplatePath(blockType, variant) !== null;
}

