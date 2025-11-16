'use client';

import { useState } from 'react';
import { LogoBlock } from '@/lib/email/blocks/types';
import { ImageUploadModal } from '../../shared/ImageUploadModal';
import { useBlockContentUpdates } from '@/hooks/use-block-updates';

interface LogoContentSettingsProps {
  block: LogoBlock;
  onUpdate: (blockId: string, updates: Partial<LogoBlock>) => void;
  campaignId?: string;
}

export function LogoContentSettings({ block, onUpdate, campaignId }: LogoContentSettingsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateContent = useBlockContentUpdates(block, onUpdate);

  const handleUpload = (url: string) => {
    updateContent({ imageUrl: url });
  };

  const handleDelete = () => {
    updateContent({ imageUrl: '' });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Upload Logo Button */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Logo Image</label>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#e9a589] rounded-lg hover:bg-[#d89478] transition-colors"
          >
            {block.content.imageUrl ? 'Change Logo' : 'Upload Logo'}
          </button>
          {block.content.imageUrl && (
            <p className="text-xs text-gray-500 mt-1">Logo uploaded</p>
          )}
        </div>

        {/* Alt Text */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Alt Text</label>
          <input
            type="text"
            value={block.content.altText || ''}
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
        currentImageUrl={block.content.imageUrl || ''}
        campaignId={campaignId}
        type="logo"
      />
    </>
  );
}

