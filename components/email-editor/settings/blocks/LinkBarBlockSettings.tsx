'use client';

import { EmailBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { 
  useBlockContentUpdates, 
  useBlockSettingsUpdates 
} from '@/hooks/use-block-updates';

interface LinkBarBlockSettingsProps {
  block: EmailBlock;
  onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
}

export function LinkBarBlockSettings({ block, onUpdate }: LinkBarBlockSettingsProps) {
  const updateSettings = useBlockSettingsUpdates(block, onUpdate);
  const updateContent = useBlockContentUpdates(block, onUpdate);

  const settings = block.settings || {};
  const content = block.content || { links: [] };
  const links = content.links || [];

  const addLink = () => {
    updateContent({
      links: [...links, { label: 'New Link', url: '#' }],
    });
  };

  const updateLink = (index: number, updates: { label?: string; url?: string }) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], ...updates };
    updateContent({ links: newLinks });
  };

  const removeLink = (index: number) => {
    updateContent({
      links: links.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Links */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Links
        </label>
        <div className="space-y-3">
          {links.map((link: any, index: number) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Link {index + 1}
                </span>
                <button
                  onClick={() => removeLink(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Remove link"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => updateLink(index, { label: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={link.url || ''}
                  onChange={(e) => updateLink(index, { url: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e9a589]"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          ))}
          <Button
            onClick={addLink}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Layout
        </label>
        <select
          value={settings.layout || 'horizontal'}
          onChange={(e) => updateSettings({ layout: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
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

      {/* Spacing */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Spacing
        </label>
        <input
          type="number"
          value={settings.spacing || 24}
          onChange={(e) => updateSettings({ spacing: parseInt(e.target.value) })}
          min={0}
          max={100}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Font Size
        </label>
        <input
          type="number"
          value={parseInt(settings.fontSize?.replace('px', '') || '14')}
          onChange={(e) => updateSettings({ fontSize: `${e.target.value}px` })}
          min={10}
          max={32}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Font Weight */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Font Weight
        </label>
        <input
          type="number"
          value={settings.fontWeight || 500}
          onChange={(e) => updateSettings({ fontWeight: parseInt(e.target.value) })}
          min={100}
          max={900}
          step={100}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
        />
      </div>

      {/* Link Color */}
      <ColorPicker
        label="Link Color"
        value={settings.color || '#2563eb'}
        onChange={(color: string) => updateSettings({ color })}
      />
    </div>
  );
}
