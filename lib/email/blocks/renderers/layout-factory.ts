/**
 * Layout Factory
 * 
 * Factory pattern that generates renderer functions and React settings components
 * from TypeScript configuration files. Eliminates code duplication across layouts.
 */

import type { LayoutConfig, LayoutRendererFunction, ElementDefinition } from '../configs/types';
import type { RenderContext } from './index';

import {
  renderLayoutHeader,
  renderLayoutTitle,
  renderLayoutDivider,
  renderLayoutParagraph,
  renderLayoutButton,
  wrapLayoutContainer,
} from './layout-helpers';

// ============================================================================
// Config Registry
// ============================================================================

import { heroCenterConfig } from '../configs/hero-center';
import { twoColumn5050Config } from '../configs/two-column-50-50';
import { twoColumn6040Config } from '../configs/two-column-60-40';
import { twoColumn4060Config } from '../configs/two-column-40-60';
import { twoColumn7030Config } from '../configs/two-column-70-30';
import { twoColumn3070Config } from '../configs/two-column-30-70';
import { stats2ColConfig } from '../configs/stats-2-col';
import { stats3ColConfig } from '../configs/stats-3-col';
import { stats4ColConfig } from '../configs/stats-4-col';
import { twoColumnTextConfig } from '../configs/two-column-text';
import { imageOverlayConfig } from '../configs/image-overlay';
import { cardCenteredConfig } from '../configs/card-centered';
import { compactImageTextConfig } from '../configs/compact-image-text';
import { magazineFeatureConfig } from '../configs/magazine-feature';

/**
 * Get layout configuration by variation name
 * 
 * All 14 layouts have configs that generate settings components.
 * Only simple layouts (hero-center) use factory-generated renderers.
 * Complex layouts use hand-written renderers for special positioning/structure.
 */
export function getLayoutConfig(variation: string): LayoutConfig | null {
  const configs: Record<string, LayoutConfig> = {
    // Simple layout - factory renderer ✅
    'hero-center': heroCenterConfig,
    
    // Two-column layouts - hand-written renderers (width calculations)
    'two-column-50-50': twoColumn5050Config,
    'two-column-60-40': twoColumn6040Config,
    'two-column-40-60': twoColumn4060Config,
    'two-column-70-30': twoColumn7030Config,
    'two-column-30-70': twoColumn3070Config,
    
    // Stats layouts - hand-written renderers (items arrays)
    'stats-2-col': stats2ColConfig,
    'stats-3-col': stats3ColConfig,
    'stats-4-col': stats4ColConfig,
    
    // Text layout - hand-written renderer (special columns)
    'two-column-text': twoColumnTextConfig,
    
    // Advanced layouts - hand-written renderers (custom designs)
    'image-overlay': imageOverlayConfig,
    'card-centered': cardCenteredConfig,
    'compact-image-text': compactImageTextConfig,
    'magazine-feature': magazineFeatureConfig,
  };
  
  return configs[variation] || null;
}

// ============================================================================
// Renderer Factory
// ============================================================================

/**
 * Create a renderer function from a layout configuration
 * 
 * Generated renderer will:
 * 1. Check each element's visibility setting
 * 2. Render enabled elements using appropriate helper functions
 * 3. Join elements and wrap in container with padding/backgroundColor
 * 
 * @param config - Layout configuration
 * @returns Renderer function that generates HTML
 */
