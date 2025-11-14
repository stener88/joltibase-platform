'use client';

import { useState } from 'react';
import { LogoBlock } from '@/lib/email/blocks/types';
import { ImageUploadModal } from '../../shared/ImageUploadModal';

interface LogoContentSettingsProps {
  block: LogoBlock;
  onUpdate: (blockId: string, updates: Partial<LogoBlock>) => void;
  campaignId?: string;
}

export function LogoContentSettings({ block, onUpdate, campaignId }: LogoContentSettingsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, { content: { ...block.content, ...updates } });
  };

  const insertMergeTag = () => {
    const currentValue = block.content.imageUrl || '';
    updateContent({ imageUrl: currentValue + '{{logo_url}}' });
  };

  const handleUpload = (url: string) => {
    updateContent({ imageUrl: url });
  };

  const handleDelete = () => {
    updateContent({ imageUrl: '' });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Logo Image URL */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Logo Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={block.content.imageUrl}
              onChange={(e) => updateContent({ imageUrl: e.target.value })}
              placeholder="{{logo_url}}"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
            />
            <button
              type="button"
              onClick={insertMergeTag}
              className="px-3 py-2 text-xs font-medium text-[#e9a589] border border-[#e9a589] rounded-lg hover:bg-[#e9a589]/5 transition-colors"
              title="Insert merge tag"
            >
              {'{{logo_url}}'}
            </button>
          </div>
        </div>

        {/* Upload Logo Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Upload Logo
          </button>
        </div>

        {/* Alt Text */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Alt Text</label>
          <input
            type="text"
            value={block.content.altText}
            onChange={(e) => updateContent({ altText: e.target.value })}
            placeholder="Logo"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          />
        </div>

        {/* Link URL */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Link URL (Optional)</label>
          <input
            type="text"
            value={block.content.linkUrl || ''}
            onChange={(e) => updateContent({ linkUrl: e.target.value || undefined })}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          />
        </div>
      </div>

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        onDelete={handleDelete}
        currentImageUrl={block.content.imageUrl}
        campaignId={campaignId}
        type="logo"
      />
    </>
  );
}

