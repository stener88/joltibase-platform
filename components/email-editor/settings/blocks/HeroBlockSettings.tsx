'use client';

import { HeroBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';

interface HeroBlockSettingsProps {
  block: HeroBlock;
  onUpdate: (blockId: string, updates: Partial<HeroBlock>) => void;
}

export function HeroBlockSettings({ block, onUpdate }: HeroBlockSettingsProps) {
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, { content: { ...block.content, ...updates } });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Headline</label>
        <textarea
          value={block.content.headline}
          onChange={(e) => updateContent({ headline: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Subheadline (Optional)</label>
        <textarea
          value={block.content.subheadline || ''}
          onChange={(e) => updateContent({ subheadline: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
        <input
          type="text"
          value={block.content.imageUrl || ''}
          onChange={(e) => updateContent({ imageUrl: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      <AlignmentPicker
        label="Alignment"
        value={block.settings.align}
        onChange={(value) => updateSettings({ align: value })}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Headline Font Size</label>
        <select
          value={block.settings.headlineFontSize}
          onChange={(e) => updateSettings({ headlineFontSize: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="44px">Medium (44px)</option>
          <option value="56px">Large (56px)</option>
          <option value="70px">Extra Large (70px)</option>
          <option value="100px">Huge (100px)</option>
        </select>
      </div>

      <ColorPicker
        label="Headline Color"
        value={block.settings.headlineColor}
        onChange={(value) => updateSettings({ headlineColor: value })}
      />

      <ColorPicker
        label="Subheadline Color"
        value={block.settings.subheadlineColor}
        onChange={(value) => updateSettings({ subheadlineColor: value })}
      />

      {block.settings.backgroundColor !== undefined && (
        <ColorPicker
          label="Background Color"
          value={block.settings.backgroundColor || ''}
          onChange={(value) => updateSettings({ backgroundColor: value || undefined })}
        />
      )}

      <PaddingInput
        label="Padding"
        value={block.settings.padding}
        onChange={(value) => updateSettings({ padding: value })}
      />
    </div>
  );
}