export function createLayoutRenderer(config: LayoutConfig): LayoutRendererFunction {
  return function generatedRenderer(content: any, settings: any, context: RenderContext): string {
    const elements: string[] = [];
    
    // Render each element in the config
    for (const element of config.elements) {
      // Check visibility
      const visibilityKey = element.visibilityKey;
      const defaultVisible = element.defaultVisible !== false;
      const isVisible = visibilityKey 
        ? settings[visibilityKey] !== false
        : defaultVisible;
      
      if (!isVisible) {
        continue;
      }
      
      // Check if content exists
      const contentValue = content[element.contentKey];
      
      // Special case: divider can be shown with just settings.dividerColor
      if (element.type === 'divider') {
        if (!contentValue && !settings.dividerColor) {
          continue;
        }
      } else {
        // For other elements, skip if no content and not required
        if (!contentValue) {
          continue;
        }
      }
      
      // Render based on element type
      switch (element.type) {
        case 'header':
          elements.push(renderLayoutHeader(contentValue, settings));
          break;
          
        case 'title':
          elements.push(renderLayoutTitle(contentValue, settings));
          break;
          
        case 'divider':
          elements.push(renderLayoutDivider(contentValue, settings));
          break;
          
        case 'paragraph':
          elements.push(renderLayoutParagraph(contentValue, settings));
          break;
          
        case 'button':
          elements.push(renderLayoutButton(contentValue, settings, context));
          break;
          
        // Additional element types can be added here
        default:
          console.warn(`Unknown element type: ${element.type}`);
      }
    }
    
    // If no elements, show placeholder
    if (elements.length === 0) {
      elements.push(`
        <p style="margin: 0; padding: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
          ${config.name}<br/>
          <span style="font-size: 12px; color: #d1d5db;">Add content in settings</span>
        </p>
      `);
    }
    
    // Wrap in container
    return wrapLayoutContainer(
      elements.join('\n'),
      settings.backgroundColor || config.defaults.backgroundColor,
      settings.padding || config.defaults.padding
    );
  };
}

/**
 * Get a renderer function for a specific layout variation
 * 
 * Only returns factory-generated renderers for simple layouts.
 * Complex layouts (two-column, stats, advanced) use hand-written renderers.
 * 
 * @param variation - Layout variation name (e.g., 'hero-center')
 * @returns Renderer function or null if should use hand-written renderer
 */
export function getFactoryRenderer(variation: string): LayoutRendererFunction | null {
  // Only hero-center uses factory-generated renderer
  // All other layouts use hand-written renderers for complex positioning/structure
  if (variation !== 'hero-center') {
    return null;
  }
  
  const config = getLayoutConfig(variation);
  if (!config) {
    return null;
  }
  
  return createLayoutRenderer(config);
}

// ============================================================================
// Settings Component Factory
// ============================================================================

/**
 * Create a React settings component from a layout configuration
 * 
 * This generates a React component dynamically at runtime based on the config.
 * The component will include all necessary controls for the layout.
 * 
 * @param config - Layout configuration
 * @returns React component
 */
