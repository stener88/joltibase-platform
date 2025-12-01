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
    // Extract keywords from prompt, enhanced with design system aesthetics
    const keywords = extractImageKeywords(prompt, designSystem);
    
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
 * Optimize keyword length for Unsplash search
 * Keep under 60 chars for best relevance
 */
function optimizeKeywordLength(keyword: string): string {
  if (keyword.length <= 60) return keyword;
  
  // Truncate but keep complete words
  const truncated = keyword.substring(0, 60);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
}

/**
 * Extract relevant keywords from user prompt for image search
 * If design system is provided, combines user intent with aesthetic keywords
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
  const lower = prompt.toLowerCase();
  
  // Helper: Combine prompt keywords with design system aesthetics
  const enhance = (promptKeywords: string, type: 'hero' | 'feature' | 'product' | 'background' = 'feature'): string => {
    if (!designSystem || !('imageKeywords' in designSystem)) {
      return optimizeKeywordLength(promptKeywords);
    }
    const dsKeywords = (designSystem as any).imageKeywords[type];
    if (!dsKeywords || dsKeywords.length === 0) {
      return optimizeKeywordLength(promptKeywords);
    }
    // Pick a random keyword from the design system array for variety
    const randomKeyword = dsKeywords[Math.floor(Math.random() * dsKeywords.length)];
    // Combine: "user intent" + "design system aesthetic"
    const combined = `${promptKeywords} ${randomKeyword}`;
    
    return optimizeKeywordLength(combined);
  };
  
  // Travel/Tourism
  if (lower.includes('travel') || lower.includes('destination') || lower.includes('trip')) {
    return {
      hero: enhance('travel adventure vacation', 'hero'),
      feature: enhance('travel activities tourism', 'feature'),
      secondary: enhance('travel exploration', 'feature'),
      tertiary: enhance('adventure journey', 'feature'),
      product: enhance('travel destination scenic', 'product'),
      destination: enhance('beautiful city landscape', 'background'),
    };
  }
  
  // Promotional/Retail
  if (lower.includes('sale') || lower.includes('promotion') || lower.includes('discount') || lower.includes('shopping')) {
    return {
      hero: enhance('shopping sale retail store', 'hero'),
      feature: enhance('product showcase retail', 'feature'),
      secondary: enhance('shopping experience', 'feature'),
      tertiary: enhance('sale celebration', 'background'),
      product: enhance('product display merchandise', 'product'),
      destination: enhance('store retail location', 'background'),
    };
  }
  
  // Events/Invitations
  if (lower.includes('event') || lower.includes('invitation') || lower.includes('conference') || lower.includes('webinar')) {
    return {
      hero: enhance('conference event professional', 'hero'),
      feature: enhance('business meeting presentation', 'feature'),
      secondary: enhance('networking professional', 'feature'),
      tertiary: enhance('workshop training', 'feature'),
      product: enhance('speaker presentation', 'product'),
      destination: enhance('venue conference hall', 'background'),
    };
  }
  
  // Product Launch/Update
  if (lower.includes('product') || lower.includes('launch') || lower.includes('announcement')) {
    return {
      hero: enhance('product launch technology modern', 'hero'),
      feature: enhance('modern product design', 'feature'),
      secondary: enhance('innovation technology', 'feature'),
      tertiary: enhance('digital product', 'product'),
      product: enhance('product showcase display', 'product'),
      destination: enhance('modern workspace office', 'background'),
    };
  }
  
  // Newsletter/Content
  if (lower.includes('newsletter') || lower.includes('digest') || lower.includes('tips')) {
    return {
      hero: enhance('newsletter reading coffee workspace', 'hero'),
      feature: enhance('creative workspace content', 'feature'),
      secondary: enhance('reading learning', 'feature'),
      tertiary: enhance('inspiration creativity', 'feature'),
      product: enhance('content creation writing', 'product'),
      destination: enhance('library books learning', 'background'),
    };
  }
  
  // Welcome/Onboarding
  if (lower.includes('welcome') || lower.includes('onboard')) {
    return {
      hero: enhance('welcome handshake professional team', 'hero'),
      feature: enhance('team collaboration workspace', 'feature'),
      secondary: enhance('onboarding training', 'feature'),
      tertiary: enhance('success celebration', 'feature'),
      product: enhance('team member professional', 'product'),
      destination: enhance('office workspace modern', 'background'),
    };
  }
  
  // Loyalty/Rewards
  if (lower.includes('loyalty') || lower.includes('reward') || lower.includes('points')) {
    return {
      hero: enhance('reward celebration success', 'hero'),
      feature: enhance('exclusive benefits vip', 'feature'),
      secondary: enhance('achievement success', 'feature'),
      tertiary: enhance('premium quality', 'product'),
      product: enhance('rewards benefits exclusive', 'product'),
      destination: enhance('luxury experience premium', 'background'),
    };
  }
  
  // Feedback/Survey
  if (lower.includes('feedback') || lower.includes('survey') || lower.includes('review')) {
    return {
      hero: enhance('feedback conversation communication', 'hero'),
      feature: enhance('rating review satisfaction', 'feature'),
      secondary: enhance('customer service support', 'feature'),
      tertiary: enhance('quality improvement', 'feature'),
      product: enhance('feedback form survey', 'product'),
      destination: enhance('customer support office', 'background'),
    };
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
    hero: enhance(keywords || 'professional business workspace', 'hero'),
    feature: enhance('modern technology design', 'feature'),
    secondary: enhance('business professional', 'feature'),
    tertiary: enhance('innovation digital', 'feature'),
    product: enhance('product service business', 'product'),
    destination: enhance('office workspace modern', 'background'),
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

