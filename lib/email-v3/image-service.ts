/**
 * Email Image Service
 * 
 * Fetches contextual images from Unsplash for email generation
 * Runs in parallel with design system selection to avoid latency
 */

import { fetchUnsplashImage, type ImageResult } from '@/lib/unsplash/client';
import type { DesignSystem } from '@/emails/lib/design-system-selector';

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
  feature1: EmailImage | null;
  feature2: EmailImage | null;
  feature3: EmailImage | null;
  product1: EmailImage | null;
  product2: EmailImage | null;
  destination1: EmailImage | null;
  destination2: EmailImage | null;
  icon: EmailImage | null;
}

/**
 * Determine how many images to fetch based on email type
 */
function getImageCountForPrompt(prompt: string): number {
  const lower = prompt.toLowerCase();
  
  // Complex emails (10 images) - travel, events, multi-product
  if (
    lower.includes('travel') || 
    lower.includes('destination') ||
    lower.includes('event') ||
    lower.includes('conference') ||
    lower.includes('webinar') ||
    lower.includes('loyalty') ||
    lower.includes('multi-product') ||
    lower.includes('showcase') ||
    lower.includes('multi-destination')
  ) {
    return 10;
  }
  
  // Medium emails (6 images) - newsletters, promotions, updates
  if (
    lower.includes('newsletter') ||
    lower.includes('product update') ||
    lower.includes('announcement') ||
    lower.includes('promotional') ||
    lower.includes('campaign') ||
    lower.includes('digest') ||
    lower.includes('survey') ||
    lower.includes('feedback')
  ) {
    return 6;
  }
  
  // Simple emails (3 images) - welcome, password reset, receipt, policy
  return 3;
}

/**
 * Fetch images for email generation based on prompt and design system
 * Adaptively fetches 3, 6, or 10 images based on email complexity
 */
export async function fetchImagesForPrompt(
  prompt: string,
  designSystem?: DesignSystem
): Promise<ImageContext> {
  const imageCount = getImageCountForPrompt(prompt);
  console.log(`🖼️ [IMAGE-SERVICE] Fetching ${imageCount} images for: "${prompt}"`);
  if (designSystem) {
    console.log(`🎨 [IMAGE-SERVICE] Using design system: ${designSystem.name}`);
  }
  
  try {
    // Extract simple, focused keywords (1-2 words max)
    const keywords = extractImageKeywords(prompt, designSystem);
    
    console.log(`🎯 [IMAGE-SERVICE] Keywords: hero="${keywords.hero}", feature="${keywords.feature}", product="${keywords.product}"`);
    
    // Always fetch hero and logo (base 2 images)
    const baseImages = [
      fetchUnsplashImage({ 
        query: keywords.hero, 
        orientation: 'landscape', 
        width: 600, 
        height: 400
      }),
      fetchUnsplashImage({ 
        query: 'minimal logo modern abstract', 
        orientation: 'squarish', 
        width: 150, 
        height: 150 
      }),
    ];
    
    // Conditionally add more images based on complexity
    const additionalImages = [];
    
    // Simple (3 images): hero, logo, feature1
    if (imageCount >= 3) {
      additionalImages.push(
        fetchUnsplashImage({ 
          query: keywords.feature || keywords.hero, 
          orientation: 'landscape', 
          width: 400, 
          height: 300
        })
      );
    }
    
    // Medium (6 images): + feature2, feature3, product1
    if (imageCount >= 6) {
      additionalImages.push(
        fetchUnsplashImage({ 
          query: keywords.secondary || keywords.feature || keywords.hero, 
          orientation: 'landscape', 
          width: 400, 
          height: 300
        }),
        fetchUnsplashImage({ 
          query: keywords.tertiary || keywords.feature || keywords.hero, 
          orientation: 'landscape', 
          width: 400, 
          height: 300
        }),
        fetchUnsplashImage({ 
          query: keywords.product || keywords.hero, 
          orientation: 'portrait', 
          width: 300, 
          height: 400
        })
      );
    }
    
    // Complex (10 images): + product2, destination1, destination2, icon
    if (imageCount >= 10) {
      additionalImages.push(
        fetchUnsplashImage({ 
          query: keywords.product || keywords.hero, 
          orientation: 'portrait', 
          width: 300, 
          height: 400
        }),
        fetchUnsplashImage({ 
          query: keywords.destination || keywords.hero, 
          orientation: 'landscape', 
          width: 300, 
          height: 250
        }),
        fetchUnsplashImage({ 
          query: keywords.destination || keywords.hero, 
          orientation: 'landscape', 
          width: 300, 
          height: 250
        }),
        fetchUnsplashImage({ 
          query: 'minimal icon badge modern', 
          orientation: 'squarish', 
          width: 100, 
          height: 100 
        })
      );
    }
    
    // Fetch all images in parallel
    const allResults = await Promise.all([...baseImages, ...additionalImages]);
    
    // Map results to ImageContext (nulls for unfetched images)
    const context: ImageContext = {
      hero: allResults[0] ? mapToEmailImage(allResults[0], 600, 400) : null,
      logo: allResults[1] ? mapToEmailImage(allResults[1], 150, 150) : null,
      feature1: allResults[2] ? mapToEmailImage(allResults[2], 400, 300) : null,
      feature2: allResults[3] ? mapToEmailImage(allResults[3], 400, 300) : null,
      feature3: allResults[4] ? mapToEmailImage(allResults[4], 400, 300) : null,
      product1: allResults[5] ? mapToEmailImage(allResults[5], 300, 400) : null,
      product2: allResults[6] ? mapToEmailImage(allResults[6], 300, 400) : null,
      destination1: allResults[7] ? mapToEmailImage(allResults[7], 300, 250) : null,
      destination2: allResults[8] ? mapToEmailImage(allResults[8], 300, 250) : null,
      icon: allResults[9] ? mapToEmailImage(allResults[9], 100, 100) : null,
    };
    
    const fetchedCount = Object.values(context).filter(Boolean).length;
    console.log(`✅ [IMAGE-SERVICE] Fetched ${fetchedCount}/${imageCount} images`);
    
    return context;
    
  } catch (error) {
    console.warn('[IMAGE-SERVICE] Error fetching images, using fallback:', error);
    return getFallbackImages();
  }
}

