'use client';

import { TestimonialBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';

interface TestimonialBlockSettingsProps {
  block: TestimonialBlock;
  onUpdate: (blockId: string, updates: Partial<TestimonialBlock>) => void;
}

export function TestimonialBlockSettings({ block, onUpdate }: TestimonialBlockSettingsProps) {
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, { content: { ...block.content, ...updates } });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Quote</label>
        <textarea
          value={block.content.quote}
          onChange={(e) => updateContent({ quote: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Author</label>
        <input
          type="text"
          value={block.content.author}
          onChange={(e) => updateContent({ author: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Role (Optional)</label>
        <input
          type="text"
          value={block.content.role || ''}
          onChange={(e) => updateContent({ role: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Company (Optional)</label>
        <input
          type="text"
          value={block.content.company || ''}
          onChange={(e) => updateContent({ company: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Avatar URL (Optional)</label>
        <input
          type="text"
          value={block.content.avatarUrl || ''}
          onChange={(e) => updateContent({ avatarUrl: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      <ColorPicker
        label="Quote Color"
        value={block.settings.quoteColor}
        onChange={(value) => updateSettings({ quoteColor: value })}
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