export function createLayoutSettingsComponent(config: LayoutConfig) {
  // Import React at the top of the file to avoid hoisting issues
  const React = require('react');
  const { useState } = React;
  const { ColorPicker } = require('@/components/email-editor/shared/ColorPicker');
  const { PaddingInput } = require('@/components/email-editor/shared/PaddingInput');
  const { AlignmentPicker } = require('@/components/email-editor/shared/AlignmentPicker');
  const { CollapsibleSection } = require('@/components/email-editor/shared/CollapsibleSection');
  const { ImageUploadModal } = require('@/components/email-editor/shared/ImageUploadModal');
  const { useBlockContentUpdates, useBlockSettingsUpdates, useCollapsibleSections } = require('@/hooks/use-block-updates');
  
  return function FactoryGeneratedSettings({ block, onUpdate, campaignId }: any) {
    const { isOpen, toggleSection } = useCollapsibleSections(['layout', 'content', 'styling']);
    const updateSettings = useBlockSettingsUpdates(block, onUpdate);
    const updateContent = useBlockContentUpdates(block, onUpdate);
    const [imageModalOpen, setImageModalOpen] = useState(null); // Track which image is being edited (contentKey)
    
    const settings = block.settings || {};
    const content = block.content || {};
    
    return React.createElement('div', { className: 'pb-12' }, 
      // Layout Options Section
      config.settingsControls.toggles && config.settingsControls.toggles.length > 0 &&
      React.createElement(CollapsibleSection, {
        title: 'Layout Options',
        isOpen: isOpen('layout'),
        onToggle: () => toggleSection('layout'),
      },
        // Show/hide toggles
        React.createElement('div', { className: 'space-y-3' },
          React.createElement('div', { className: 'text-xs font-medium text-gray-500 uppercase tracking-wide' }, 
            'Show/Hide Elements'
          ),
          ...config.elements
            .filter((el: any) => el.visibilityKey)
            .map((el: any) => 
              React.createElement('div', { 
                key: el.visibilityKey,
                className: 'flex items-center justify-between' 
              },
                React.createElement('label', { className: 'text-sm text-gray-700' }, el.label),
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings[el.visibilityKey] !== false,
                  onChange: (e: any) => updateSettings({ [el.visibilityKey]: e.target.checked }),
                  className: 'w-4 h-4 text-[#e9a589] border-gray-300 rounded focus:ring-[#e9a589]',
                })
              )
            )
        )
      ),
      
      // Content Section (only show if there are content elements to display)
      config.elements.filter((el: any) => el.type !== 'divider' && el.type !== 'items' && el.type !== 'image').length > 0 &&
      React.createElement(CollapsibleSection, {
        title: 'Content',
        isOpen: isOpen('content'),
        onToggle: () => toggleSection('content'),
      },
        React.createElement('div', { className: 'space-y-4' },
          ...config.elements
            .filter((el: any) => el.type !== 'divider' && el.type !== 'items' && el.type !== 'image')
            .map((el: any) => {
              // Button element with optional URL
              if (el.type === 'button') {
                return React.createElement('div', { key: el.contentKey, className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, el.label),
                  React.createElement('input', {
                    type: 'text',
                    value: (content[el.contentKey]?.text || content[el.contentKey] || ''),
                    onChange: (e: any) => updateContent({ 
                      [el.contentKey]: { 
                        ...(typeof content[el.contentKey] === 'object' ? content[el.contentKey] : {}),
                        text: e.target.value 
                      }
                    }),
                    placeholder: `Enter ${el.label.toLowerCase()}`,
                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                  }),
                  el.options?.includeUrl &&
                  React.createElement('input', {
                    type: 'url',
                    value: (content[el.contentKey]?.url || ''),
                    onChange: (e: any) => updateContent({ 
                      [el.contentKey]: { 
                        ...(typeof content[el.contentKey] === 'object' ? content[el.contentKey] : { text: content[el.contentKey] }),
                        url: e.target.value 
                      }
                    }),
                    placeholder: 'Enter URL',
                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                  })
                );
              }
              
              // Badge element - simple text input
              if (el.type === 'badge') {
                return React.createElement('div', { key: el.contentKey, className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, el.label),
                  React.createElement('input', {
                    type: 'text',
                    value: content[el.contentKey] || '',
                    onChange: (e: any) => updateContent({ [el.contentKey]: e.target.value }),
                    placeholder: `Enter ${el.label.toLowerCase()}`,
                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                  })
                );
              }
              
              // Subtitle element - simple text input
              if (el.type === 'subtitle') {
                return React.createElement('div', { key: el.contentKey, className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, el.label),
                  React.createElement('input', {
                    type: 'text',
                    value: content[el.contentKey] || '',
                    onChange: (e: any) => updateContent({ [el.contentKey]: e.target.value }),
                    placeholder: `Enter ${el.label.toLowerCase()}`,
                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                  })
                );
              }
              
              // Text-area element - multi-line textarea
              if (el.type === 'text-area') {
                return React.createElement('div', { key: el.contentKey, className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, el.label),
                  React.createElement('textarea', {
                    value: content[el.contentKey] || '',
                    onChange: (e: any) => updateContent({ [el.contentKey]: e.target.value }),
                    rows: el.options?.rows || 4,
                    placeholder: `Enter ${el.label.toLowerCase()}`,
                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                  })
                );
              }
              
              // Default: simple text input (for header, title, paragraph)
              return React.createElement('div', { key: el.contentKey, className: 'space-y-2' },
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, el.label),
                React.createElement('input', {
                  type: 'text',
                  value: content[el.contentKey] || '',
                  onChange: (e: any) => updateContent({ [el.contentKey]: e.target.value }),
                  placeholder: `Enter ${el.label.toLowerCase()}`,
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                })
              );
            })
        )
      ),
      
      // Image Elements Section (separate from regular content)
      config.elements.filter((el: any) => el.type === 'image').length > 0 &&
      React.createElement(CollapsibleSection, {
        title: 'Images',
        isOpen: isOpen('images'),
        onToggle: () => toggleSection('images'),
      },
        React.createElement('div', { className: 'space-y-4' },
          ...config.elements
            .filter((el: any) => el.type === 'image')
            .map((el: any) => {
              const imageContent = content[el.contentKey] || {};
              const imageUrl = imageContent.url || '';
              
              return React.createElement('div', { key: el.contentKey, className: 'space-y-3' },
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, el.label),
                
                // Image preview (if exists)
                imageUrl && React.createElement('div', { className: 'relative w-full h-40 bg-gray-100 rounded-md overflow-hidden border border-gray-300' },
                  React.createElement('img', {
                    src: imageUrl,
                    alt: el.label,
                    className: 'w-full h-full object-cover',
                  }),
                  React.createElement('button', {
                    onClick: () => updateContent({
                      [el.contentKey]: { ...imageContent, url: '' }
                    }),
                    className: 'absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600',
                  }, 'Remove')
                ),
                
                // URL input
                React.createElement('input', {
                  type: 'url',
                  value: imageUrl,
                  onChange: (e: any) => updateContent({
                    [el.contentKey]: { ...imageContent, url: e.target.value }
                  }),
                  placeholder: 'Enter image URL or click upload',
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                }),
                
                // Upload button
                React.createElement('button', {
                  onClick: () => setImageModalOpen(el.contentKey),
                  className: 'w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e9a589]',
                }, 'Upload Image'),
                
                // Optional clickable URL (if includeUrl is true)
                el.options?.includeUrl && React.createElement('div', { className: 'space-y-2' },
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Link URL (optional)'),
                  React.createElement('input', {
                    type: 'url',
                    value: imageContent.clickUrl || '',
                    onChange: (e: any) => updateContent({
                      [el.contentKey]: { ...imageContent, clickUrl: e.target.value }
                    }),
                    placeholder: 'Enter link URL',
                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                  })
                )
              );
            })
        )
      ),
      
      // Styling Section
      (config.settingsControls.colors || config.settingsControls.spacing || config.settingsControls.alignment) &&
      React.createElement(CollapsibleSection, {
        title: 'Styling',
        isOpen: isOpen('styling'),
        onToggle: () => toggleSection('styling'),
      },
        React.createElement('div', { className: 'space-y-4' },
          // Color pickers
          config.settingsControls.colors && config.settingsControls.colors.map((colorDef: any) =>
            React.createElement('div', { key: colorDef.key, className: 'space-y-2' },
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, colorDef.label),
              React.createElement(ColorPicker, {
                value: settings[colorDef.key] || colorDef.defaultValue || '#ffffff',
                onChange: (value: string) => updateSettings({ [colorDef.key]: value }),
              })
            )
          ),
          
          // Spacing controls
          config.settingsControls.spacing &&
          React.createElement('div', { className: 'space-y-2' },
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Padding'),
            React.createElement(PaddingInput, {
              value: settings.padding || config.defaults.padding,
              onChange: (value: any) => updateSettings({ padding: value }),
            })
          ),
          
          // Alignment picker
          config.settingsControls.alignment &&
          React.createElement('div', { className: 'space-y-2' },
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Text Alignment'),
            React.createElement(AlignmentPicker, {
              value: settings.align || config.defaults.align || 'center',
              onChange: (value: string) => updateSettings({ align: value }),
            })
          ),
          
          // Custom controls
          config.settingsControls.custom && config.settingsControls.custom.map((control: any) => {
            if (control.type === 'select') {
              return React.createElement('div', { key: control.key, className: 'space-y-2' },
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, control.label),
                React.createElement('select', {
                  value: settings[control.key] || control.defaultValue || '',
                  onChange: (e: any) => updateSettings({ [control.key]: e.target.value }),
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                },
                  control.options?.map((opt: string) => 
                    React.createElement('option', { key: opt, value: opt }, opt)
                  )
                )
              );
            }
            
            if (control.type === 'number') {
              return React.createElement('div', { key: control.key, className: 'space-y-2' },
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, control.label),
                React.createElement('input', {
                  type: 'number',
                  value: settings[control.key] || control.defaultValue || '',
                  onChange: (e: any) => updateSettings({ [control.key]: parseInt(e.target.value, 10) }),
                  placeholder: control.placeholder || '',
                  min: control.min,
                  max: control.max,
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                })
              );
            }
            
            if (control.type === 'checkbox') {
              return React.createElement('div', { key: control.key, className: 'flex items-center justify-between' },
                React.createElement('label', { className: 'text-sm text-gray-700' }, control.label),
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings[control.key] !== undefined ? settings[control.key] : control.defaultValue || false,
                  onChange: (e: any) => updateSettings({ [control.key]: e.target.checked }),
                  className: 'w-4 h-4 text-[#e9a589] border-gray-300 rounded focus:ring-[#e9a589]',
                })
              );
            }
            
            return null;
          })
        )
      ),
      
      // Items Array Section (for stats layouts)
      config.elements.filter((el: any) => el.type === 'items').length > 0 &&
      React.createElement(CollapsibleSection, {
        title: 'Stats Items',
        isOpen: isOpen('items'),
        onToggle: () => toggleSection('items'),
      },
        React.createElement('div', { className: 'space-y-4' },
          ...config.elements
            .filter((el: any) => el.type === 'items')
            .map((el: any) => {
              const items = content[el.contentKey] || [];
              
              return React.createElement('div', { key: el.contentKey, className: 'space-y-3' },
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, el.label),
                
                // Render each item with all fields from config
                ...items.map((item: any, idx: number) =>
                  React.createElement('div', {
                    key: idx,
                    className: 'border border-gray-300 rounded-md p-3 space-y-2 bg-gray-50'
                  },
                    React.createElement('div', { className: 'flex justify-between items-center mb-2' },
                      React.createElement('span', { className: 'text-sm font-medium text-gray-700' }, `Item ${idx + 1}`),
                      React.createElement('button', {
                        onClick: () => {
                          const updated = items.filter((_: any, i: number) => i !== idx);
                          updateContent({ [el.contentKey]: updated });
                        },
                        className: 'text-red-500 text-sm hover:text-red-700',
                      }, 'Remove')
                    ),
                    // Dynamically render all fields from itemFields config
                    ...el.options.itemFields.map((field: any) =>
                      React.createElement(field.type === 'textarea' ? 'textarea' : 'input', {
                        key: field.key,
                        type: field.type === 'textarea' ? undefined : 'text',
                        value: item[field.key] || '',
                        onChange: (e: any) => {
                          const updated = [...items];
                          updated[idx] = { ...item, [field.key]: e.target.value };
                          updateContent({ [el.contentKey]: updated });
                        },
                        placeholder: field.label,
                        rows: field.type === 'textarea' ? 2 : undefined,
                        className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#e9a589] focus:border-[#e9a589]',
                      })
                    )
                  )
                ),
                
                // Add button - create new item with all fields initialized
                React.createElement('button', {
                  onClick: () => {
                    const newItem: any = {};
                    el.options.itemFields.forEach((field: any) => {
                      newItem[field.key] = '';
                    });
                    updateContent({
                      [el.contentKey]: [...items, newItem]
                    });
                  },
                  className: 'w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:border-[#e9a589] hover:text-[#e9a589] focus:outline-none',
                }, '+ Add Item')
              );
            })
        )
      ),
      
      // Image Upload Modals
      imageModalOpen && React.createElement(ImageUploadModal, {
        isOpen: true,
        onClose: () => setImageModalOpen(null),
        onUpload: (url: string) => {
          const imageContent = content[imageModalOpen] || {};
          updateContent({
            [imageModalOpen]: { ...imageContent, url }
          });
          setImageModalOpen(null);
        },
        campaignId: campaignId,
      })
    );
  };
}

