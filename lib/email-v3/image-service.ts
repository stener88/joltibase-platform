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
 * Fetch images for email generation based on prompt
 * Adaptively fetches 3, 6, or 10 images based on email complexity
 */
export async function fetchImagesForPrompt(prompt: string): Promise<ImageContext> {
  const imageCount = getImageCountForPrompt(prompt);
  console.log(`🖼️ [IMAGE-SERVICE] Fetching ${imageCount} images for: "${prompt}"`);
  
  try {
    // Extract keywords from prompt
    const keywords = extractImageKeywords(prompt);
    
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
 * Extract relevant keywords from user prompt for image search
 */
function extractImageKeywords(prompt: string): {
  hero: string;
  feature?: string;
  secondary?: string;
  tertiary?: string;
  product?: string;
  destination?: string;
} {
  const lower = prompt.toLowerCase();
  
  // Travel/Tourism
  if (lower.includes('travel') || lower.includes('destination') || lower.includes('trip')) {
    return {
      hero: 'travel adventure vacation',
      feature: 'travel activities tourism',
      secondary: 'travel exploration',
      tertiary: 'adventure journey',
      product: 'travel destination scenic',
      destination: 'beautiful city landscape',
    };
  }
  
  // Promotional/Retail
  if (lower.includes('sale') || lower.includes('promotion') || lower.includes('discount') || lower.includes('shopping')) {
    return {
      hero: 'shopping sale retail store',
      feature: 'product showcase retail',
      secondary: 'shopping experience',
      tertiary: 'sale celebration',
      product: 'product display merchandise',
      destination: 'store retail location',
    };
  }
  
  // Events/Invitations
  if (lower.includes('event') || lower.includes('invitation') || lower.includes('conference') || lower.includes('webinar')) {
    return {
      hero: 'conference event professional',
      feature: 'business meeting presentation',
      secondary: 'networking professional',
      tertiary: 'workshop training',
      product: 'speaker presentation',
      destination: 'venue conference hall',
    };
  }
  
  // Product Launch/Update
  if (lower.includes('product') || lower.includes('launch') || lower.includes('announcement')) {
    return {
      hero: 'product launch technology modern',
      feature: 'modern product design',
      secondary: 'innovation technology',
      tertiary: 'digital product',
      product: 'product showcase display',
      destination: 'modern workspace office',
    };
  }
  
  // Newsletter/Content
  if (lower.includes('newsletter') || lower.includes('digest') || lower.includes('tips')) {
    return {
      hero: 'newsletter reading coffee workspace',
      feature: 'creative workspace content',
      secondary: 'reading learning',
      tertiary: 'inspiration creativity',
      product: 'content creation writing',
      destination: 'library books learning',
    };
  }
  
  // Welcome/Onboarding
  if (lower.includes('welcome') || lower.includes('onboard')) {
    return {
      hero: 'welcome handshake professional team',
      feature: 'team collaboration workspace',
      secondary: 'onboarding training',
      tertiary: 'success celebration',
      product: 'team member professional',
      destination: 'office workspace modern',
    };
  }
  
  // Loyalty/Rewards
  if (lower.includes('loyalty') || lower.includes('reward') || lower.includes('points')) {
    return {
      hero: 'reward celebration success',
      feature: 'exclusive benefits vip',
      secondary: 'achievement success',
      tertiary: 'premium quality',
      product: 'rewards benefits exclusive',
      destination: 'luxury experience premium',
    };
  }
  
  // Feedback/Survey
  if (lower.includes('feedback') || lower.includes('survey') || lower.includes('review')) {
    return {
      hero: 'feedback conversation communication',
      feature: 'rating review satisfaction',
      secondary: 'customer service support',
      tertiary: 'quality improvement',
      product: 'feedback form survey',
      destination: 'customer support office',
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
    hero: keywords || 'professional business workspace',
    feature: 'modern technology design',
    secondary: 'business professional',
    tertiary: 'innovation digital',
    product: 'product service business',
    destination: 'office workspace modern',
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

