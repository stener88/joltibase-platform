/**
 * Image Helper Functions
 * 
 * Transforms semantic blocks by replacing image keywords with URLs
 * Adds photo credits to footer blocks
 */

import type { SemanticBlock, FooterBlock } from './blocks';
import type { ImageMapping } from './image-fetcher';

/**
 * Replace image keywords with URLs in all blocks
 */
export function replaceImageKeywords(
  blocks: SemanticBlock[],
  imageMap: Map<string, ImageMapping>
): SemanticBlock[] {
  return blocks.map(block => {
    const newBlock = { ...block };
    
    switch (newBlock.blockType) {
      case 'hero':
        if (newBlock.imageKeyword) {
          const mapping = imageMap.get(newBlock.imageKeyword);
          if (mapping) {
            newBlock.imageUrl = mapping.url;
          }
        }
        break;
        
      case 'features':
        newBlock.features = newBlock.features.map(f => {
          if (f.imageKeyword) {
            const mapping = imageMap.get(f.imageKeyword);
            if (mapping) {
              return { ...f, imageUrl: mapping.url };
            }
          }
          return f;
        });
        break;
        
      case 'content':
        if (newBlock.imageKeyword) {
          const mapping = imageMap.get(newBlock.imageKeyword);
          if (mapping) {
            newBlock.imageUrl = mapping.url;
            if (!newBlock.imageAlt) {
              newBlock.imageAlt = mapping.alt;
            }
          }
        }
        break;
        
      case 'testimonial':
        if (newBlock.authorImageKeyword) {
          const mapping = imageMap.get(newBlock.authorImageKeyword);
          if (mapping) {
            newBlock.authorImage = mapping.url;
          }
        }
        break;
        
      case 'gallery':
        newBlock.images = newBlock.images.map(img => {
          if (img.keyword) {
            const mapping = imageMap.get(img.keyword);
            if (mapping) {
              return { ...img, url: mapping.url, alt: mapping.alt };
            }
          }
          return img;
        });
        break;
        
      case 'article':
        if (newBlock.imageKeyword) {
          const mapping = imageMap.get(newBlock.imageKeyword);
          if (mapping) {
            newBlock.imageUrl = mapping.url;
            if (!newBlock.imageAlt) {
              newBlock.imageAlt = mapping.alt;
            }
          }
        }
        if (newBlock.author?.imageKeyword) {
          const mapping = imageMap.get(newBlock.author.imageKeyword);
          if (mapping) {
            newBlock.author = { ...newBlock.author, imageUrl: mapping.url };
          }
        }
        break;
        
      case 'list':
        newBlock.items = newBlock.items.map(item => {
          if (item.imageKeyword) {
            const mapping = imageMap.get(item.imageKeyword);
            if (mapping) {
              return { ...item, imageUrl: mapping.url };
            }
          }
          return item;
        });
        break;
        
      case 'ecommerce':
        newBlock.products = newBlock.products.map(product => {
          if (product.imageKeyword) {
            const mapping = imageMap.get(product.imageKeyword);
            if (mapping) {
              return { ...product, imageUrl: mapping.url };
            }
          }
          return product;
        });
        break;
    }
    
    return newBlock;
  });
}

/**
 * Add photo credits to the footer block
 */
export function addCreditsToFooter(
  blocks: SemanticBlock[],
  credits: string[]
): SemanticBlock[] {
  if (credits.length === 0) {
    return blocks;
  }
  
  return blocks.map(block => {
    if (block.blockType === 'footer') {
      const footerBlock = block as FooterBlock;
      return {
        ...footerBlock,
        photoCredits: credits,
      } as SemanticBlock;
    }
    return block;
  });
}

