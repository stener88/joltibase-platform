/**
 * Email Image Service (V2)
 * 
 * AI-powered image keyword extraction with intelligent fallback.
 * Fetches max 5 high-quality images from Unsplash.
 * 
 * Priority: AI Keywords → Design System → Topic Extraction → Category
 */

import { fetchUnsplashImage, type ImageResult } from '@/lib/unsplash/client';
import type { DesignSystem } from '@/emails/lib/design-system-selector';
import { extractKeywordsWithTimeout, type ImageKeywords } from './ai-image-keywords';

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

/**
 * Simplified ImageContext - Max 5 images
 * Most emails only use 2-3, but newsletters may use up to 5
 */
export interface ImageContext {
  hero: EmailImage | null;       // Main visual (always)
  feature1: EmailImage | null;   // Primary supporting (usually)
  feature2: EmailImage | null;   // Secondary supporting (sometimes)
  feature3: EmailImage | null;   // Tertiary supporting (newsletters)
  accent: EmailImage | null;     // Abstract/background (rarely)
  // Legacy fields for backwards compatibility with generator.ts
  logo: EmailImage | null;
  product1: EmailImage | null;
  product2: EmailImage | null;
  destination1: EmailImage | null;
  destination2: EmailImage | null;
  icon: EmailImage | null;
}

/**
 * Image count per design system
 * Ensures each design system gets the right number of images for rich emails
 */
const DESIGN_SYSTEM_IMAGE_COUNTS: Record<string, number> = {
  'travel-booking': 5,           // Hero + destinations + activities
  'newsletter-editorial': 5,    // Hero + multiple articles
  'product-promotion': 5,       // Hero + product + flatlay + lifestyle + accent
  'ecommerce-discount': 4,      // Hero + product + lifestyle + accent
  'retail-welcome': 4,          // Hero + secondary + store + accent
  'event-announcement': 4,      // Hero + multiple event visuals
  'event-conference': 4,        // Hero + speaker + venue + accent
  'winback-reactivation': 4,    // Hero + product/app + background + people
  'fashion-campaign': 5,        // Multiple hero/editorial sections
  'saas-engagement': 4,         // Hero + feature/product + background + people
  'destination-content': 5,     // Hero + activities + tips + planning visuals
  'saas-onboarding-welcome': 3, // Mostly text/logo, minimal imagery
  'modern-startup': 4,          // Hero + product shots + team
  'saas-product': 4,            // Hero + dashboard + features
  'minimal-elegant': 3,         // Hero + feature (less is more)
  'corporate-professional': 3,  // Hero + feature + accent
};

/**
 * Determine how many images to fetch based on design system and prompt
 */
function getImageCountForPrompt(prompt: string, designSystem?: DesignSystem): number {
  // If we have a design system, use its configured count
  if (designSystem?.id && DESIGN_SYSTEM_IMAGE_COUNTS[designSystem.id]) {
    const count = DESIGN_SYSTEM_IMAGE_COUNTS[designSystem.id];return count;
  }
  
  const lower = prompt.toLowerCase();
  
  // Complex emails (5 images) - newsletters, travel, multi-content
  if (
    lower.includes('newsletter') ||
    lower.includes('travel') || 
    lower.includes('destination') ||
    lower.includes('multi-product') ||
    lower.includes('showcase') ||
    lower.includes('digest') ||
    lower.includes('roundup') ||
    lower.includes('weekly')
  ) {
    return 5;
  }
  
  // Rich emails (4 images) - promotions, campaigns, events
  if (
    lower.includes('announcement') ||
    lower.includes('promotional') ||
    lower.includes('promotion') ||
    lower.includes('campaign') ||
    lower.includes('event') ||
    lower.includes('conference') ||
    lower.includes('discount') ||
    lower.includes('sale') ||
    lower.includes('offer') ||
    lower.includes('promo') ||
    lower.includes('black friday') ||
    lower.includes('cyber monday') ||
    lower.includes('welcome') ||
    lower.includes('onboarding')
  ) {
    return 4;
  }
  
  // Standard emails (3 images) - updates, transactional
  return 3;
}

