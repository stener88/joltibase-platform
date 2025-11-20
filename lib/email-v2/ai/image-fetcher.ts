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
 * Simplify keyword by removing overly descriptive adjectives and keeping core nouns
 * 
 * Strips out descriptive adjectives (dark, mysterious, epic, etc.) and action words
 * to create broader, more searchable keywords for Unsplash (1-3 words max)
 * 
 * @param keyword - Original keyword from AI
 * @returns Simplified keyword (1-3 core words)
 */
function simplifyKeyword(keyword: string): string {
  if (!keyword || keyword.trim().length === 0) {
    return keyword;
  }
  
  // Words to remove (descriptive adjectives and action words)
  const wordsToRemove = new Set([
    // Descriptive adjectives
    'dark', 'mysterious', 'epic', 'dramatic', 'cinematic', 'vivid', 'moody',
    'dramatic', 'stunning', 'breathtaking', 'spectacular', 'magnificent',
    'gorgeous', 'beautiful', 'striking', 'powerful', 'intense', 'eerie',
    'haunting', 'atmospheric', 'ethereal', 'surreal', 'dramatic', 'heroic',
    'determined', 'fierce', 'bold', 'vibrant', 'lush', 'pristine', 'serene',
    // Action/state words
    'glowing', 'shimmering', 'sparkling', 'radiant', 'illuminated', 'lit',
    'running', 'jumping', 'flying', 'standing', 'sitting', 'walking',
    // Overly specific descriptors
    'close', 'up', 'closeup', 'macro', 'wide', 'angle', 'shot', 'scene',
    'norwegian', 'swedish', 'finnish', 'icelandic', // Specific locations can be too narrow
    // Common filler words
    'the', 'a', 'an', 'in', 'on', 'at', 'with', 'and', 'or', 'of', 'for',
  ]);
  
  // Split keyword into words
  const words = keyword.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  // Filter out words to remove and keep only meaningful nouns/adjectives
  const coreWords = words.filter(word => {
    // Remove if it's in the exclusion list
    if (wordsToRemove.has(word)) {
      return false;
    }
    // Keep nouns and simple descriptors (2+ characters)
    return word.length >= 2;
  });
  
  // Limit to 1-3 words for better Unsplash matches
  const simplified = coreWords.slice(0, 3).join(' ');
  
  // If we removed everything, fall back to first 2 words of original
  if (simplified.length === 0 && words.length > 0) {
    return words.slice(0, 2).join(' ');
  }
  
  return simplified || keyword; // Fallback to original if something went wrong
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
    
    // Simplify keyword for better Unsplash search results
    const simplifiedKeyword = simplifyKeyword(keyword);
    
    if (simplifiedKeyword !== keyword) {
      console.log(`[ImageFetcher] Simplifying keyword: "${keyword}" → "${simplifiedKeyword}"`);
    }
    
    // Try Unsplash first with simplified keyword
    const unsplashResult = await fetchUnsplashImage({
      query: simplifiedKeyword,
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

