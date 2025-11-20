/**
 * Unsplash Download Tracker
 * 
 * Tracks photo downloads to provide attribution data to photographers
 * Required by Unsplash API Guidelines
 */

/**
 * Track a photo download with Unsplash
 * Required to properly attribute photographers
 * 
 * @param downloadLocation - The download_location URL from the photo response
 */
export async function trackUnsplashDownload(downloadLocation: string): Promise<void> {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!apiKey) {
    console.warn('[Unsplash] Cannot track download - UNSPLASH_ACCESS_KEY not configured');
    return;
  }
  
  try {
    const response = await fetch(downloadLocation, {
      method: 'GET',
      headers: {
        'Authorization': `Client-ID ${apiKey}`,
        'Accept-Version': 'v1',
      },
    });
    
    if (!response.ok) {
      console.error(`[Unsplash] Download tracking failed: ${response.status}`);
      return;
    }
    
    console.log('[Unsplash] ✅ Download tracked');
    
  } catch (error) {
    console.error('[Unsplash] Download tracking error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

