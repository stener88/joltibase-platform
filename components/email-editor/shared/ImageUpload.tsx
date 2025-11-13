'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  campaignId?: string;
  accept?: string;
  maxSize?: number; // in bytes
}

export function ImageUpload({ 
  value, 
  onChange, 
  campaignId,
  accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
  maxSize = 5 * 1024 * 1024, // 5MB default
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      setError('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit.`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (campaignId) {
        formData.append('campaignId', campaignId);
      }

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.data.url);
      setError(null);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, campaignId, maxSize]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  return (
    <div className="space-y-2">
      {/* Preview */}
      {(preview || value) && (
        <div className="relative w-full h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <img
            src={preview || value}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-sm">Uploading...</div>
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isUploading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
            : 'border-gray-300 hover:border-[#1a1aff] hover:bg-[#1a1aff]/5'
          }
        `}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#e9a589] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm text-gray-600">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-500">
              PNG, JPG, GIF, WebP up to {Math.round(maxSize / 1024 / 1024)}MB
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

