'use client';

import { ButtonBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';

interface ButtonBlockSettingsProps {
  block: ButtonBlock;
  onUpdate: (blockId: string, updates: Partial<ButtonBlock>) => void;
}

export function ButtonBlockSettings({
  block,
  onUpdate,
}: ButtonBlockSettingsProps) {
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
      {/* Button Text */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Button Text
        </label>
        <input
          type="text"
          value={block.content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        />
      </div>

      {/* Button URL */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Button URL
        </label>
        <input
          type="text"
          value={block.content.url}
          onChange={(e) => updateContent({ url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
          placeholder="https://example.com"
        />
      </div>

      {/* Style */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Button Style
        </label>
        <select
          value={block.settings.style}
          onChange={(e) => updateSettings({ style: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="solid">Solid</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost (Link)</option>
        </select>
      </div>

      {/* Button Color */}
      <ColorPicker
        label="Button Color"
        value={block.settings.color}
        onChange={(value) => updateSettings({ color: value })}
      />

      {/* Text Color */}
      <ColorPicker
        label="Text Color"
        value={block.settings.textColor}
        onChange={(value) => updateSettings({ textColor: value })}
      />

      {/* Alignment */}
      <AlignmentPicker
        label="Alignment"
        value={block.settings.align}
        onChange={(value) => updateSettings({ align: value })}
      />

      {/* Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Size
        </label>
        <select
          value={block.settings.size}
          onChange={(e) => updateSettings({ size: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Border Radius
        </label>
        <select
          value={block.settings.borderRadius}
          onChange={(e) => updateSettings({ borderRadius: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="0px">Square (0px)</option>
          <option value="4px">Slightly Rounded (4px)</option>
          <option value="6px">Rounded (6px)</option>
          <option value="8px">More Rounded (8px)</option>
          <option value="24px">Pill (24px)</option>
        </select>
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
          <option value="14px">Small (14px)</option>
          <option value="16px">Medium (16px)</option>
          <option value="18px">Large (18px)</option>
        </select>
      </div>

      {/* Button Padding */}
      <PaddingInput
        label="Button Padding"
        value={block.settings.padding}
        onChange={(value) => updateSettings({ padding: value })}
      />

      {/* Container Padding */}
      <PaddingInput
        label="Container Padding"
        value={block.settings.containerPadding}
        onChange={(value) => updateSettings({ containerPadding: value })}
      />
    </div>
  );
}

