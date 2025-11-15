'use client';

import { EmailBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';

interface Stats3ColSettingsProps {
  block: EmailBlock;
  onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
}

export function Stats3ColSettings({ block, onUpdate }: Stats3ColSettingsProps) {
  const settings = block.settings || {};
  const content = block.content || { stats: [] };
  const stats = content.stats || [
    { value: '100+', label: 'Customers' },
    { value: '95%', label: 'Satisfaction' },
    { value: '24/7', label: 'Support' },
  ];

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    onUpdate(block.id, {
      settings: { ...settings, ...newSettings },
    });
  };

  const updateContent = (newContent: Partial<typeof content>) => {
    onUpdate(block.id, {
      content: { ...content, ...newContent },
    });
  };

  const updateStat = (index: number, updates: { value?: string; label?: string }) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], ...updates };
    updateContent({ stats: newStats });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Stats</h3>
        {stats.map((stat: any, index: number) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="text-xs font-medium text-gray-600 mb-2">
              Stat {index + 1}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={stat.value || ''}
                onChange={(e) => updateStat(index, { value: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
                placeholder="100+"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={stat.label || ''}
                onChange={(e) => updateStat(index, { label: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
                placeholder="Customers"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Alignment
        </label>
        <select
          value={settings.align || 'center'}
          onChange={(e) => updateSettings({ align: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Column Gap */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Column Gap
        </label>
        <input
          type="number"
          value={settings.columnGap || 24}
          onChange={(e) => updateSettings({ columnGap: parseInt(e.target.value) })}
          min={0}
          max={100}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Value Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Value Size
        </label>
        <input
          type="number"
          value={parseInt(settings.valueSize?.replace('px', '') || '36')}
          onChange={(e) => updateSettings({ valueSize: `${e.target.value}px` })}
          min={20}
          max={72}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Label Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Label Size
        </label>
        <input
          type="number"
          value={parseInt(settings.labelSize?.replace('px', '') || '14')}
          onChange={(e) => updateSettings({ labelSize: `${e.target.value}px` })}
          min={10}
          max={32}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Background Color */}
      <ColorPicker
        label="Background Color"
        value={settings.backgroundColor || '#ffffff'}
        onChange={(color: string) => updateSettings({ backgroundColor: color })}
      />

      {/* Value Color */}
      <ColorPicker
        label="Value Color"
        value={settings.valueColor || '#000000'}
        onChange={(color: string) => updateSettings({ valueColor: color })}
      />

      {/* Label Color */}
      <ColorPicker
        label="Label Color"
        value={settings.labelColor || '#6b7280'}
        onChange={(color: string) => updateSettings({ labelColor: color })}
      />
    </div>
  );
}
