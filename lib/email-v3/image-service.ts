/**
 * Email Image Service
 * 
 * Fetches contextual images from Unsplash for email generation
 * Runs in parallel with RAG to avoid latency
 */

import { fetchUnsplashImage, type ImageResult } from '@/lib/unsplash/client';

export interface EmailImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  credit?: {
    photographerName: string;
    photographerUrl: string;
    unsplashUrl: string;
  };
  downloadLocation?: string;
}

export interface ImageContext {
  hero: EmailImage | null;
  logo: EmailImage | null;
  feature: EmailImage | null;
}

/**
 * Fetch images for email generation based on prompt
 * Runs in parallel with RAG retrieval
 */
export async function fetchImagesForPrompt(prompt: string): Promise<ImageContext> {
  console.log(`🖼️ [IMAGE-SERVICE] Fetching images for: "${prompt}"`);
  
  try {
    // Extract keywords from prompt
    const keywords = extractImageKeywords(prompt);
    
    // Fetch images in parallel
    const [heroResult, logoResult, featureResult] = await Promise.all([
      fetchUnsplashImage({ 
        query: keywords.hero, 
        orientation: 'landscape', 
        width: 600, 
        height: 300 
      }),
      fetchUnsplashImage({ 
        query: 'minimal logo modern', 
        orientation: 'squarish', 
        width: 150, 
        height: 150 
      }),
      fetchUnsplashImage({ 
        query: keywords.feature || keywords.hero, 
        orientation: 'landscape', 
        width: 400, 
        height: 300 
      }),
    ]);
    
    const context: ImageContext = {
      hero: heroResult ? mapToEmailImage(heroResult, 600, 300) : null,
      logo: logoResult ? mapToEmailImage(logoResult, 150, 150) : null,
      feature: featureResult ? mapToEmailImage(featureResult, 400, 300) : null,
    };
    
    console.log(`✅ [IMAGE-SERVICE] Fetched ${[context.hero, context.logo, context.feature].filter(Boolean).length} images`);
    
    return context;
    
  } catch (error) {
    console.warn('[IMAGE-SERVICE] Error fetching images, using fallback:', error);
    return getFallbackImages();
  }
}

/**
 * Extract relevant keywords from user prompt for image search
 */
function extractImageKeywords(prompt: string): { hero: string; feature?: string } {
  const lower = prompt.toLowerCase();
  
  // Detect email type and return contextual keywords
  if (lower.includes('product launch') || lower.includes('product announcement')) {
    return { hero: 'product launch workspace technology', feature: 'modern product design' };
  }
  
  if (lower.includes('newsletter')) {
    return { hero: 'newsletter reading coffee', feature: 'creative workspace' };
  }
  
  if (lower.includes('welcome')) {
    return { hero: 'welcome handshake professional', feature: 'team collaboration' };
  }
  
  if (lower.includes('event') || lower.includes('invitation')) {
    return { hero: 'conference event professional', feature: 'business meeting' };
  }
  
  if (lower.includes('sale') || lower.includes('promotion') || lower.includes('discount')) {
    return { hero: 'shopping sale online', feature: 'celebration confetti' };
  }
  
  if (lower.includes('update') || lower.includes('announcement')) {
    return { hero: 'announcement news modern', feature: 'notification alert' };
  }
  
  // Default: extract key nouns or use generic business
  const keywords = prompt
    .toLowerCase()
    .replace(/email|newsletter|campaign|create|build|generate/gi, '')
    .split(' ')
    .filter(word => word.length > 3)
    .slice(0, 2)
    .join(' ');
  
  return { 
    hero: keywords || 'professional business workspace',
    feature: 'modern technology'
  };
}

/**
 * Map Unsplash API result to EmailImage format
 */
function mapToEmailImage(result: ImageResult, width: number, height: number): EmailImage {
  return {
    url: result.url,
    alt: result.alt,
    width,
    height,
    credit: result.credit,
    downloadLocation: result.downloadLocation,
  };
}

/**
 * Fallback images when Unsplash API fails
 * Uses high-quality, pre-selected Unsplash images
 */
function getFallbackImages(): ImageContext {
  console.log('📦 [IMAGE-SERVICE] Using fallback images');
  
  return {
    hero: {
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=300&fit=crop',
      alt: 'Professional workspace with laptop',
      width: 600,
      height: 300,
    },
    logo: {
      url: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=150&h=150&fit=crop',
      alt: 'Company logo',
      width: 150,
      height: 150,
    },
    feature: {
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      alt: 'Team collaboration',
      width: 400,
      height: 300,
    },
  };
}

