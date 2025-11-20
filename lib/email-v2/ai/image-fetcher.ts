/**
 * Image Fetcher Service
 * 
 * Extracts image keywords from semantic blocks and fetches images from Unsplash
 * Handles parallel fetching, deduplication, and fallback to picsum.photos
 */

import type { SemanticBlock } from './blocks';
import { fetchUnsplashImage, getPicsumFallback, type ImageResult } from '../../unsplash/client';
import { trackUnsplashDownload } from '../../unsplash/tracker';

export interface ImageMapping {
  keyword: string;
  url: string;
  credit: string | null;
  downloadLocation: string | null;
  alt: string;
}

interface ImageFetchResult {
  imageMap: Map<string, ImageMapping>;
  credits: string[];
}

/**
 * Extract all image keywords from semantic blocks
 */
function extractImageKeywords(blocks: SemanticBlock[]): Set<string> {
  const keywords = new Set<string>();
  
  for (const block of blocks) {
    switch (block.blockType) {
      case 'hero':
        if (block.imageKeyword) keywords.add(block.imageKeyword);
        break;
        
      case 'features':
        block.features.forEach(f => {
          if (f.imageKeyword) keywords.add(f.imageKeyword);
        });
        break;
        
      case 'content':
        if (block.imageKeyword) keywords.add(block.imageKeyword);
        break;
        
      case 'testimonial':
        if (block.authorImageKeyword) keywords.add(block.authorImageKeyword);
        break;
        
      case 'gallery':
        block.images.forEach(img => {
          if (img.keyword) keywords.add(img.keyword);
        });
        break;
        
      case 'article':
        if (block.imageKeyword) keywords.add(block.imageKeyword);
        if (block.author?.imageKeyword) keywords.add(block.author.imageKeyword);
        break;
        
      case 'list':
        block.items.forEach(item => {
          if (item.imageKeyword) keywords.add(item.imageKeyword);
        });
        break;
        
      case 'ecommerce':
        block.products.forEach(product => {
          if (product.imageKeyword) keywords.add(product.imageKeyword);
        });
        break;
    }
  }
  
  return keywords;
}

/**
 * Determine image dimensions based on block type and position
 */
function getImageDimensions(keyword: string, block?: SemanticBlock): { width: number; height: number; orientation: 'landscape' | 'portrait' | 'squarish' } {
  // Default dimensions
  let width = 600;
  let height = 400;
  let orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape';
  
  if (!block) {
    return { width, height, orientation };
  }
  
  switch (block.blockType) {
    case 'hero':
      width = 800;
      height = 400;
      orientation = 'landscape';
      break;
      
    case 'testimonial':
      width = 200;
      height = 200;
      orientation = 'squarish';
      break;
      
    case 'gallery':
      width = 600;
      height = 400;
      orientation = 'landscape';
      break;
      
    case 'ecommerce':
      width = 400;
      height = 400;
      orientation = 'squarish';
      break;
      
    case 'article':
      if (keyword.includes('portrait') || keyword.includes('person') || keyword.includes('author')) {
        width = 200;
        height = 200;
        orientation = 'squarish';
      } else {
        width = 600;
        height = 400;
        orientation = 'landscape';
      }
      break;
  }
  
  return { width, height, orientation };
}

/**
 * Fetch images for all keywords from Unsplash (with fallback to picsum.photos)
 */
export async function fetchImagesForBlocks(blocks: SemanticBlock[]): Promise<ImageFetchResult> {
  const keywords = extractImageKeywords(blocks);
  
  if (keywords.size === 0) {
    console.log('[ImageFetcher] No image keywords found');
    return { imageMap: new Map(), credits: [] };
  }
  
  console.log(`[ImageFetcher] Fetching ${keywords.size} images:`, Array.from(keywords));
  
  const imageMap = new Map<string, ImageMapping>();
  const credits: string[] = [];
  const downloadLocations: string[] = [];
  
  // Fetch all images in parallel
  const fetchPromises = Array.from(keywords).map(async (keyword) => {
    const { width, height, orientation } = getImageDimensions(keyword);
    
    // Try Unsplash first
    const unsplashResult = await fetchUnsplashImage({
      query: keyword,
      orientation,
      width,
      height,
    });
    
    if (unsplashResult) {
      // Success - use Unsplash image
      imageMap.set(keyword, {
        keyword,
        url: unsplashResult.url,
        credit: unsplashResult.credit.photographerName,
        downloadLocation: unsplashResult.downloadLocation,
        alt: unsplashResult.alt,
      });
      
      credits.push(unsplashResult.credit.photographerName);
      downloadLocations.push(unsplashResult.downloadLocation);
      
    } else {
      // Fallback to picsum.photos
      console.warn(`[ImageFetcher] Using picsum fallback for "${keyword}"`);
      imageMap.set(keyword, {
        keyword,
        url: getPicsumFallback(keyword, width, height),
        credit: null,
        downloadLocation: null,
        alt: keyword,
      });
    }
  });
  
  await Promise.all(fetchPromises);
  
  // Track downloads (fire and forget)
  downloadLocations.forEach(location => {
    trackUnsplashDownload(location).catch(err => 
      console.error('[ImageFetcher] Download tracking failed:', err)
    );
  });
  
  console.log(`[ImageFetcher] ✅ Fetched ${imageMap.size} images (${credits.length} from Unsplash)`);
  
  return {
    imageMap,
    credits: Array.from(new Set(credits)), // Deduplicate photographer names
  };
}

