'use client';

import { useState } from 'react';
import { ImageBlock } from '@/lib/email/blocks/types';
import { ImageUploadModal } from '../../shared/ImageUploadModal';
import { Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';

interface ImageContentSettingsProps {
  block: ImageBlock;
  onUpdate: (blockId: string, updates: Partial<ImageBlock>) => void;
  campaignId?: string;
}

interface ImageItem {
  url: string;
  altText: string;
  linkUrl?: string;
}

export function ImageContentSettings({ block, onUpdate, campaignId }: ImageContentSettingsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Support both legacy format (imageUrl) and new format (images array)
  const images: ImageItem[] = block.content.images && Array.isArray(block.content.images)
    ? block.content.images
    : block.content.imageUrl
    ? [{ url: block.content.imageUrl, altText: block.content.altText || 'Image', linkUrl: block.content.linkUrl }]
    : [{ url: '', altText: 'Image', linkUrl: '' }];

  const updateContent = (newImages: ImageItem[]) => {
    onUpdate(block.id, { 
      content: { 
        ...block.content, 
        images: newImages,
        // Clear legacy fields
        imageUrl: undefined,
        altText: undefined,
        linkUrl: undefined,
        caption: undefined,
      } 
    });
  };

  const handleAddImage = () => {
    if (images.length >= 9) {
      alert('Maximum 9 images allowed');
      return;
    }
    setEditingIndex(images.length);
    setIsModalOpen(true);
  };

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleUpload = (url: string) => {
    const newImages = [...images];
    if (editingIndex !== null) {
      newImages[editingIndex] = {
        ...newImages[editingIndex],
        url,
      };
      updateContent(newImages);
    }
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      // Keep at least one image entry
      updateContent([{ url: '', altText: 'Image', linkUrl: '' }]);
    } else {
      const newImages = images.filter((_, i) => i !== index);
      updateContent(newImages);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    updateContent(newImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    updateContent(newImages);
  };

  const handleUpdateImage = (index: number, updates: Partial<ImageItem>) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], ...updates };
    updateContent(newImages);
  };

  return (
    <>
      <div className="p-6 space-y-4">
        {/* Image Count Indicator */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">
            Images ({images.filter(img => img.url).length} of {images.length})
          </h4>
          {images.length < 9 && (
            <button
              type="button"
              onClick={handleAddImage}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#e9a589] rounded-lg hover:bg-[#d89478] transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Image
            </button>
          )}
        </div>

        {/* Image List */}
        <div className="space-y-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
            >
              {/* Image Preview & Controls */}
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <button
                  type="button"
                  onClick={() => handleEditImage(index)}
                  className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-[#e9a589] transition-colors bg-gray-50"
                >
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.altText}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      📷
                    </div>
                  )}
                </button>

                {/* Image Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-2">
                    Image {index + 1}
                  </div>
                  
                  {/* Alt Text */}
                  <input
                    type="text"
                    value={image.altText}
                    onChange={(e) => handleUpdateImage(index, { altText: e.target.value })}
                    placeholder="Alt text"
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589] mb-2"
                  />

                  {/* Link URL */}
                  <input
                    type="text"
                    value={image.linkUrl || ''}
                    onChange={(e) => handleUpdateImage(index, { linkUrl: e.target.value })}
                    placeholder="Link URL (optional)"
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === images.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Change Image Button */}
              <button
                type="button"
                onClick={() => handleEditImage(index)}
                className="w-full px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
              >
                {image.url ? 'Change Image' : 'Upload Image'}
              </button>
            </div>
          ))}
        </div>

        {/* Helper Text */}
        {images.length < 9 && (
          <p className="text-xs text-gray-500 text-center pt-2">
            Add up to {9 - images.length} more image{9 - images.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIndex(null);
        }}
        onUpload={handleUpload}
        onDelete={() => {
          if (editingIndex !== null) {
            handleRemoveImage(editingIndex);
          }
          setIsModalOpen(false);
          setEditingIndex(null);
        }}
        currentImageUrl={editingIndex !== null ? images[editingIndex]?.url : ''}
        campaignId={campaignId}
        type="image"
      />
    </>
  );
}

