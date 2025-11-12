'use client';

import { ImageBlock } from '@/lib/email/blocks/types';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';

interface ImageBlockSettingsProps {
  block: ImageBlock;
  onUpdate: (blockId: string, updates: Partial<ImageBlock>) => void;
}

export function ImageBlockSettings({
  block,
  onUpdate,
}: ImageBlockSettingsProps) {
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, {
      content: { ...block.content, ...updates },
    });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, {
      settings: { ...block.settings, ...updates },
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Image URL */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          value={block.content.imageUrl}
          onChange={(e) => updateContent({ imageUrl: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Alt Text */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Alt Text
        </label>
        <input
          type="text"
          value={block.content.altText}
          onChange={(e) => updateContent({ altText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          placeholder="Image description"
        />
      </div>

      {/* Link URL */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Link URL (Optional)
        </label>
        <input
          type="text"
          value={block.content.linkUrl || ''}
          onChange={(e) => updateContent({ linkUrl: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          placeholder="https://example.com"
        />
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Caption (Optional)
        </label>
        <input
          type="text"
          value={block.content.caption || ''}
          onChange={(e) => updateContent({ caption: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          placeholder="Image caption"
        />
      </div>

      {/* Alignment */}
      <AlignmentPicker
        label="Alignment"
        value={block.settings.align}
        onChange={(value) => updateSettings({ align: value })}
      />

      {/* Width */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Width
        </label>
        <select
          value={block.settings.width}
          onChange={(e) => updateSettings({ width: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="100%">Full Width (100%)</option>
          <option value="75%">Three Quarters (75%)</option>
          <option value="50%">Half (50%)</option>
          <option value="300px">Small (300px)</option>
          <option value="400px">Medium (400px)</option>
          <option value="500px">Large (500px)</option>
        </select>
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Border Radius
        </label>
        <select
          value={block.settings.borderRadius || '0px'}
          onChange={(e) => updateSettings({ borderRadius: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="0px">Square (0px)</option>
          <option value="4px">Slightly Rounded (4px)</option>
          <option value="8px">Rounded (8px)</option>
          <option value="12px">Very Rounded (12px)</option>
        </select>
      </div>

      {/* Padding */}
      <PaddingInput
        label="Padding"
        value={block.settings.padding}
        onChange={(value) => updateSettings({ padding: value })}
      />
    </div>
  );
}

