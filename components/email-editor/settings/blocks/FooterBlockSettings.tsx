'use client';

import { FooterBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';

interface FooterBlockSettingsProps {
  block: FooterBlock;
  onUpdate: (blockId: string, updates: Partial<FooterBlock>) => void;
}

export function FooterBlockSettings({ block, onUpdate }: FooterBlockSettingsProps) {
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, { content: { ...block.content, ...updates } });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Company Name</label>
        <input
          type="text"
          value={block.content.companyName}
          onChange={(e) => updateContent({ companyName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Company Address (Optional)</label>
        <textarea
          value={block.content.companyAddress || ''}
          onChange={(e) => updateContent({ companyAddress: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Custom Text (Optional)</label>
        <textarea
          value={block.content.customText || ''}
          onChange={(e) => updateContent({ customText: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Unsubscribe URL</label>
        <input
          type="text"
          value={block.content.unsubscribeUrl}
          onChange={(e) => updateContent({ unsubscribeUrl: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
        <p className="text-xs text-gray-500">Use merge tags like {'{{unsubscribe_url}}'}</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Preferences URL (Optional)</label>
        <input
          type="text"
          value={block.content.preferencesUrl || ''}
          onChange={(e) => updateContent({ preferencesUrl: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      <AlignmentPicker
        label="Alignment"
        value={block.settings.align}
        onChange={(value) => updateSettings({ align: value })}
      />

      <ColorPicker
        label="Text Color"
        value={block.settings.textColor}
        onChange={(value) => updateSettings({ textColor: value })}
      />

      {block.settings.backgroundColor !== undefined && (
        <ColorPicker
          label="Background Color (Optional)"
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

