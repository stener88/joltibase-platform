'use client';

import { GlobalEmailSettings } from '@/lib/email/blocks/types';
import { ColorPicker } from '../shared/ColorPicker';

interface GlobalSettingsPanelProps {
  designConfig: GlobalEmailSettings;
  onUpdate: (updates: Partial<GlobalEmailSettings>) => void;
}

export function GlobalSettingsPanel({
  designConfig,
  onUpdate,
}: GlobalSettingsPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Global Settings</h3>
        <p className="text-xs text-gray-500 mt-1">
          These settings apply to the entire email
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Background Colors */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Background</h4>
          
          <ColorPicker
            label="Backdrop Color"
            value={designConfig.backgroundColor}
            onChange={(value) => onUpdate({ backgroundColor: value })}
          />

          <ColorPicker
            label="Canvas Color"
            value={designConfig.contentBackgroundColor}
            onChange={(value) => onUpdate({ contentBackgroundColor: value })}
          />
        </div>

        {/* Email Width */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Max Width (px)
          </label>
          <input
            type="number"
            value={designConfig.maxWidth}
            onChange={(e) =>
              onUpdate({ maxWidth: parseInt(e.target.value) || 600 })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
            min="320"
            max="800"
          />
          <p className="text-xs text-gray-500">
            Recommended: 600px for optimal email client compatibility
          </p>
        </div>

        {/* Typography */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Typography</h4>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Font Family
            </label>
            <select
              value={designConfig.fontFamily}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
            >
              <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
                System Default
              </option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Helvetica Neue', Helvetica, sans-serif">
                Helvetica
              </option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', Times, serif">Times New Roman</option>
              <option value="'Courier New', Courier, monospace">Courier</option>
            </select>
          </div>
        </div>

        {/* Mobile Breakpoint */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Mobile Breakpoint (px)
          </label>
          <input
            type="number"
            value={designConfig.mobileBreakpoint}
            onChange={(e) =>
              onUpdate({ mobileBreakpoint: parseInt(e.target.value) || 480 })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
            min="320"
            max="768"
          />
          <p className="text-xs text-gray-500">
            Width at which mobile styles are applied
          </p>
        </div>
      </div>
    </div>
  );
}

