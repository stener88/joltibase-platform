/**
 * Unsplash API Client
 * 
 * Fetches professional images from Unsplash API for email campaigns
 * Uses /photos/random endpoint for contextual image generation
 */

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
  
  try {
    // Build API URL
    const params = new URLSearchParams({
      query,
      orientation,
      count: '1',
    });
    
    const url = `https://api.unsplash.com/photos/random?${params}`;
    
    console.log(`[Unsplash] Fetching image for: "${query}"`);
    
    // Fetch with timeout
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
    
    const photo = await response.json() as UnsplashPhoto;
    
    // Construct image URL with optional dimensions
    let imageUrl = photo.urls.regular;
    if (width || height) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('fit', 'crop');
      imageUrl = `${photo.urls.raw}&${params}`;
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
    };
    
    console.log(`[Unsplash] ✅ Fetched image by ${result.credit.photographerName}`);
    
    return result;
    
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

