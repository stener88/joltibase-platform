'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

export interface SelectedImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  credit?: {
    photographerName: string;
    photographerUrl: string;
    unsplashUrl: string;
  };
  downloadLocation?: string;
}

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  user: {
    name: string;
    profileUrl: string;
  };
  downloadLocation: string;
  alt: string;
  width: number;
  height: number;
}

interface ImagePickerUnsplashProps {
  onSelect: (image: SelectedImage) => void;
  onClose: () => void;
}

export function ImagePickerUnsplash({ onSelect, onClose }: ImagePickerUnsplashProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch('/api/unsplash/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), count: 12 }),
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.images || []);
    } catch (error) {
      console.error('Unsplash search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image: UnsplashImage) => {
    onSelect({
      url: image.urls.regular,
      alt: image.alt,
      width: Math.min(image.width, 600),
      height: Math.round((Math.min(image.width, 600) / image.width) * image.height),
      credit: {
        photographerName: image.user.name,
        photographerUrl: image.user.profileUrl,
        unsplashUrl: `https://unsplash.com/photos/${image.id}`,
      },
      downloadLocation: image.downloadLocation,
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for images (e.g., 'workspace', 'technology')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={loading || !query.trim()}
          className="px-6"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            'Search'
          )}
        </Button>
      </div>

      {/* Results Grid */}
      <div className="min-h-[400px] max-h-[500px] overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg font-medium">No images found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Search className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">Search Unsplash</p>
            <p className="text-sm">Find professional photos for your email</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {results.map((image) => (
              <div
                key={image.id}
                className="group cursor-pointer relative rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg"
                onClick={() => handleImageSelect(image)}
              >
                <img
                  src={image.urls.small}
                  alt={image.alt}
                  className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-end">
                  <div className="p-2 w-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">
                      Photo by {image.user.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attribution */}
      <p className="text-xs text-gray-500 text-center">
        Photos from{' '}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Unsplash
        </a>
      </p>
    </div>
  );
}

