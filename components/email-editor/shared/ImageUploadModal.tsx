'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string) => void;
  onDelete?: () => void;
  currentImageUrl?: string;
  campaignId?: string;
  type?: 'logo' | 'image';
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  onDelete,
  currentImageUrl,
  campaignId,
  type = 'logo',
}: ImageUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setPreview(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      setError('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds 5MB limit.');
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

      onUpload(data.data.url);
      setError(null);
      // Close modal after successful upload
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, campaignId, onClose]);

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

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete();
      setTimeout(() => {
        onClose();
      }, 300);
    }
  }, [onDelete, onClose]);

  if (!isOpen) return null;

  const title = type === 'logo' ? 'Manage logo' : 'Manage image';
  const hasCurrentImage = currentImageUrl && !preview;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Image */}
          {hasCurrentImage && (
            <div className="space-y-3">
              <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={currentImageUrl}
                  alt="Current"
                  className="w-full h-full object-contain"
                />
              </div>
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete {type === 'logo' ? 'Logo' : 'Image'}
                </button>
              )}
            </div>
          )}

          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
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
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#e9a589] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="w-12 h-12 text-gray-400"
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
                <span className="text-sm font-medium text-gray-700">
                  Click or drag to upload
                </span>
                <span className="text-xs text-gray-500">
                  Supported file formats PNG, JPG, GIF, WebP
                </span>
              </div>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

