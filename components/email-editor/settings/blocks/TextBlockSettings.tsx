'use client';

import { TextBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';

interface TextBlockSettingsProps {
  block: TextBlock;
  onUpdate: (blockId: string, updates: Partial<TextBlock>) => void;
}

export function TextBlockSettings({
  block,
  onUpdate,
}: TextBlockSettingsProps) {
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
          Text Content
        </label>
        <textarea
          value={block.content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          rows={6}
        />
        <p className="text-xs text-gray-500">
          Supports basic HTML for formatting (bold, italic, links)
        </p>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Font Size
        </label>
        <select
          value={block.settings.fontSize}
          onChange={(e) => updateSettings({ fontSize: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="12px">Small (12px)</option>
          <option value="14px">Default (14px)</option>
          <option value="16px">Medium (16px)</option>
          <option value="18px">Large (18px)</option>
          <option value="20px">Extra Large (20px)</option>
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="400">Normal (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semi-Bold (600)</option>
          <option value="700">Bold (700)</option>
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="1.4">Tight (1.4)</option>
          <option value="1.5">Normal (1.5)</option>
          <option value="1.6">Relaxed (1.6)</option>
          <option value="1.8">Loose (1.8)</option>
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

