'use client';

import { DividerBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';

interface DividerBlockSettingsProps {
  block: DividerBlock;
  onUpdate: (blockId: string, updates: Partial<DividerBlock>) => void;
}

export function DividerBlockSettings({ block, onUpdate }: DividerBlockSettingsProps) {
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, { content: { ...block.content, ...updates } });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Style</label>
        <select
          value={block.settings.style}
          onChange={(e) => updateSettings({ style: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="solid">Solid Line</option>
          <option value="dashed">Dashed Line</option>
          <option value="dotted">Dotted Line</option>
          <option value="decorative">Decorative Element</option>
        </select>
      </div>

      {block.settings.style === 'decorative' ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Decorative Element</label>
          <input
            type="text"
            value={block.content.decorativeElement || ''}
            onChange={(e) => updateContent({ decorativeElement: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
            placeholder="✦ ✧ ✦"
          />
        </div>
      ) : (
        <>
          <ColorPicker
            label="Line Color"
            value={block.settings.color || '#e5e7eb'}
            onChange={(value) => updateSettings({ color: value })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Thickness (px)</label>
            <input
              type="number"
              value={block.settings.thickness || 1}
              onChange={(e) => updateSettings({ thickness: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
              min="1"
              max="5"
            />
          </div>
        </>
      )}

      <PaddingInput
        label="Padding"
        value={block.settings.padding}
        onChange={(value) => updateSettings({ padding: value })}
      />
    </div>
  );
}

