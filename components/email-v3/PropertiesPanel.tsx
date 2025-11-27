'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import type { ComponentMap } from '@/lib/email-v3/tsx-parser';

interface PropertiesPanelProps {
  tsxCode: string;
  selectedComponentId: string | null;
  componentMap: ComponentMap;
  onDirectUpdate: (componentId: string, property: string, value: string) => void;
}

interface ComponentProperties {
  type: string;
  // Text components
  text?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  // Layout components
  backgroundColor?: string;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  // Button components
  href?: string;
  // Capabilities flags
  canEditText: boolean;
  canEditTextColor: boolean;
  canEditBackgroundColor: boolean;
  canEditSpacing: boolean;
}

export function PropertiesPanel({
  tsxCode,
  selectedComponentId,
  componentMap,
  onDirectUpdate,
}: PropertiesPanelProps) {
  // Extract properties from selected component
  const componentProperties = useMemo<ComponentProperties | null>(() => {
    if (!selectedComponentId) {
      console.log('[PROPERTIES-PANEL] No component selected');
      return null;
    }

    console.log('[PROPERTIES-PANEL] Component selected:', selectedComponentId);
    console.log('[PROPERTIES-PANEL] Component map:', componentMap);

    // Get component info from map
    const componentInfo = componentMap[selectedComponentId];
    if (!componentInfo) {
      console.warn('[PROPERTIES-PANEL] Component not found in map:', selectedComponentId);
      return {
        type: 'Unknown',
        text: '',
        textColor: '#000000',
        backgroundColor: 'transparent',
        marginTop: '0',
        marginBottom: '0',
        paddingTop: '0',
        paddingBottom: '0',
      };
    }

    console.log('[PROPERTIES-PANEL] Component info:', componentInfo);

    // Extract the component code from TSX
    const componentCode = tsxCode.substring(componentInfo.startChar, componentInfo.endChar);
    console.log('[PROPERTIES-PANEL] Component code:', componentCode);

    // Determine component capabilities based on type
    const componentType = componentInfo.type;
    const isTextComponent = ['Text', 'Heading', 'Button', 'Link'].includes(componentType);
    const isLayoutComponent = ['Section', 'Container', 'Column', 'Row'].includes(componentType);
    
    // Extract text content (only for text components)
    // Check if text is a JSX expression (dynamic content like {variable})
    const textMatch = componentCode.match(/>([^<]+)</);
    let text = textMatch ? textMatch[1].trim() : '';
    
    // If text contains JSX expression, mark as dynamic (non-editable for now)
    const isDynamicText = text.includes('{') && text.includes('}');
    if (isDynamicText) {
      text = ''; // Don't show dynamic variables in edit box
    }

    // Extract style properties (basic regex parsing)
    const extractStyleValue = (prop: string): string => {
      const regex = new RegExp(`${prop}:\\s*['"]([^'"]+)['"]`);
      const match = componentCode.match(regex);
      return match ? match[1] : '';
    };

    // Extract href for links/buttons
    const hrefMatch = componentCode.match(/href=["']([^"']+)["']/);
    const href = hrefMatch ? hrefMatch[1] : '';

    return {
      type: componentType,
      // Text properties (only for text components)
      text: isTextComponent ? text : undefined,
      textColor: isTextComponent ? (extractStyleValue('color') || '#000000') : undefined,
      fontSize: isTextComponent ? extractStyleValue('fontSize') : undefined,
      fontWeight: isTextComponent ? extractStyleValue('fontWeight') : undefined,
      // Layout properties
      backgroundColor: extractStyleValue('backgroundColor') || 'transparent',
      marginTop: extractStyleValue('marginTop')?.replace('px', '') || '0',
      marginBottom: extractStyleValue('marginBottom')?.replace('px', '') || '0',
      paddingTop: extractStyleValue('paddingTop')?.replace('px', '') || '0',
      paddingBottom: extractStyleValue('paddingBottom')?.replace('px', '') || '0',
      // Link properties
      href: href || undefined,
      // Capabilities
      canEditText: isTextComponent && !isDynamicText, // Can't edit dynamic text
      canEditTextColor: isTextComponent,
      canEditBackgroundColor: true, // Most components can have background
      canEditSpacing: true, // All components can have spacing
    };
  }, [selectedComponentId, componentMap, tsxCode]);

  // Local state for editing
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [marginTop, setMarginTop] = useState('0');
  const [marginBottom, setMarginBottom] = useState('0');
  const [paddingTop, setPaddingTop] = useState('0');
  const [paddingBottom, setPaddingBottom] = useState('0');

  // Sync local state with component properties
  useEffect(() => {
    if (componentProperties) {
      setText(componentProperties.text || '');
      setTextColor(componentProperties.textColor || '');
      setBackgroundColor(componentProperties.backgroundColor || '');
      setMarginTop(componentProperties.marginTop || '0');
      setMarginBottom(componentProperties.marginBottom || '0');
      setPaddingTop(componentProperties.paddingTop || '0');
      setPaddingBottom(componentProperties.paddingBottom || '0');
    }
  }, [componentProperties]);

  // Handle instant updates (direct DOM manipulation only - TSX updated on save)
  const handleTextChange = (newText: string) => {
    setText(newText);
    
    if (selectedComponentId) {
      // Instant visual update (no re-render, no TSX update!)
      onDirectUpdate(selectedComponentId, 'text', newText);
    }
  };

  const handleColorChange = (newColor: string, type: 'text' | 'background') => {
    if (type === 'text') {
      setTextColor(newColor);
      if (selectedComponentId) {
        onDirectUpdate(selectedComponentId, 'textColor', newColor);
      }
    } else {
      setBackgroundColor(newColor);
      if (selectedComponentId) {
        onDirectUpdate(selectedComponentId, 'backgroundColor', newColor);
      }
    }
  };

  const handleSpacingChange = (value: string, property: string) => {
    if (!selectedComponentId) return;
    
    switch (property) {
      case 'marginTop':
        setMarginTop(value);
        onDirectUpdate(selectedComponentId, 'marginTop', value);
        break;
      case 'marginBottom':
        setMarginBottom(value);
        onDirectUpdate(selectedComponentId, 'marginBottom', value);
        break;
      case 'paddingTop':
        setPaddingTop(value);
        onDirectUpdate(selectedComponentId, 'paddingTop', value);
        break;
      case 'paddingBottom':
        setPaddingBottom(value);
        onDirectUpdate(selectedComponentId, 'paddingBottom', value);
        break;
    }
  };

  if (!selectedComponentId || !componentProperties) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <div className="max-w-sm">
          <div className="text-4xl mb-4">👆</div>
          <h3 className="text-lg font-semibold mb-2">Select an element</h3>
          <p className="text-sm text-gray-600">
            Click on any element in the preview to edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {componentProperties.type}
          </div>
          <span className="text-sm text-gray-600">Selected</span>
        </div>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Text Content - Only for text components with static text */}
        {componentProperties.type && ['Text', 'Heading', 'Button', 'Link'].includes(componentProperties.type) && (
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            {componentProperties.canEditText ? (
              <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm min-h-[100px] resize-y"
                placeholder="Enter text content..."
              />
            ) : (
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[100px] bg-gray-50">
                <p className="text-gray-500 italic">
                  This component uses dynamic content and cannot be edited directly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Colors */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Colors</h3>
          
          <div className="space-y-3">
            {/* Text Color - Only for text components */}
            {componentProperties.canEditTextColor && (
              <div>
                <label className="block text-sm mb-1">Text color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleColorChange(e.target.value, 'text')}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={textColor}
                    onChange={(e) => handleColorChange(e.target.value, 'text')}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>
            )}

            {/* Background Color - For all components */}
            {componentProperties.canEditBackgroundColor && (
              <div>
                <label className="block text-sm mb-1">Background color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                    onChange={(e) => handleColorChange(e.target.value, 'background')}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => handleColorChange(e.target.value, 'background')}
                    className="flex-1"
                    placeholder="transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spacing - For all components */}
        {componentProperties.canEditSpacing && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Spacing</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 text-gray-600">Margin Top</label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={marginTop}
                    onChange={(e) => handleSpacingChange(e.target.value, 'marginTop')}
                    className="w-full"
                    min="0"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs mb-1 text-gray-600">Margin Bottom</label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={marginBottom}
                    onChange={(e) => handleSpacingChange(e.target.value, 'marginBottom')}
                    className="w-full"
                    min="0"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 text-gray-600">Padding Top</label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={paddingTop}
                    onChange={(e) => handleSpacingChange(e.target.value, 'paddingTop')}
                    className="w-full"
                    min="0"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs mb-1 text-gray-600">Padding Bottom</label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={paddingBottom}
                    onChange={(e) => handleSpacingChange(e.target.value, 'paddingBottom')}
                    className="w-full"
                    min="0"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Code Preview */}
        <details className="pt-4 border-t">
          <summary className="text-xs text-gray-600 cursor-pointer">View code</summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
            {`// Component ID: ${selectedComponentId}\n// Type: ${componentProperties.type}\n\n// Properties will be shown here`}
          </pre>
        </details>
      </div>
    </div>
  );
}

