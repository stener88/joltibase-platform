/**
 * Global Settings Toolbar
 * 
 * Toolbar for editing global email settings (background color, max width, font family).
 * Appears when clicking email background in visual edits mode.
 */

'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import type { GlobalEmailSettings } from '@/lib/email/blocks/types';

interface GlobalSettingsToolbarProps {
  position: { x: number; y: number };
  currentSettings: GlobalEmailSettings;
  onUpdate: (settings: Partial<GlobalEmailSettings>) => void;
}

export function GlobalSettingsToolbar({
  position,
  currentSettings,
  onUpdate,
}: GlobalSettingsToolbarProps) {
  const [bgColor, setBgColor] = useState(currentSettings.backgroundColor);
  const [maxWidth, setMaxWidth] = useState(currentSettings.maxWidth);
  const [fontFamily, setFontFamily] = useState(currentSettings.fontFamily);

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
    onUpdate({ backgroundColor: color });
  };

  const handleMaxWidthChange = (width: number) => {
    setMaxWidth(width);
    onUpdate({ maxWidth: width });
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    onUpdate({ fontFamily: family });
  };

  return (
    <div
      className="fixed bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-700 z-[100] p-3"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-600">
        <Settings className="w-4 h-4 text-gray-300" />
        <span className="text-sm font-medium text-white">Global Settings</span>
      </div>

      {/* Settings Controls */}
      <div className="space-y-3 min-w-[280px]">
        {/* Background Color */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-600"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="flex-1 bg-[#3d3d3d] text-white text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-[#e9a589]"
              placeholder="#f3f4f6"
            />
          </div>
        </div>

        {/* Max Width */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Max Width (px)</label>
          <input
            type="number"
            value={maxWidth}
            onChange={(e) => handleMaxWidthChange(parseInt(e.target.value) || 600)}
            min={400}
            max={800}
            className="w-full bg-[#3d3d3d] text-white text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-[#e9a589]"
          />
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="w-full bg-[#3d3d3d] text-white text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-[#e9a589] cursor-pointer"
          >
            <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">System (Default)</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', Times, serif">Times New Roman</option>
            <option value="'Courier New', Courier, monospace">Courier New</option>
          </select>
        </div>
      </div>
    </div>
  );
}

