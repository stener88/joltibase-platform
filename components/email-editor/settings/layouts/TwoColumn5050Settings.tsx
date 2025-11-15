'use client';

import { EmailBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';

interface TwoColumn5050SettingsProps {
  block: EmailBlock;
  onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
}

export function TwoColumn5050Settings({ block, onUpdate }: TwoColumn5050SettingsProps) {
  const settings = block.settings || {};
  const content = block.content || {};

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

  return (
    <div className="p-6 space-y-6">
      {/* Left Column */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Left Column</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Heading
          </label>
          <input
            type="text"
            value={content.leftHeading || ''}
            onChange={(e) => updateContent({ leftHeading: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="Left column heading"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text
          </label>
          <textarea
            value={content.leftText || ''}
            onChange={(e) => updateContent({ leftText: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            rows={3}
            placeholder="Left column content"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={content.leftImageUrl || ''}
            onChange={(e) => updateContent({ leftImageUrl: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Right Column</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Heading
          </label>
          <input
            type="text"
            value={content.rightHeading || ''}
            onChange={(e) => updateContent({ rightHeading: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="Right column heading"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text
          </label>
          <textarea
            value={content.rightText || ''}
            onChange={(e) => updateContent({ rightText: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            rows={3}
            placeholder="Right column content"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={content.rightImageUrl || ''}
            onChange={(e) => updateContent({ rightImageUrl: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      {/* Column Split */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Column Split
        </label>
        <select
          value={settings.layout || '50-50'}
          onChange={(e) => updateSettings({ layout: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="50-50">50/50</option>
          <option value="60-40">60/40</option>
          <option value="40-60">40/60</option>
          <option value="70-30">70/30</option>
          <option value="30-70">30/70</option>
        </select>
      </div>

      {/* Vertical Alignment */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Vertical Alignment
        </label>
        <select
          value={settings.verticalAlign || 'top'}
          onChange={(e) => updateSettings({ verticalAlign: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="top">Top</option>
          <option value="middle">Middle</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>

      {/* Column Gap */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Column Gap
        </label>
        <input
          type="number"
          value={settings.columnGap || 16}
          onChange={(e) => updateSettings({ columnGap: parseInt(e.target.value) })}
          min={0}
          max={100}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Background Color */}
      <ColorPicker
        label="Background Color"
        value={settings.backgroundColor || '#ffffff'}
        onChange={(color: string) => updateSettings({ backgroundColor: color })}
      />

      {/* Left Column Background */}
      <ColorPicker
        label="Left Column Background"
        value={settings.leftColumnBackgroundColor || 'transparent'}
        onChange={(color: string) => updateSettings({ leftColumnBackgroundColor: color })}
      />

      {/* Right Column Background */}
      <ColorPicker
        label="Right Column Background"
        value={settings.rightColumnBackgroundColor || 'transparent'}
        onChange={(color: string) => updateSettings({ rightColumnBackgroundColor: color })}
      />
    </div>
  );
}