/**
 * Extract the core product/subject noun from prompt
 * Returns SINGLE most relevant word for focused Unsplash search
 */
function extractCoreNoun(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  // Common product nouns - expand as needed
  const knownProducts = [
    'headset', 'headphones', 'earbuds', 'speaker', 'audio',
    'phone', 'smartphone', 'iphone', 'android', 'mobile',
    'laptop', 'computer', 'macbook', 'pc', 'tablet',
    'watch', 'smartwatch', 'timepiece',
    'car', 'vehicle', 'bike', 'bicycle', 'scooter',
    'shoes', 'sneakers', 'boots', 'footwear',
    'bag', 'backpack', 'purse', 'luggage',
    'bottle', 'cup', 'mug', 'glass',
    'shirt', 'clothing', 'dress', 'jacket',
    'furniture', 'chair', 'desk', 'table', 'sofa',
    'book', 'magazine', 'newspaper', 'publication',
    'camera', 'lens', 'photography',
    'glasses', 'sunglasses', 'eyewear',
    'keyboard', 'mouse', 'monitor', 'screen',
    'software', 'app', 'platform', 'tool', 'service',
  ];
  
  // Check if any known product is mentioned
  for (const product of knownProducts) {
    if (lower.includes(product)) {
      return product;
    }
  }
  
  // Fallback: extract first meaningful noun after removing filler words
  const cleaned = lower
    .replace(/\b(can|you|please|help|create|make|build|design|write|generate|email|newsletter|campaign|we|are|our|is|the|a|an|for|about|to|launching|launch|announce|announcement|introducing|introduce|new|premium|modern|beautiful|professional|exclusive|limited|best|great|amazing|quarterly|annual|monthly|weekly|daily)\b/gi, '')
    .trim();
  
  const words = cleaned.split(/\s+/).filter(w => w.length > 2);
  
  return words.length > 0 ? words[0] : 'modern';
}

/**
 * Get category-based fallback if no specific product found
 */
function getCategoryKeyword(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('travel') || lower.includes('vacation') || lower.includes('destination')) return 'travel';
  if (lower.includes('food') || lower.includes('restaurant') || lower.includes('dining')) return 'food';
  if (lower.includes('fitness') || lower.includes('gym') || lower.includes('workout')) return 'fitness';
  if (lower.includes('business') || lower.includes('office') || lower.includes('corporate')) return 'office';
  if (lower.includes('tech') || lower.includes('software') || lower.includes('digital')) return 'technology';
  if (lower.includes('fashion') || lower.includes('style') || lower.includes('clothing')) return 'fashion';
  if (lower.includes('event') || lower.includes('conference') || lower.includes('summit')) return 'conference';
  if (lower.includes('education') || lower.includes('learning') || lower.includes('course')) return 'education';
  if (lower.includes('health') || lower.includes('medical') || lower.includes('wellness')) return 'healthcare';
  
  return 'business';
}

/**
 * Extract simple, focused keywords for Unsplash search
 * Uses core noun extraction for maximum relevance
 */
function extractImageKeywords(
  prompt: string,
  designSystem?: DesignSystem
): {
  hero: string;
  feature?: string;
  secondary?: string;
  tertiary?: string;
  product?: string;
  destination?: string;
} {
  // Extract the core subject/product from prompt
  const coreNoun = extractCoreNoun(prompt);
  const category = getCategoryKeyword(prompt);
  
  // SIMPLE APPROACH: Use core noun + category fallback
  // Let Unsplash relevance + color filter handle aesthetics
  
  // If we found a specific product, use it
  if (coreNoun !== 'modern') {
    return {
      hero: coreNoun,                      // "headset"
      feature: coreNoun,                   // "headset" (Unsplash will pick different image)
      secondary: `${coreNoun} detail`,     // "headset detail"
      tertiary: coreNoun,                  // "headset"
      product: `${coreNoun} product`,      // "headset product"
      destination: category,               // Category fallback (e.g., "technology")
    };
  }
  
  // No specific product found - use category
  return {
    hero: category,                        // e.g., "conference"
    feature: category,                     // e.g., "conference"
    secondary: `${category} professional`, // e.g., "conference professional"
    tertiary: category,                    // e.g., "conference"
    product: `${category} modern`,         // e.g., "conference modern"
    destination: category,                 // e.g., "conference"
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
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
      alt: 'Professional workspace with laptop',
      width: 600,
      height: 400,
    },
    logo: {
      url: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=150&h=150&fit=crop',
      alt: 'Company logo',
      width: 150,
      height: 150,
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

