/**
 * Unsplash API Client
 * 
 * Fetches professional images from Unsplash API for email campaigns
 * Uses /search/photos endpoint with relevance ranking and caching
 */

// In-memory cache for popular queries (limit 100 entries)
const imageCache = new Map<string, UnsplashPhoto[]>();
const CACHE_MAX_SIZE = 100;

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    download_location: string;
  };
  description: string | null;
  alt_description: string | null;
}

interface FetchImageOptions {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'squarish';
  width?: number;
  height?: number;
}

export interface ImageResult {
  url: string;
  credit: {
    photographerName: string;
    photographerUrl: string;
    unsplashUrl: string;
  };
  downloadLocation: string;
  alt: string;
}

/**
 * Fetch a random image from Unsplash based on search query
 * 
 * @param options - Search query and image parameters
 * @returns Image data with attribution, or null if fetch fails
 */
export async function fetchUnsplashImage(
  options: FetchImageOptions
): Promise<ImageResult | null> {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!apiKey) {
    console.warn('[Unsplash] UNSPLASH_ACCESS_KEY not configured, skipping');
    return null;
  }

  const { query, orientation = 'landscape', width, height } = options;
  
  // Check cache first
  const cacheKey = `${query}-${orientation}`;
  if (imageCache.has(cacheKey)) {
    const cachedResults = imageCache.get(cacheKey)!;
    const photo = cachedResults[0]; // Always pick best (most relevant) from cache// Build image URL with dimensions (same as below)
    let imageUrl = photo.urls.regular;
    if (width || height) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('fit', 'crop');
      imageUrl = `${photo.urls.raw}&${params.toString()}`;
    }
    
    return {
      url: imageUrl,
      credit: {
        photographerName: photo.user.name,
        photographerUrl: photo.user.links.html,
        unsplashUrl: `https://unsplash.com/photos/${photo.id}`,
      },
      downloadLocation: photo.links.download_location,
      alt: photo.alt_description || photo.description || query,
    };
  }
  
  try {
    // Build Search API URL (more relevant results than random)
    const params = new URLSearchParams({
      query,
      orientation,
      per_page: '5',           // Top 5 relevant results
      order_by: 'relevant',    // Sort by relevance
      content_filter: 'high',  // Quality filter
    });
    
    const url = `https://api.unsplash.com/search/photos?${params}`;// Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${apiKey}`,
        'Accept-Version': 'v1',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`[Unsplash] API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const responseData = await response.json();
    
    // Search endpoint returns { total, total_pages, results: [...] }
    if (!responseData.results || responseData.results.length === 0) {
      console.warn(`[Unsplash] No images found for: "${query}"`);
      return null;
    }
    
    // Cache the results for future use
    if (responseData.results.length > 0 && imageCache.size < CACHE_MAX_SIZE) {
      imageCache.set(cacheKey, responseData.results);}
    
    // Always pick #1 most relevant result (sorted by relevance)
    const photo = responseData.results[0] as UnsplashPhoto;// Validate response structure
    if (!photo || !photo.urls || !photo.urls.regular) {
      console.error('[Unsplash] Invalid response structure - missing urls');
      return null;
    }
    
    if (!photo.user || !photo.user.name) {
      console.error('[Unsplash] Invalid response structure - missing user info');
      return null;
    }
    
    if (!photo.links || !photo.links.download_location) {
      console.error('[Unsplash] Invalid response structure - missing download location');
      return null;
    }
    
    // Construct image URL with optional dimensions
    let imageUrl = photo.urls.regular;
    if (width || height) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('fit', 'crop');
      imageUrl = `${photo.urls.raw}&${params.toString()}`;
    }
    
    const result: ImageResult = {
      url: imageUrl,
      credit: {
        photographerName: photo.user.name,
        photographerUrl: photo.user.links.html,
        unsplashUrl: `https://unsplash.com/photos/${photo.id}`,
      },
      downloadLocation: photo.links.download_location,
      alt: photo.alt_description || photo.description || query,
    };return result;
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[Unsplash] Request timeout');
      } else {
        console.error('[Unsplash] Fetch error:', error.message);
      }
    }
    return null;
  }
}

/**
 * Get picsum.photos fallback URL
 * Used when Unsplash API fails
 */
export function getPicsumFallback(keyword: string, width: number, height: number): string {
  const seed = keyword.replace(/\s+/g, '-').toLowerCase();
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

