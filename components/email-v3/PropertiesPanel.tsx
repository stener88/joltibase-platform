'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';

interface PropertiesPanelProps {
  tsxCode: string;
  selectedComponentId: string | null;
  onTsxUpdate: (newTsxCode: string) => void;
  onBackToChat: () => void;
}

interface ComponentProperties {
  type: string;
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

export function PropertiesPanel({
  tsxCode,
  selectedComponentId,
  onTsxUpdate,
  onBackToChat,
}: PropertiesPanelProps) {
  // Extract properties from selected component
  const componentProperties = useMemo<ComponentProperties | null>(() => {
    if (!selectedComponentId) return null;

    // Mock extraction - in production, parse TSX and extract actual properties
    const mockProperties: Record<string, ComponentProperties> = {
      'header-1': {
        type: 'Heading',
        text: 'Your Big things',
        textColor: '#007fff',
        backgroundColor: 'transparent',
        marginTop: '0',
        marginBottom: '16',
        paddingTop: '0',
        paddingBottom: '0',
      },
      'text-1': {
        type: 'Text',
        text: 'Transform your ideas into reality with powerful tools designed for modern creators and innovators',
        textColor: '#666666',
        backgroundColor: 'transparent',
        marginTop: '0',
        marginBottom: '32',
        paddingTop: '0',
        paddingBottom: '0',
      },
      'button-1': {
        type: 'Button',
        text: 'Get Started →',
        textColor: '#ffffff',
        backgroundColor: '#000000',
        marginTop: '0',
        marginBottom: '0',
        paddingTop: '12',
        paddingBottom: '12',
      },
      'button-2': {
        type: 'Button',
        text: 'Jolt',
        textColor: '#ffffff',
        backgroundColor: '#007fff',
        marginTop: '0',
        marginBottom: '0',
        paddingTop: '12',
        paddingBottom: '12',
      },
    };

    return mockProperties[selectedComponentId] || null;
  }, [selectedComponentId]);

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

  // Handle instant updates (direct TSX manipulation)
  const handleTextChange = (newText: string) => {
    setText(newText);
    // TODO: Update TSX directly
    // For now, just update local state - will implement TSX manipulation next
  };

  const handleColorChange = (newColor: string, type: 'text' | 'background') => {
    if (type === 'text') {
      setTextColor(newColor);
    } else {
      setBackgroundColor(newColor);
    }
    // TODO: Update TSX directly
  };

  const handleSpacingChange = (value: string, property: string) => {
    switch (property) {
      case 'marginTop':
        setMarginTop(value);
        break;
      case 'marginBottom':
        setMarginBottom(value);
        break;
      case 'paddingTop':
        setPaddingTop(value);
        break;
      case 'paddingBottom':
        setPaddingBottom(value);
        break;
    }
    // TODO: Update TSX directly
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
        {/* Text Content */}
        {componentProperties.text !== undefined && (
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm min-h-[100px] resize-y"
              placeholder="Enter text content..."
            />
          </div>
        )}

        {/* Colors */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Colors</h3>
          
          <div className="space-y-3">
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
          </div>
        </div>

        {/* Spacing */}
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

