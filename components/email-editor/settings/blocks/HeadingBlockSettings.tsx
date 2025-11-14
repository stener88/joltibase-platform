'use client';

import { HeadingBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';

interface HeadingBlockSettingsProps {
  block: HeadingBlock;
  onUpdate: (blockId: string, updates: Partial<HeadingBlock>) => void;
}

export function HeadingBlockSettings({
  block,
  onUpdate,
}: HeadingBlockSettingsProps) {
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
      {/* Text Content */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Heading Text
        </label>
        <textarea
          value={block.content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          rows={3}
        />
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Font Size
        </label>
        <select
          value={block.settings.fontSize}
          onChange={(e) => updateSettings({ fontSize: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="28px">Small (28px)</option>
          <option value="36px">Medium (36px)</option>
          <option value="44px">Large (44px)</option>
          <option value="56px">Extra Large (56px)</option>
          <option value="70px">Huge (70px)</option>
        </select>
      </div>

      {/* Font Weight */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Font Weight
        </label>
        <select
          value={block.settings.fontWeight}
          onChange={(e) => updateSettings({ fontWeight: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="400">Normal (400)</option>
          <option value="600">Semi-Bold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">Extra Bold (800)</option>
          <option value="900">Black (900)</option>
        </select>
      </div>

      {/* Color */}
      <ColorPicker
        label="Text Color"
        value={block.settings.color}
        onChange={(value) => updateSettings({ color: value })}
      />

      {/* Alignment */}
      <AlignmentPicker
        label="Alignment"
        value={block.settings.align}
        onChange={(value) => updateSettings({ align: value })}
      />

      {/* Line Height */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Line Height
        </label>
        <select
          value={block.settings.lineHeight}
          onChange={(e) => updateSettings({ lineHeight: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="1.0">Tight (1.0)</option>
          <option value="1.1">Snug (1.1)</option>
          <option value="1.2">Normal (1.2)</option>
          <option value="1.3">Relaxed (1.3)</option>
        </select>
      </div>

      {/* Background Color */}
      {block.settings.backgroundColor !== undefined && (
        <ColorPicker
          label="Background Color (Optional)"
          value={block.settings.backgroundColor || ''}
          onChange={(value) => updateSettings({ backgroundColor: value || undefined })}
        />
      )}

      {/* Padding */}
      <PaddingInput
        label="Padding"
        value={block.settings.padding}
        onChange={(value) => updateSettings({ padding: value })}
      />
    </div>
  );
}

