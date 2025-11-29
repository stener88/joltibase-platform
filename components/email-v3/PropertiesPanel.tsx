'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImagePicker } from './ImagePicker';
import type { SelectedImage } from './ImagePickerUnsplash';
import type { ComponentMap } from '@/lib/email-v3/tsx-parser';

interface PropertiesPanelProps {
  workingTsxRef: React.MutableRefObject<string>; // Ref to working TSX
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
  // Image components
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  // Capabilities flags
  canEditText: boolean;
  canEditTextColor: boolean;
  canEditBackgroundColor: boolean;
  canEditSpacing: boolean;
  canEditImage: boolean;
}

export function PropertiesPanel({
  workingTsxRef,
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
        canEditText: false,
        canEditTextColor: false,
        canEditBackgroundColor: false,
        canEditSpacing: false,
        canEditImage: false,
      };
    }

    console.log('[PROPERTIES-PANEL] Component info:', componentInfo);

    // Determine component capabilities based on type
    const componentType = componentInfo.type;
    const isTextComponent = ['Text', 'Heading', 'Button', 'Link'].includes(componentType);
    const isLayoutComponent = ['Section', 'Container', 'Column', 'Row'].includes(componentType);
    const isImageComponent = componentType === 'Img';
    
    // Get text content from rendered HTML (reliable!)
    const text = componentInfo.textContent || '';
    
    // Check if text content is dynamic (contains JSX expressions)
    // We check the TSX code for this since rendered HTML won't show the expressions
    const componentCode = workingTsxRef.current.substring(componentInfo.startChar, componentInfo.endChar);
    const isDynamicText = componentCode.includes('{') && componentCode.includes('}') && !componentCode.includes('style={');
    
    const hrefMatch = componentCode.match(/href=["']([^"']+)["']/);
    const href = hrefMatch ? hrefMatch[1] : '';

    const srcMatch = componentCode.match(/src=(?:"([^"]*)"|'([^']*)')/);
    const altMatch = componentCode.match(/alt=(?:"([^"]*)"|'([^']*)')/);
    const widthMatch = componentCode.match(/width=\{?(\d+)\}?/);
    const heightMatch = componentCode.match(/height=\{?(\d+)\}?/);
    
    const src = srcMatch ? (srcMatch[1] || srcMatch[2]) : '';
    const alt = altMatch ? (altMatch[1] || altMatch[2]) : '';
    const width = widthMatch ? widthMatch[1] : '';
    const height = heightMatch ? heightMatch[1] : '';

    // Helper: Extract style value from computed styles (rendered HTML)
    const computedStyles = componentInfo.computedStyles || {};
    
    const getStyleValue = (cssProp: string, defaultValue: string = ''): string => {
      const value = computedStyles[cssProp];
      if (!value) return defaultValue;
      
      // Remove 'px' suffix for spacing values
      if (cssProp.includes('margin') || cssProp.includes('padding')) {
        return value.replace('px', '');
      }
      
      return value;
    };

    // Helper: Convert rgb() to hex for color inputs
    const rgbToHex = (rgb: string): string => {
      if (!rgb || !rgb.startsWith('rgb')) return rgb;
      
      const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!match) return rgb;
      
      const [, r, g, b] = match;
      return '#' + [r, g, b].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };

    const backgroundColor = getStyleValue('background-color', 'transparent');
    const textColor = getStyleValue('color', '#000000');

    return {
      type: componentType,
      // Text properties (only for text components)
      text: isTextComponent ? text : undefined,
      textColor: isTextComponent ? rgbToHex(textColor) : undefined,
      fontSize: isTextComponent ? getStyleValue('font-size') : undefined,
      fontWeight: isTextComponent ? getStyleValue('font-weight') : undefined,
      // Layout properties
      backgroundColor: backgroundColor === 'transparent' ? 'transparent' : rgbToHex(backgroundColor),
      marginTop: getStyleValue('margin-top', '0'),
      marginBottom: getStyleValue('margin-bottom', '0'),
      paddingTop: getStyleValue('padding-top', '0'),
      paddingBottom: getStyleValue('padding-bottom', '0'),
      // Link properties
      href: href || undefined,
      // Image properties (only for Img components)
      src: isImageComponent ? src : undefined,
      alt: isImageComponent ? alt : undefined,
      width: isImageComponent ? width : undefined,
      height: isImageComponent ? height : undefined,
      // Capabilities
      canEditText: isTextComponent && !isDynamicText, // Can't edit dynamic text
      canEditTextColor: isTextComponent,
      canEditBackgroundColor: true, // Most components can have background
      canEditSpacing: true, // All components can have spacing
      canEditImage: isImageComponent, // Can change image
    };
  }, [selectedComponentId, componentMap, workingTsxRef]);

  // Local state for editing
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [marginTop, setMarginTop] = useState('0');
  const [marginBottom, setMarginBottom] = useState('0');
  const [paddingTop, setPaddingTop] = useState('0');
  const [paddingBottom, setPaddingBottom] = useState('0');
  const [imageSrc, setImageSrc] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

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
      setImageSrc(componentProperties.src || '');
      setImageAlt(componentProperties.alt || '');
      setImageWidth(componentProperties.width || '');
      setImageHeight(componentProperties.height || '');
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

  const handleImageSelect = (image: SelectedImage) => {
    if (!selectedComponentId) return;
    
    setImageSrc(image.url);
    setImageAlt(image.alt);
    setImageWidth(image.width?.toString() || '');
    setImageHeight(image.height?.toString() || '');
    
    // Send image update to parent
    onDirectUpdate(selectedComponentId, 'imageSrc', JSON.stringify({
      url: image.url,
      alt: image.alt,
      width: image.width,
      height: image.height,
      credit: image.credit,
      downloadLocation: image.downloadLocation,
    }));
  };

  const handleAltChange = (newAlt: string) => {
    if (!selectedComponentId) return;
    
    setImageAlt(newAlt);
    onDirectUpdate(selectedComponentId, 'imageAlt', newAlt);
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: string) => {
    if (!selectedComponentId) return;
    
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;
    
    if (dimension === 'width') {
      setImageWidth(value);
      if (value) {
        onDirectUpdate(selectedComponentId, 'imageWidth', value);
      }
    } else {
      setImageHeight(value);
      if (value) {
        onDirectUpdate(selectedComponentId, 'imageHeight', value);
      }
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

        {/* Image Properties - Only for Img components */}
        {componentProperties.canEditImage && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Image</label>
              <div className="border rounded-lg p-3 bg-gray-50">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-auto rounded"
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => setImagePickerOpen(true)}
              variant="outline"
              className="w-full"
            >
              🖼️ Change Image
            </Button>

            <div>
              <label className="block text-sm font-medium mb-2">Alt Text</label>
              <Input
                type="text"
                value={imageAlt}
                onChange={(e) => handleAltChange(e.target.value)}
                placeholder="Description for accessibility"
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Describe what the image shows for accessibility
              </p>
            </div>

            {componentProperties.width && componentProperties.height && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Width</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={imageWidth}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                      className="w-full"
                      placeholder="Width"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={imageHeight}
                      onChange={(e) => handleDimensionChange('height', e.target.value)}
                      className="w-full"
                      placeholder="Height"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>
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

      {/* Image Picker Modal */}
      {componentProperties.canEditImage && (
        <ImagePicker
          isOpen={imagePickerOpen}
          onClose={() => setImagePickerOpen(false)}
          onSelectImage={handleImageSelect}
          currentSrc={imageSrc}
          currentAlt={imageAlt}
        />
      )}
    </div>
  );
}

