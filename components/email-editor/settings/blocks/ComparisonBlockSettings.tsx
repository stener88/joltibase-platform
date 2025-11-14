'use client';

import { ComparisonBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';

interface ComparisonBlockSettingsProps {
  block: ComparisonBlock;
  onUpdate: (blockId: string, updates: Partial<ComparisonBlock>) => void;
}

export function ComparisonBlockSettings({ block, onUpdate }: ComparisonBlockSettingsProps) {
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, { content: { ...block.content, ...updates } });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Before</h4>
        <div className="space-y-2">
          <label className="block text-xs text-gray-600">Label</label>
          <input
            type="text"
            value={block.content.before.label || 'BEFORE'}
            onChange={(e) =>
              updateContent({
                before: { ...block.content.before, label: e.target.value || undefined },
              })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs text-gray-600">Text</label>
          <textarea
            value={block.content.before.text}
            onChange={(e) =>
              updateContent({
                before: { ...block.content.before, text: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
            rows={3}
          />
        </div>
        <ColorPicker
          label="Label Color"
          value={block.settings.beforeLabelColor}
          onChange={(value) => updateSettings({ beforeLabelColor: value })}
        />
        <ColorPicker
          label="Background Color"
          value={block.settings.beforeBackgroundColor}
          onChange={(value) => updateSettings({ beforeBackgroundColor: value })}
        />
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h4 className="text-sm font-medium text-gray-700">After</h4>
        <div className="space-y-2">
          <label className="block text-xs text-gray-600">Label</label>
          <input
            type="text"
            value={block.content.after.label || 'AFTER'}
            onChange={(e) =>
              updateContent({
                after: { ...block.content.after, label: e.target.value || undefined },
              })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs text-gray-600">Text</label>
          <textarea
            value={block.content.after.text}
            onChange={(e) =>
              updateContent({
                after: { ...block.content.after, text: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
            rows={3}
          />
        </div>
        <ColorPicker
          label="Label Color"
          value={block.settings.afterLabelColor}
          onChange={(value) => updateSettings({ afterLabelColor: value })}
        />
        <ColorPicker
          label="Background Color"
          value={block.settings.afterBackgroundColor}
          onChange={(value) => updateSettings({ afterBackgroundColor: value })}
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <PaddingInput
          label="Padding"
          value={block.settings.padding}
          onChange={(value) => updateSettings({ padding: value })}
        />
      </div>
    </div>
  );
}

