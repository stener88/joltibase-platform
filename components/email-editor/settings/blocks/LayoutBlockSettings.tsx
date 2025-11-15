'use client';

import { useState } from 'react';
import type { EmailBlock, LayoutVariation } from '@/lib/email/blocks/types';
import { getLayoutVariationDisplayName } from '@/lib/email/blocks/types';
import { LAYOUT_VARIATION_DEFINITIONS, getLayoutVariationsByCategory } from '@/lib/email/blocks/registry';
import { ColorPicker } from '../../shared/ColorPicker';
import { PaddingInput } from '../../shared/PaddingInput';
import { AlignmentPicker } from '../../shared/AlignmentPicker';
import { ImageUploadModal } from '../../shared/ImageUploadModal';
import { CollapsibleSection } from '../../shared/CollapsibleSection';

interface LayoutBlockSettingsProps {
  block: EmailBlock & { layoutVariation?: string };
  onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
  campaignId?: string;
}

export function LayoutBlockSettings({ block, onUpdate, campaignId }: LayoutBlockSettingsProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['layout']));
  
  const variation = block.layoutVariation || 'unknown';
  const settings = block.settings || {};
  const content = block.content || {};
  
  // Determine which elements this variation supports
  const supportsHeader = hasElement(variation, 'header');
  const supportsTitle = hasElement(variation, 'title');
  const supportsSubtitle = hasElement(variation, 'subtitle');
  const supportsBadge = hasElement(variation, 'badge');
  const supportsDivider = hasElement(variation, 'divider');
  const supportsParagraph = hasElement(variation, 'paragraph');
  const supportsButton = hasElement(variation, 'button');
  const supportsImage = hasElement(variation, 'image');
  const supportsFlip = canFlip(variation);
  const supportsItems = hasItems(variation);
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };
  
  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate(block.id, {
      settings: { ...block.settings, ...updates },
    });
  };
  
  const updateContent = (updates: Partial<typeof block.content>) => {
    onUpdate(block.id, {
      content: { ...block.content, ...updates },
    });
  };
  
  const handleImageUpload = (url: string) => {
    updateContent({ 
      image: { 
        ...(content.image || {}), 
        url 
      } 
    });
  };
  
  const handleImageDelete = () => {
    updateContent({ 
      image: { 
        ...(content.image || {}), 
        url: '' 
      } 
    });
  };
  
  return (
    <>
      <div className="pb-12">
        {/* Collapsible Sections */}
        
        {/* Layout Options Section */}
        {(supportsFlip || supportsHeader || supportsTitle || supportsDivider || supportsParagraph || supportsButton) && (
          <CollapsibleSection 
            title="Layout Options" 
            isOpen={openSections.has('layout')}
            onToggle={() => toggleSection('layout')}
          >
            {/* Flip Toggle */}
            {supportsFlip && (
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Flip Layout</label>
                <input 
                  type="checkbox" 
                  checked={settings.flip || false} 
                  onChange={(e) => updateSettings({ flip: e.target.checked })}
                  className="w-4 h-4 text-[#e9a589] border-gray-300 rounded focus:ring-[#e9a589]"
                />
              </div>
            )}
            
            {/* Show/Hide Toggles */}
            {(supportsHeader || supportsTitle || supportsDivider || supportsParagraph || supportsButton) && (
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Show/Hide Elements</div>
                {supportsHeader && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Header</label>
                    <input 
                      type="checkbox" 
                      checked={settings.showHeader !== false} 
                      onChange={(e) => updateSettings({ showHeader: e.target.checked })}
                      className="w-4 h-4 text-[#e9a589] border-gray-300 rounded focus:ring-[#e9a589]"
                    />
                  </div>
                )}
                {supportsTitle && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Title</label>
                    <input 
                      type="checkbox" 
                      checked={settings.showTitle !== false} 
                      onChange={(e) => updateSettings({ showTitle: e.target.checked })}
                      className="w-4 h-4 text-[#e9a589] border-gray-300 rounded focus:ring-[#e9a589]"
                    />
                  </div>
                )}
                {supportsDivider && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Divider</label>
                    <input 
                      type="checkbox" 
                      checked={settings.showDivider || false} 
                      onChange={(e) => updateSettings({ showDivider: e.target.checked })}
                      className="w-4 h-4 text-[#e9a589] border-gray-300 rounded focus:ring-[#e9a589]"
                    />
                  </div>
                )}
                {supportsParagraph && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Paragraph</label>
                    <input 
                      type="checkbox" 
                      checked={settings.showParagraph !== false} 
                      onChange={(e) => updateSettings({ showParagraph: e.target.checked })}
                      className="w-4 h-4 text-[#e9a589] border-gray-300 rounded focus:ring-[#e9a589]"
                    />
                  </div>
                )}
                {supportsButton && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Button</label>
                    <input 
                      type="checkbox" 
                      checked={settings.showButton !== false} 
                      onChange={(e) => updateSettings({ showButton: e.target.checked })}
                      className="w-4 h-4 text-[#e9a589] border-gray-300 rounded focus:ring-[#e9a589]"
                    />
                  </div>
                )}
              </div>
            )}
          </CollapsibleSection>
        )}
        
        {/* Content Section */}
        <CollapsibleSection 
          title="Content" 
          isOpen={openSections.has('content')}
          onToggle={() => toggleSection('content')}
        >
          {supportsHeader && settings.showHeader !== false && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Header Text</label>
              <input 
                type="text" 
                value={getTextValue(content.header)}
                onChange={(e) => updateContent({ header: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
              />
            </div>
          )}
          
          {supportsTitle && settings.showTitle !== false && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={getTextValue(content.title)}
                onChange={(e) => updateContent({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
              />
            </div>
          )}
          
          {supportsSubtitle && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input 
                type="text" 
                value={getTextValue(content.subtitle)}
                onChange={(e) => updateContent({ subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
              />
            </div>
          )}
          
          {supportsBadge && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge / Number</label>
              <input 
                type="text" 
                value={getTextValue(content.badge)}
                onChange={(e) => updateContent({ badge: e.target.value })}
                placeholder="003"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
              />
            </div>
          )}
          
          {supportsParagraph && settings.showParagraph !== false && variation !== 'two-column-text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph</label>
              <textarea 
                value={getTextValue(content.paragraph)} 
                rows={4}
                onChange={(e) => updateContent({ paragraph: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
              />
            </div>
          )}
          
          {/* Special handling for two-column-text layout */}
          {variation === 'two-column-text' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Left Column</label>
                <textarea 
                  value={content.leftColumn || ''}
                  rows={4}
                  onChange={(e) => updateContent({ leftColumn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Right Column</label>
                <textarea 
                  value={content.rightColumn || ''}
                  rows={4}
                  onChange={(e) => updateContent({ rightColumn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
                />
              </div>
            </>
          )}
          
          {supportsButton && settings.showButton !== false && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input 
                  type="text" 
                  value={content.button?.text || ''}
                  onChange={(e) => updateContent({ 
                    button: { ...(content.button || { url: '#' }), text: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                <input 
                  type="text" 
                  value={content.button?.url || ''}
                  onChange={(e) => updateContent({ 
                    button: { ...(content.button || { text: 'Click Here' }), url: e.target.value }
                  })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
                />
              </div>
            </div>
          )}
          
          {supportsImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-[#e9a589] rounded-lg hover:bg-[#d89478] transition-colors"
              >
                {content.image?.url ? 'Change Image' : 'Upload Image'}
              </button>
              {content.image?.url && (
                <p className="text-xs text-gray-500 mt-1">Image uploaded</p>
              )}
            </div>
          )}
          
          {supportsItems && (
            <ItemsEditor 
              items={content.items || []} 
              updateContent={updateContent}
              variation={variation}
            />
          )}
        </CollapsibleSection>
        
        {/* Styling Section */}
        <CollapsibleSection 
          title="Styling" 
          isOpen={openSections.has('styling')}
          onToggle={() => toggleSection('styling')}
        >
          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Layout</h5>
              <ColorPicker 
                label="Background Color" 
                value={settings.backgroundColor || 'transparent'}
                onChange={(color) => updateSettings({ backgroundColor: color })}
              />
              <div className="mt-4">
                <PaddingInput 
                  value={settings.padding || { top: 40, right: 20, bottom: 40, left: 20}} 
                  onChange={(padding) => updateSettings({ padding })}
                />
              </div>
              <div className="mt-4">
                <AlignmentPicker 
                  value={settings.align || 'center'}
                  onChange={(align) => updateSettings({ align })}
                />
              </div>
            </div>
            
            {supportsButton && settings.showButton !== false && (
              <div className="pt-4 border-t border-gray-200">
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Button</h5>
                <ColorPicker 
                  label="Button Background" 
                  value={settings.buttonBackgroundColor || '#7c3aed'}
                  onChange={(color) => updateSettings({ buttonBackgroundColor: color })}
                />
                <div className="mt-4">
                  <ColorPicker 
                    label="Button Text Color" 
                    value={settings.buttonTextColor || '#ffffff'}
                    onChange={(color) => updateSettings({ buttonTextColor: color })}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Border Radius
                  </label>
                  <input
                    type="text"
                    value={settings.buttonBorderRadius || '8px'}
                    onChange={(e) => updateSettings({ buttonBorderRadius: e.target.value })}
                    placeholder="8px"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589]/20 focus:border-[#e9a589]"
                  />
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>
      </div>
      
      {/* Image Upload Modal */}
      {supportsImage && (
        <ImageUploadModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          onUpload={handleImageUpload}
          onDelete={handleImageDelete}
          currentImageUrl={content.image?.url || ''}
          campaignId={campaignId}
          type="image"
        />
      )}
    </>
  );
}

// Helper function: Items Editor for stats/features
function ItemsEditor({ 
  items, 
  updateContent, 
  variation 
}: { 
  items: any[]; 
  updateContent: (updates: any) => void;
  variation: string;
}) {
  const addItem = () => {
    const newItem = { value: '100', title: 'New Item', description: 'Description' };
    updateContent({ items: [...items, newItem] });
  };
  
  const updateItem = (index: number, updates: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    updateContent({ items: newItems });
  };
  
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateContent({ items: newItems });
  };
  
  const maxItems = variation === 'stats-2-col' ? 2 :
                   variation === 'stats-3-col' ? 3 : 4;
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Items</label>
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">Item {index + 1}</span>
            <button
              onClick={() => removeItem(index)}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            placeholder="Value (e.g., 10K+)"
            value={item.value || ''}
            onChange={(e) => updateItem(index, { value: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#e9a589]"
          />
          <input
            type="text"
            placeholder="Title (e.g., Users)"
            value={item.title || ''}
            onChange={(e) => updateItem(index, { title: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#e9a589]"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={item.description || ''}
            onChange={(e) => updateItem(index, { description: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#e9a589]"
          />
        </div>
      ))}
      {items.length < maxItems && (
        <button
          onClick={addItem}
          className="w-full px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#e9a589] hover:text-[#e9a589] transition-colors"
        >
          + Add Item
        </button>
      )}
    </div>
  );
}

// Helper functions
function hasElement(variation: string, element: string): boolean {
  const elementMap: Record<string, string[]> = {
    'hero-center': ['header', 'title', 'divider', 'paragraph', 'button'],
    'hero-image-overlay': ['header', 'title', 'paragraph', 'button', 'image'],
    'two-column-50-50': ['title', 'paragraph', 'button', 'image'],
    'two-column-60-40': ['title', 'paragraph', 'button', 'image'],
    'two-column-40-60': ['title', 'paragraph', 'button', 'image'],
    'stats-2-col': ['items'],
    'stats-3-col': ['items'],
    'stats-4-col': ['items'],
    // New layout variations
    'image-overlay': ['badge', 'title', 'paragraph', 'button', 'image'],
    'card-centered': ['title', 'subtitle', 'divider', 'paragraph', 'button'],
    'compact-image-text': ['title', 'subtitle', 'image'],
    'two-column-text': ['paragraph'], // Uses leftColumn and rightColumn, but shows as paragraph inputs
    'magazine-feature': ['title', 'badge', 'paragraph', 'image'],
  };
  return elementMap[variation]?.includes(element) || false;
}

function canFlip(variation: string): boolean {
  return variation.includes('two-column') || variation.includes('zigzag') || variation === 'image-overlay';
}

function hasItems(variation: string): boolean {
  return variation.includes('stats') || variation.includes('feature-grid');
}

function getTextValue(value: any): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && value.text) return value.text;
  return '';
}

