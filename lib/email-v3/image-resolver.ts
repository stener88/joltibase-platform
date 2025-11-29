/**
 * Image Resolution Service
 * 
 * Resilient image fetching with multiple fallback strategies:
 * 1. Unsplash API (primary)
 * 2. Picsum Photos (fallback)
 * 3. Keep original (last resort)
 */

import { fetchUnsplashImage, getPicsumFallback } from '@/lib/unsplash/client';

export interface ImageOptions {
  orientation?: 'landscape' | 'portrait' | 'squarish';
  width?: number;
  height?: number;
}

export interface ImageResolutionResult {
  url: string;
  source: 'unsplash' | 'picsum' | 'original';
  alt?: string;
}

/**
 * Resolve an image URL with fallback chain
 * 
 * @param query - Search query for the image
 * @param options - Image dimensions and orientation
 * @param originalUrl - Optional original URL to keep as last resort
 * @returns Image URL and source
 */
export async function resolveImage(
  query: string,
  options: ImageOptions = {},
  originalUrl?: string
): Promise<ImageResolutionResult> {
  const { orientation = 'landscape', width = 600, height = 300 } = options;
  
  console.log(`[IMAGE-RESOLVER] Resolving image for: "${query}"`);
  
  // Try Unsplash first
  try {
    const unsplashResult = await fetchUnsplashImage({
      query,
      orientation,
      width,
      height,
    });
    
    if (unsplashResult && unsplashResult.url) {
      console.log(`✅ [IMAGE-RESOLVER] Unsplash success: ${unsplashResult.url.substring(0, 60)}...`);
      return {
        url: unsplashResult.url,
        source: 'unsplash',
        alt: unsplashResult.alt,
      };
    }
  } catch (error) {
    console.warn('[IMAGE-RESOLVER] Unsplash failed:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Fallback to Picsum
  console.log('[IMAGE-RESOLVER] Falling back to Picsum');
  const picsumUrl = getPicsumFallback(query, width, height);
  
  if (picsumUrl) {
    return {
      url: picsumUrl,
      source: 'picsum',
      alt: query,
    };
  }
  
  // Last resort - keep original if provided
  if (originalUrl) {
    console.log('[IMAGE-RESOLVER] Keeping original URL');
    return {
      url: originalUrl,
      source: 'original',
      alt: query,
    };
  }
  
  // Absolute fallback - generic placeholder
  const fallbackUrl = `https://picsum.photos/${width}/${height}`;
  console.warn('[IMAGE-RESOLVER] Using generic placeholder');
  return {
    url: fallbackUrl,
    source: 'picsum',
    alt: 'Image placeholder',
  };
}

/**
 * Batch resolve multiple images
 * Useful for initial email generation
 */
export async function resolveImages(
  queries: Array<{ query: string; options?: ImageOptions }>,
): Promise<ImageResolutionResult[]> {
  console.log(`[IMAGE-RESOLVER] Batch resolving ${queries.length} images`);
  
  const results = await Promise.all(
    queries.map(({ query, options }) => resolveImage(query, options))
  );
  
  const successCount = results.filter(r => r.source !== 'picsum').length;
  console.log(`✅ [IMAGE-RESOLVER] Batch complete: ${successCount}/${queries.length} from Unsplash`);
  
  return results;
}

/**
 * Extract image keyword from user message
 * Used to determine what image to fetch
 */
export function extractImageKeyword(message: string): string {
  const msg = message.toLowerCase();
  
  // Remove common command words
  const cleaned = msg
    .replace(/change|replace|update|modify|make|it|this|the|to|a|an/g, '')
    .replace(/photo|picture|image/g, '')
    .trim();
  
  // Extract meaningful words
  const words = cleaned.split(/\s+/).filter(w => w.length > 2);
  
  // Return the most meaningful words (max 3)
  return words.slice(0, 3).join(' ') || 'professional';
}

