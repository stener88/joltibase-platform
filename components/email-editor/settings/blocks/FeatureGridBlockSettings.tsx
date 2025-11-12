'use client';

import { FeatureGridBlock } from '@/lib/email/blocks/types';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';

interface FeatureGridBlockSettingsProps {
  block: FeatureGridBlock;
  onUpdate: (blockId: string, updates: Partial<FeatureGridBlock>) => void;
}

export function FeatureGridBlockSettings({ block, onUpdate }: FeatureGridBlockSettingsProps) {
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, { content: { ...block.content, ...updates } });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, { settings: { ...block.settings, ...updates } });
  };

  const updateFeature = (index: number, field: 'icon' | 'title' | 'description', value: string) => {
    const newFeatures = [...block.content.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateContent({ features: newFeatures });
  };

  const addFeature = () => {
    updateContent({
      features: [...block.content.features, { icon: '✨', title: 'Feature', description: 'Description' }],
    });
  };

  const removeFeature = (index: number) => {
    updateContent({
      features: block.content.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Layout</label>
        <select
          value={block.settings.layout}
          onChange={(e) => updateSettings({ layout: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
        >
          <option value="single-col">Single Column</option>
          <option value="2-col">2 Columns</option>
          <option value="3-col">3 Columns</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Features</label>
        {block.content.features.map((feature, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
            <input
              type="text"
              value={feature.icon || ''}
              onChange={(e) => updateFeature(index, 'icon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
              placeholder="Icon (emoji)"
            />
            <input
              type="text"
              value={feature.title}
              onChange={(e) => updateFeature(index, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
              placeholder="Title"
            />
            <textarea
              value={feature.description}
              onChange={(e) => updateFeature(index, 'description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1aff]/20 focus:border-[#1a1aff]"
              rows={2}
              placeholder="Description"
            />
            <button
              onClick={() => removeFeature(index)}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addFeature}
          className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
        >
          + Add Feature
        </button>
      </div>

      <ColorPicker
        label="Title Color"
        value={block.settings.titleColor}
        onChange={(value) => updateSettings({ titleColor: value })}
      />

      <ColorPicker
        label="Description Color"
        value={block.settings.descriptionColor}
        onChange={(value) => updateSettings({ descriptionColor: value })}
      />

      <PaddingInput
        label="Padding"
        value={block.settings.padding}
        onChange={(value) => updateSettings({ padding: value })}
      />
    </div>
  );
}

