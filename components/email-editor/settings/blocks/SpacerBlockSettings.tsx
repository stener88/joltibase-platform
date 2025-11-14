'use client';

import { SpacerBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';

interface SpacerBlockSettingsProps {
  block: SpacerBlock;
  onUpdate: (blockId: string, updates: Partial<SpacerBlock>) => void;
}

export function SpacerBlockSettings({ block, onUpdate }: SpacerBlockSettingsProps) {
  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Height (px)</label>
        <input
          type="number"
          value={block.settings.height}
          onChange={(e) => updateSettings({ height: parseInt(e.target.value) || 20 })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          min="0"
          max="200"
        />
      </div>

      {block.settings.backgroundColor !== undefined && (
        <ColorPicker
          label="Background Color (Optional)"
          value={block.settings.backgroundColor || ''}
          onChange={(value) => updateSettings({ backgroundColor: value || undefined })}
        />
      )}
    </div>
  );
}

