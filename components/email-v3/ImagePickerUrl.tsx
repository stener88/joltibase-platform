'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import type { SelectedImage } from './ImagePickerUnsplash';

interface ImagePickerUrlProps {
  onSelect: (image: SelectedImage) => void;
  onClose: () => void;
  currentSrc?: string;
  currentAlt?: string;
}

export function ImagePickerUrl({ onSelect, onClose, currentSrc = '', currentAlt = '' }: ImagePickerUrlProps) {
  const [url, setUrl] = useState(currentSrc);
  const [alt, setAlt] = useState(currentAlt);
  const [preview, setPreview] = useState<string | null>(currentSrc || null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handlePreview = () => {
    if (!isValidUrl(url)) {
      setImageError(true);
      setPreview(null);
      return;
    }
    
    setImageError(false);
    setLoading(true);
    setPreview(url);
  };

  const handleSelect = () => {
    if (!url || !isValidUrl(url)) return;
    
    onSelect({
      url,
      alt: alt || 'Image',
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setImageError(false);
            }}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              imageError 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
        </div>
        {imageError && (
          <p className="mt-1 text-sm text-red-600">
            Please enter a valid image URL
          </p>
        )}
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alt Text (Description)
        </label>
        <input
          type="text"
          placeholder="Descriptive text for accessibility"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Describe what the image shows for accessibility
        </p>
      </div>

      {/* Preview Button */}
      <Button 
        onClick={handlePreview} 
        variant="outline" 
        className="w-full"
        disabled={!url || !isValidUrl(url)}
      >
        <ImageIcon className="mr-2 h-4 w-4" />
        Preview Image
      </Button>

      {/* Image Preview */}
      {preview && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="relative bg-white rounded border border-gray-200 overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-auto max-h-64 object-contain"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setImageError(true);
                setPreview(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button 
          onClick={onClose} 
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSelect} 
          className="flex-1"
          disabled={!url || !isValidUrl(url)}
        >
          Use This Image
        </Button>
      </div>
    </div>
  );
}

