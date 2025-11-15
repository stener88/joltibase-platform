'use client';

import { ImageBlock } from '@/lib/email/blocks/types';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';
import { ColorPicker } from '../../shared/ColorPicker';

interface ImageBlockSettingsProps {
  block: ImageBlock;
  onUpdate: (blockId: string, updates: Partial<ImageBlock>) => void;
}

export function ImageBlockSettings({
  block,
  onUpdate,
}: ImageBlockSettingsProps) {
  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, {
      settings: { ...block.settings, ...updates },
    });
  };

  // Check if we have multiple images to show grid controls
  const imageCount = block.content?.images?.length || 0;
  const hasMultipleImages = imageCount > 1;

  return (
    <div className="p-6 space-y-6">
      {/* Alignment */}
      <AlignmentPicker
        label="Alignment"
        value={block.settings.align}
        onChange={(value) => updateSettings({ align: value })}
      />

      {/* Columns (only show if multiple images) */}
      {hasMultipleImages && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Columns
          </label>
          <select
            value={block.settings.columns || 1}
            onChange={(e) => updateSettings({ columns: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          >
            <option value="1">1 Column (Stacked)</option>
            <option value="2">2 Columns</option>
            <option value="3">3 Columns</option>
          </select>
          <p className="text-xs text-gray-500">
            {imageCount} image{imageCount !== 1 ? 's' : ''} • Grid layout: {block.settings.columns || 1} column{(block.settings.columns || 1) !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Aspect Ratio
        </label>
        <select
          value={block.settings.aspectRatio || 'auto'}
          onChange={(e) => updateSettings({ aspectRatio: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="auto">Auto (Original)</option>
          <option value="1:1">1:1 Square</option>
          <option value="16:9">16:9 Landscape</option>
          <option value="4:3">4:3 Standard</option>
          <option value="3:4">3:4 Portrait</option>
          <option value="2:3">2:3 Tall Portrait</option>
        </select>
        <p className="text-xs text-gray-500">
          Control how images are cropped and displayed
        </p>
      </div>

      {/* Width (only for single column layout) */}
      {(!hasMultipleImages || block.settings.columns === 1) && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Width
          </label>
          <select
            value={block.settings.width}
            onChange={(e) => updateSettings({ width: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          >
            <option value="100%">Full Width (100%)</option>
            <option value="75%">Three Quarters (75%)</option>
            <option value="50%">Half (50%)</option>
            <option value="300px">Small (300px)</option>
            <option value="400px">Medium (400px)</option>
            <option value="500px">Large (500px)</option>
          </select>
        </div>
      )}

      {/* Gap (only show if multiple images) */}
      {hasMultipleImages && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Gap Between Images
          </label>
          <input
            type="number"
            value={block.settings.gap || 8}
            onChange={(e) => updateSettings({ gap: parseInt(e.target.value) || 0 })}
            min="0"
            max="32"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          />
          <p className="text-xs text-gray-500">
            Space between images in pixels (0-32px)
          </p>
        </div>
      )}

      {/* Border Radius */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Border Radius
        </label>
        <select
          value={block.settings.borderRadius || '0px'}
          onChange={(e) => updateSettings({ borderRadius: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="0px">Square (0px)</option>
          <option value="4px">Slightly Rounded (4px)</option>
          <option value="8px">Rounded (8px)</option>
          <option value="12px">Very Rounded (12px)</option>
          <option value="16px">Extra Rounded (16px)</option>
        </select>
      </div>

      {/* Background Color */}
      <ColorPicker
        label="Background Color"
        value={block.settings.backgroundColor || 'transparent'}
        onChange={(value) => updateSettings({ backgroundColor: value })}
      />

      {/* Padding */}
      <PaddingInput
        label="Padding"
        value={block.settings.padding}
        onChange={(value) => updateSettings({ padding: value })}
      />
    </div>
  );
}

