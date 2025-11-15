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
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 pb-12">
          {/* Background Colors */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Background</h4>
            
            <ColorPicker
              label="Email Background"
              value={designConfig.backgroundColor}
              onChange={(value) => onUpdate({ backgroundColor: value })}
            />

            <ColorPicker
              label="Content Background"
              value={designConfig.contentBackgroundColor}
              onChange={(value) => onUpdate({ contentBackgroundColor: value })}
            />
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
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
        </div>
      </div>
    </div>
  );
}

