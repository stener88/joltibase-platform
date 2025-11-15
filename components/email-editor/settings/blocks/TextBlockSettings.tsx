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
          value={block.content.text || ''}
          onChange={(e) => updateContent({ text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
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
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="12px">12px (Small)</option>
          <option value="14px">14px (Body)</option>
          <option value="16px">16px (Medium)</option>
          <option value="18px">18px (Large)</option>
          <option value="20px">20px (Extra Large)</option>
          <option value="24px">24px (Subheading)</option>
          <option value="28px">28px (Heading 4)</option>
          <option value="36px">36px (Heading 3)</option>
          <option value="44px">44px (Heading 2)</option>
          <option value="56px">56px (Heading 1)</option>
          <option value="70px">70px (Display)</option>
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
          <option value="500">Medium (500)</option>
          <option value="600">Semi-Bold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">Extra Bold (800)</option>
          <option value="900">Black (900)</option>
        </select>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Font Family
        </label>
        <select
          value={block.settings.fontFamily || 'inherit'}
          onChange={(e) => updateSettings({ fontFamily: e.target.value === 'inherit' ? undefined : e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="inherit">Use Global Font</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', Times, serif">Times New Roman</option>
          <option value="'Courier New', Courier, monospace">Courier New</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="Tahoma, sans-serif">Tahoma</option>
          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
          <option value="Impact, sans-serif">Impact</option>
          <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
        </select>
        <p className="text-xs text-gray-500">
          Override the global font family for this text block
        </p>
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
          <option value="1.2">Compact (1.2)</option>
          <option value="1.4">Normal (1.4)</option>
          <option value="1.5">Comfortable (1.5)</option>
          <option value="1.6">Relaxed (1.6)</option>
          <option value="1.8">Loose (1.8)</option>
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

