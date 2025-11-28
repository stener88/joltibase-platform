/**
 * Unsplash Search API Route
 * 
 * POST /api/unsplash/search
 * Search for images on Unsplash for image picker
 */

import { NextRequest, NextResponse } from 'next/server';

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
  width: number;
  height: number;
}

export async function POST(request: NextRequest) {
  try {
    const { query, count = 12, orientation = 'landscape' } = await request.json();
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Unsplash API key not configured' },
        { status: 500 }
      );
    }
    
    // Build API URL for search
    const params = new URLSearchParams({
      query: query.trim(),
      per_page: Math.min(count, 30).toString(),
      orientation,
    });
    
    const url = `https://api.unsplash.com/search/photos?${params}`;
    
    console.log(`[Unsplash Search] Query: "${query}", Count: ${count}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${apiKey}`,
        'Accept-Version': 'v1',
      },
    });
    
    if (!response.ok) {
      console.error(`[Unsplash Search] API error: ${response.status}`);
      return NextResponse.json(
        { error: 'Unsplash API error' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return NextResponse.json({
        images: [],
        total: 0,
      });
    }
    
    // Map to simplified format
    const images = data.results.map((photo: UnsplashPhoto) => ({
      id: photo.id,
      urls: photo.urls,
      user: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html,
      },
      downloadLocation: photo.links.download_location,
      alt: photo.alt_description || photo.description || query,
      width: photo.width,
      height: photo.height,
    }));
    
    console.log(`[Unsplash Search] Found ${images.length} images`);
    
    return NextResponse.json({
      images,
      total: data.total,
    });
    
  } catch (error: any) {
    console.error('[Unsplash Search] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}