/**
 * Main function: Fetch images with AI-powered keyword extraction
 * Uses 2500ms timeout for AI, falls back gracefully
 */
export async function fetchImagesForPrompt(
  prompt: string,
  designSystem?: DesignSystem
): Promise<ImageContext> {
  const imageCount = getImageCountForPrompt(prompt, designSystem);..."`);
  }
  
  if (!designSystem) {return getFallbackImages();
  }
  
  try {
    // Try AI keyword extraction with configured timeoutconst aiKeywords = await extractKeywordsWithTimeout(prompt, designSystem);
    
    // Build final keywords with fallback chain
    const keywords = aiKeywords 
      ? aiKeywords 
      : getDesignSystemKeywords(designSystem) 
        || extractTopicsFromPrompt(prompt) 
        || getCategoryFallback(prompt);
    
    const source = aiKeywords ? 'AI' : 'fallback';// Fetch images in parallel based on image count
    // 3 images: hero + feature + accent
    // 4 images: hero + feature + secondary + accent  
    // 5 images: hero + feature + secondary + tertiary + accent
    const imagePromises = [
      // 1. Hero - Always fetch
      fetchUnsplashImage({ 
        query: keywords.hero, 
        orientation: 'landscape', 
        width: 600, 
        height: 400
      }),
      // 2. Feature1 - Always fetch
      fetchUnsplashImage({ 
        query: keywords.feature, 
          orientation: 'landscape', 
          width: 400, 
          height: 300
      }),
      // 3. Feature2/Accent - Fetch for 3+ images
      imageCount >= 3 ? fetchUnsplashImage({ 
        query: keywords.accent, 
          orientation: 'landscape', 
          width: 400, 
          height: 300
      }) : Promise.resolve(null),
      // 4. Feature3 - Fetch for 4+ images (different query for variety)
      imageCount >= 4 ? fetchUnsplashImage({ 
        query: `${keywords.feature} lifestyle`, 
          orientation: 'landscape', 
          width: 400, 
          height: 300
      }) : Promise.resolve(null),
      // 5. Accent/Icon - Fetch for 5 images
      imageCount >= 5 ? fetchUnsplashImage({ 
        query: `${keywords.accent} abstract`, 
        orientation: 'squarish', 
        width: 300, 
        height: 300
      }) : Promise.resolve(null),
    ];
    
    const results = await Promise.all(imagePromises);
    
    // Map results to ImageContext
    const context: ImageContext = {
      hero: results[0] ? mapToEmailImage(results[0], 600, 400) : null,
      feature1: results[1] ? mapToEmailImage(results[1], 400, 300) : null,
      feature2: results[2] ? mapToEmailImage(results[2], 400, 300) : null,
      feature3: results[3] ? mapToEmailImage(results[3], 400, 300) : null,
      accent: results[4] ? mapToEmailImage(results[4], 300, 300) : null,
      // Legacy fields - map from new structure for backwards compatibility
      logo: null, // Logo should come from brand settings, not Unsplash
      product1: results[2] ? mapToEmailImage(results[2], 300, 400) : null,
      product2: results[3] ? mapToEmailImage(results[3], 300, 400) : null,
      destination1: results[2] ? mapToEmailImage(results[2], 300, 250) : null,
      destination2: results[3] ? mapToEmailImage(results[3], 300, 250) : null,
      icon: results[4] ? mapToEmailImage(results[4], 100, 100) : null,
    };
    
    // Count based on what we actually requested
    const requestedCount = imageCount;
    const fetchedCount = [
      context.hero, 
      context.feature1, 
      imageCount >= 3 ? context.feature2 : null,
      imageCount >= 4 ? context.feature3 : null,
      imageCount >= 5 ? context.accent : null,
    ].filter(Boolean).length;return context;
    
  } catch (error) {return getFallbackImages();
  }
}

