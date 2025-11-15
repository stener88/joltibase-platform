'use client';

import { EmailBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';

interface AddressBlockSettingsProps {
  block: EmailBlock;
  onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
}

export function AddressBlockSettings({ block, onUpdate }: AddressBlockSettingsProps) {
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
      {/* Address Details */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Address Details</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={content.companyName || ''}
            onChange={(e) => updateContent({ companyName: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="{{company_name}}"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            value={content.street || ''}
            onChange={(e) => updateContent({ street: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="{{company_address}}"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={content.city || ''}
            onChange={(e) => updateContent({ city: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="{{company_city}}"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              value={content.state || ''}
              onChange={(e) => updateContent({ state: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
              placeholder="{{company_state}}"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              value={content.zip || ''}
              onChange={(e) => updateContent({ zip: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
              placeholder="{{company_zip}}"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            value={content.country || ''}
            onChange={(e) => updateContent({ country: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
            placeholder="{{company_country}}"
          />
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Options</label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showMapLink"
            checked={settings.showMapLink || false}
            onChange={(e) => updateSettings({ showMapLink: e.target.checked })}
            className="rounded border-gray-300 text-[#e9a589] focus:ring-[#e9a589]"
          />
          <label htmlFor="showMapLink" className="text-sm text-gray-700">
            Show "View in Maps" link
          </label>
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

      {/* Font Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Font Size
        </label>
        <input
          type="number"
          value={parseInt(settings.fontSize?.replace('px', '') || '12')}
          onChange={(e) => updateSettings({ fontSize: `${e.target.value}px` })}
          min={10}
          max={24}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Line Height */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Line Height
        </label>
        <input
          type="number"
          value={parseFloat(settings.lineHeight || '1.6')}
          onChange={(e) => updateSettings({ lineHeight: e.target.value })}
          min={1}
          max={3}
          step={0.1}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Text Color */}
      <ColorPicker
        label="Text Color"
        value={settings.color || '#6b7280'}
        onChange={(color: string) => updateSettings({ color })}
      />
    </div>
  );
}
