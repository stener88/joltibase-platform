'use client';

import { StatsBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';

interface StatsBlockSettingsProps {
  block: StatsBlock;
  onUpdate: (blockId: string, updates: Partial<StatsBlock>) => void;
}

export function StatsBlockSettings({ block, onUpdate }: StatsBlockSettingsProps) {
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, { content: { ...block.content, ...updates } });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    const newStats = [...block.content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateContent({ stats: newStats });
  };

  const addStat = () => {
    updateContent({
      stats: [...block.content.stats, { value: '0', label: 'Stat' }],
    });
  };

  const removeStat = (index: number) => {
    updateContent({
      stats: block.content.stats.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Layout</label>
        <select
          value={block.settings.layout}
          onChange={(e) => updateSettings({ layout: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="2-col">2 Columns</option>
          <option value="3-col">3 Columns</option>
          <option value="4-col">4 Columns</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Stats</label>
        {block.content.stats.map((stat, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <input
              type="text"
              value={stat.value}
              onChange={(e) => updateStat(index, 'value', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
              placeholder="10,000+"
            />
            <input
              type="text"
              value={stat.label}
              onChange={(e) => updateStat(index, 'label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
              placeholder="Users"
            />
            <button
              onClick={() => removeStat(index)}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addStat}
          className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
        >
          + Add Stat
        </button>
      </div>

      <ColorPicker
        label="Value Color"
        value={block.settings.valueColor}
        onChange={(value) => updateSettings({ valueColor: value })}
      />

      <ColorPicker
        label="Label Color"
        value={block.settings.labelColor}
        onChange={(value) => updateSettings({ labelColor: value })}
      />

      <PaddingInput
        label="Padding"
        value={block.settings.padding}
        onChange={(value) => updateSettings({ padding: value })}
      />
    </div>
  );
}