/**
 * Get keywords from design system (fallback #1)
 */
function getDesignSystemKeywords(designSystem: DesignSystem): ImageKeywords | null {
  if (!designSystem.imageKeywords) return null;
  
  const ds = designSystem.imageKeywords;// Pick first keyword from each array (consistent, not random)
  // Then take only first 2 words for better Unsplash results
  return {
    hero: truncateToWords(ds.hero?.[0] || 'business', 2),
    feature: truncateToWords(ds.feature?.[0] || ds.hero?.[0] || 'professional', 2),
    accent: truncateToWords(ds.background?.[0] || 'minimal', 2),
  };
}

/**
 * Extract topic keywords from prompt (fallback #2)
 */
function extractTopicsFromPrompt(prompt: string): ImageKeywords | null {
  const lower = prompt.toLowerCase();
  
  // Topic keywords that photograph well
  const topicKeywords = [
    'sustainability', 'technology', 'innovation', 'teamwork', 'office',
    'nature', 'travel', 'food', 'fitness', 'wellness', 'fashion',
    'education', 'healthcare', 'finance', 'retail', 'manufacturing',
  ];
  
  const found = topicKeywords.filter(topic => lower.includes(topic));
  
  if (found.length === 0) return null;`);
  }
  
    return {
    hero: found[0],
    feature: found[1] || found[0],
    accent: found[2] || 'abstract',
  };
}

/**
 * Category-based fallback (fallback #3)
 */
function getCategoryFallback(prompt: string): ImageKeywords {
  const lower = prompt.toLowerCase();
  
  let category = 'business';
  
  if (lower.includes('travel') || lower.includes('vacation')) category = 'travel';
  else if (lower.includes('food') || lower.includes('restaurant')) category = 'food';
  else if (lower.includes('fitness') || lower.includes('gym')) category = 'fitness';
  else if (lower.includes('tech') || lower.includes('software')) category = 'technology';
  else if (lower.includes('fashion') || lower.includes('style')) category = 'fashion';
  else if (lower.includes('event') || lower.includes('conference')) category = 'conference';
  else if (lower.includes('education') || lower.includes('learning')) category = 'education';
  else if (lower.includes('health') || lower.includes('medical')) category = 'healthcare';return {
    hero: category,
    feature: category,
    accent: 'abstract',
  };
}

/**
 * Truncate string to max N words (for better Unsplash results)
 */
function truncateToWords(str: string, maxWords: number): string {
  const words = str.trim().split(/\s+/);
  return words.slice(0, maxWords).join(' ');
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
 * Fallback images when everything else fails
 * Uses high-quality, pre-selected Unsplash images
 */
function getFallbackImages(): ImageContext {return {
    hero: {
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
      alt: 'Professional workspace with laptop',
      width: 600,
      height: 400,
    },
    feature1: {
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      alt: 'Team collaboration',
      width: 400,
      height: 300,
    },
    feature2: {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      alt: 'Business meeting',
      width: 400,
      height: 300,
    },
    feature3: {
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
      alt: 'Modern office space',
      width: 400,
      height: 300,
    },
    accent: {
      url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=300&fit=crop',
      alt: 'Abstract gradient',
      width: 300,
      height: 300,
    },
    // Legacy fields for backwards compatibility
    logo: {
      url: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=150&h=150&fit=crop',
      alt: 'Company logo',
      width: 150,
      height: 150,
    },
    product1: {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=400&fit=crop',
      alt: 'Product showcase',
      width: 300,
      height: 400,
    },
    product2: {
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
      alt: 'Product display',
      width: 300,
      height: 400,
    },
    destination1: {
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=250&fit=crop',
      alt: 'Paris cityscape',
      width: 300,
      height: 250,
    },
    destination2: {
      url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=250&fit=crop',
      alt: 'London landmarks',
      width: 300,
      height: 250,
    },
    icon: {
      url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
      alt: 'Icon badge',
      width: 100,
      height: 100,
    },
  };
}
