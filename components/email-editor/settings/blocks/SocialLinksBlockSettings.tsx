'use client';

import { SocialLinksBlock } from '@/lib/email/blocks/types';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';

interface SocialLinksBlockSettingsProps {
  block: SocialLinksBlock;
  onUpdate: (blockId: string, updates: Partial<SocialLinksBlock>) => void;
}

export function SocialLinksBlockSettings({ block, onUpdate }: SocialLinksBlockSettingsProps) {
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, { content: { ...block.content, ...updates } });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  const updateLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...block.content.links];
    newLinks[index] = { ...newLinks[index], [field]: value as any };
    updateContent({ links: newLinks });
  };

  const addLink = () => {
    updateContent({
      links: [...block.content.links, { platform: 'twitter', url: '' }],
    });
  };

  const removeLink = (index: number) => {
    updateContent({
      links: block.content.links.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Social Links</label>
        {block.content.links.map((link, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <select
              value={link.platform}
              onChange={(e) => updateLink(index, 'platform', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
            >
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="github">GitHub</option>
              <option value="tiktok">TikTok</option>
            </select>
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
              placeholder="https://..."
            />
            <button
              onClick={() => removeLink(index)}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addLink}
          className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
        >
          + Add Social Link
        </button>
      </div>

      <AlignmentPicker
        label="Alignment"
        value={block.settings.align}
        onChange={(value) => updateSettings({ align: value })}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Icon Size</label>
        <select
          value={block.settings.iconSize}
          onChange={(e) => updateSettings({ iconSize: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="24px">Small (24px)</option>
          <option value="32px">Medium (32px)</option>
          <option value="40px">Large (40px)</option>
        </select>
      </div>

      <PaddingInput
        label="Padding"
        value={block.settings.padding}
        onChange={(value) => updateSettings({ padding: value })}
      />
    </div>
  );
}

