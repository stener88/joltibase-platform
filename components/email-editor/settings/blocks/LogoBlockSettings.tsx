'use client';

import { LogoBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';

interface LogoBlockSettingsProps {
  block: LogoBlock;
  onUpdate: (blockId: string, updates: Partial<LogoBlock>) => void;
}

export function LogoBlockSettings({ block, onUpdate }: LogoBlockSettingsProps) {
  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  return (
    <div className="p-6 space-y-6">
      <AlignmentPicker
        label="Alignment"
        value={block.settings.align}
        onChange={(value) => updateSettings({ align: value })}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Width</label>
        <input
          type="text"
          value={block.settings.width}
          onChange={(e) => updateSettings({ width: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          placeholder="120px"
        />
      </div>

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

