'use client';

import { EmailBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';

interface HeroCenterSettingsProps {
  block: EmailBlock;
  onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
}

export function HeroCenterSettings({ block, onUpdate }: HeroCenterSettingsProps) {
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
      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Content</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Headline
          </label>
          <input
            type="text"
            value={content.headline || ''}
            onChange={(e) => updateContent({ headline: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="Enter headline"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Subheadline
          </label>
          <textarea
            value={content.subheadline || ''}
            onChange={(e) => updateContent({ subheadline: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            rows={3}
            placeholder="Enter subheadline"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={content.imageUrl || ''}
            onChange={(e) => updateContent({ imageUrl: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={content.buttonText || ''}
            onChange={(e) => updateContent({ buttonText: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="Call to action"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Button URL
          </label>
          <input
            type="text"
            value={content.buttonUrl || ''}
            onChange={(e) => updateContent({ buttonUrl: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="https://example.com"
          />
        </div>
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

      {/* Image Height */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Image Height
        </label>
        <input
          type="number"
          value={settings.imageHeight || 300}
          onChange={(e) => updateSettings({ imageHeight: parseInt(e.target.value) })}
          min={100}
          max={600}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Headline Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Headline Size
        </label>
        <input
          type="number"
          value={parseInt(settings.headlineSize?.replace('px', '') || '36')}
          onChange={(e) => updateSettings({ headlineSize: `${e.target.value}px` })}
          min={20}
          max={72}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Subheadline Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Subheadline Size
        </label>
        <input
          type="number"
          value={parseInt(settings.subheadlineSize?.replace('px', '') || '16')}
          onChange={(e) => updateSettings({ subheadlineSize: `${e.target.value}px` })}
          min={12}
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

      {/* Text Color */}
      <ColorPicker
        label="Text Color"
        value={settings.textColor || '#000000'}
        onChange={(color: string) => updateSettings({ textColor: color })}
      />

      {/* Button Color */}
      <ColorPicker
        label="Button Color"
        value={settings.buttonColor || '#e9a589'}
        onChange={(color: string) => updateSettings({ buttonColor: color })}
      />
    </div>
  );
}
