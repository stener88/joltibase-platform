'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImagePicker } from './ImagePicker';
import type { SelectedImage } from './ImagePickerUnsplash';
import type { ComponentMap } from '@/lib/email-v3/tsx-parser';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  ChevronDown,
  ChevronUp,
  Copy,
  RotateCcw,
} from 'lucide-react';

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
  lineHeight?: string;
  textAlign?: string;
  textDecoration?: string;
  // Layout components
  backgroundColor?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  // Border properties
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  // Button/Link components
  href?: string;
  // Image components
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  // Capabilities flags
  canEditText: boolean;
  canEditTypography: boolean;
  canEditColors: boolean;
  canEditSpacing: boolean;
  canEditBorders: boolean;
  canEditLink: boolean;
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
    const borderColor = getStyleValue('border-color', '#000000');

    const isLinkComponent = componentType === 'Link' || componentType === 'Button';

    return {
      type: componentType,
      // Text properties (only for text components)
      text: isTextComponent ? text : undefined,
      textColor: isTextComponent ? rgbToHex(textColor) : undefined,
      fontSize: isTextComponent ? getStyleValue('font-size') : undefined,
      fontWeight: isTextComponent ? getStyleValue('font-weight') : undefined,
      lineHeight: isTextComponent ? getStyleValue('line-height') : undefined,
      textAlign: isTextComponent ? getStyleValue('text-align') : undefined,
      textDecoration: isTextComponent ? getStyleValue('text-decoration') : undefined,
      // Layout properties
      backgroundColor: backgroundColor === 'transparent' ? 'transparent' : rgbToHex(backgroundColor),
      marginTop: getStyleValue('margin-top', '0'),
      marginBottom: getStyleValue('margin-bottom', '0'),
      marginLeft: getStyleValue('margin-left', '0'),
      marginRight: getStyleValue('margin-right', '0'),
      paddingTop: getStyleValue('padding-top', '0'),
      paddingBottom: getStyleValue('padding-bottom', '0'),
      paddingLeft: getStyleValue('padding-left', '0'),
      paddingRight: getStyleValue('padding-right', '0'),
      // Border properties
      borderRadius: getStyleValue('border-radius', '0'),
      borderWidth: getStyleValue('border-width', '0'),
      borderColor: borderColor === 'transparent' ? 'transparent' : rgbToHex(borderColor),
      borderStyle: getStyleValue('border-style', 'solid'),
      // Link properties
      href: href || undefined,
      // Image properties (only for Img components)
      src: isImageComponent ? src : undefined,
      alt: isImageComponent ? alt : undefined,
      width: isImageComponent ? width : undefined,
      height: isImageComponent ? height : undefined,
      // Capabilities
      canEditText: isTextComponent && !isDynamicText, // Can't edit dynamic text
      canEditTypography: isTextComponent,
      canEditColors: true,
      canEditSpacing: true, // All components can have spacing
      canEditBorders: !isImageComponent, // All except images
      canEditLink: isLinkComponent && !isDynamicText,
      canEditImage: isImageComponent, // Can change image
    };
  }, [selectedComponentId, componentMap, workingTsxRef]);

  // Local state for editing
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [lineHeight, setLineHeight] = useState('');
  const [textAlign, setTextAlign] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [marginTop, setMarginTop] = useState('0');
  const [marginBottom, setMarginBottom] = useState('0');
  const [marginLeft, setMarginLeft] = useState('0');
  const [marginRight, setMarginRight] = useState('0');
  const [paddingTop, setPaddingTop] = useState('0');
  const [paddingBottom, setPaddingBottom] = useState('0');
  const [paddingLeft, setPaddingLeft] = useState('0');
  const [paddingRight, setPaddingRight] = useState('0');
  const [borderRadius, setBorderRadius] = useState('0');
  const [borderWidth, setBorderWidth] = useState('0');
  const [borderColor, setBorderColor] = useState('');
  const [borderStyle, setBorderStyle] = useState('solid');
  const [href, setHref] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  
  // UI state for collapsible sections
  const [openSections, setOpenSections] = useState({
    content: true,
    typography: true,
    colors: true,
    spacing: false,
    borders: false,
    link: true,
    image: true,
  });

  // Sync local state with component properties
  useEffect(() => {
    if (componentProperties) {
      setText(componentProperties.text || '');
      setTextColor(componentProperties.textColor || '');
      setFontSize(componentProperties.fontSize || '');
      setFontWeight(componentProperties.fontWeight || '');
      setLineHeight(componentProperties.lineHeight || '');
      setTextAlign(componentProperties.textAlign || '');
      setBackgroundColor(componentProperties.backgroundColor || '');
      setMarginTop(componentProperties.marginTop || '0');
      setMarginBottom(componentProperties.marginBottom || '0');
      setMarginLeft(componentProperties.marginLeft || '0');
      setMarginRight(componentProperties.marginRight || '0');
      setPaddingTop(componentProperties.paddingTop || '0');
      setPaddingBottom(componentProperties.paddingBottom || '0');
      setPaddingLeft(componentProperties.paddingLeft || '0');
      setPaddingRight(componentProperties.paddingRight || '0');
      setBorderRadius(componentProperties.borderRadius || '0');
      setBorderWidth(componentProperties.borderWidth || '0');
      setBorderColor(componentProperties.borderColor || '');
      setBorderStyle(componentProperties.borderStyle || 'solid');
      setHref(componentProperties.href || '');
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

  const handleTypographyChange = (property: string, value: string) => {
    if (!selectedComponentId) return;
    
    switch (property) {
      case 'fontSize':
        setFontSize(value);
        onDirectUpdate(selectedComponentId, 'fontSize', value);
        break;
      case 'fontWeight':
        setFontWeight(value);
        onDirectUpdate(selectedComponentId, 'fontWeight', value);
        break;
      case 'lineHeight':
        setLineHeight(value);
        onDirectUpdate(selectedComponentId, 'lineHeight', value);
        break;
      case 'textAlign':
        setTextAlign(value);
        onDirectUpdate(selectedComponentId, 'textAlign', value);
        break;
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
      case 'marginLeft':
        setMarginLeft(value);
        onDirectUpdate(selectedComponentId, 'marginLeft', value);
        break;
      case 'marginRight':
        setMarginRight(value);
        onDirectUpdate(selectedComponentId, 'marginRight', value);
        break;
      case 'paddingTop':
        setPaddingTop(value);
        onDirectUpdate(selectedComponentId, 'paddingTop', value);
        break;
      case 'paddingBottom':
        setPaddingBottom(value);
        onDirectUpdate(selectedComponentId, 'paddingBottom', value);
        break;
      case 'paddingLeft':
        setPaddingLeft(value);
        onDirectUpdate(selectedComponentId, 'paddingLeft', value);
        break;
      case 'paddingRight':
        setPaddingRight(value);
        onDirectUpdate(selectedComponentId, 'paddingRight', value);
        break;
    }
  };

  const handleBorderChange = (property: string, value: string) => {
    if (!selectedComponentId) return;
    
    switch (property) {
      case 'borderRadius':
        setBorderRadius(value);
        onDirectUpdate(selectedComponentId, 'borderRadius', value);
        break;
      case 'borderWidth':
        setBorderWidth(value);
        onDirectUpdate(selectedComponentId, 'borderWidth', value);
        break;
      case 'borderColor':
        setBorderColor(value);
        onDirectUpdate(selectedComponentId, 'borderColor', value);
        break;
      case 'borderStyle':
        setBorderStyle(value);
        onDirectUpdate(selectedComponentId, 'borderStyle', value);
        break;
    }
  };

  const handleHrefChange = (newHref: string) => {
    if (!selectedComponentId) return;
    setHref(newHref);
    onDirectUpdate(selectedComponentId, 'href', newHref);
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

  // Helper to toggle sections
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!selectedComponentId || !componentProperties) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center bg-gray-50">
        <div className="max-w-sm">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Select an element</h3>
          <p className="text-sm text-gray-600">
            Click on any element in the preview to edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with component type badge */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
              {componentProperties.type}
            </div>
          </div>
          <button
            onClick={() => {
              // TODO: Implement reset
              console.log('[PROPERTIES] Reset to default');
            }}
            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
            title="Reset to default"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
        <p className="text-xs text-gray-600">
          Edit properties to customize this element
        </p>
      </div>

      {/* Properties Form with Collapsible Sections */}
      <div className="flex-1 overflow-y-auto">
        
        {/* CONTENT SECTION - Text editing */}
        {componentProperties.canEditText && (
          <div className="border-b">
            <button
              onClick={() => toggleSection('content')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                <span className="font-semibold text-sm">Content</span>
              </div>
              {openSections.content ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.content && (
              <div className="px-4 py-3 bg-gray-50">
                <textarea
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter text content..."
                />
              </div>
            )}
          </div>
        )}

        {/* TYPOGRAPHY SECTION */}
        {componentProperties.canEditTypography && (
          <div className="border-b">
            <button
              onClick={() => toggleSection('typography')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔤</span>
                <span className="font-semibold text-sm">Typography</span>
              </div>
              {openSections.typography ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.typography && (
              <div className="px-4 py-3 space-y-4 bg-gray-50">
                {/* Font Size */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Font Size</label>
                  <div className="flex gap-2">
                    {['12px', '14px', '16px', '18px', '24px', '32px'].map(size => (
                      <button
                        key={size}
                        onClick={() => handleTypographyChange('fontSize', size)}
                        className={`px-2 py-1 text-xs rounded border ${
                          fontSize === size 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Weight */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Font Weight</label>
                  <div className="flex gap-2">
                    {[
                      { value: '300', label: 'Light' },
                      { value: '400', label: 'Normal' },
                      { value: '600', label: 'Semi' },
                      { value: '700', label: 'Bold' },
                    ].map(weight => (
                      <button
                        key={weight.value}
                        onClick={() => handleTypographyChange('fontWeight', weight.value)}
                        className={`px-3 py-1 text-xs rounded border flex-1 ${
                          fontWeight === weight.value 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {weight.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line Height */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">
                    Line Height: {lineHeight || 'normal'}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={parseFloat(lineHeight || '1.5')}
                    onChange={(e) => handleTypographyChange('lineHeight', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Text Align */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Text Align</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'left', icon: AlignLeft },
                      { value: 'center', icon: AlignCenter },
                      { value: 'right', icon: AlignRight },
                      { value: 'justify', icon: AlignJustify },
                    ].map(align => {
                      const Icon = align.icon;
                      return (
                        <button
                          key={align.value}
                          onClick={() => handleTypographyChange('textAlign', align.value)}
                          className={`px-3 py-2 rounded border flex-1 flex items-center justify-center ${
                            textAlign === align.value 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white border-gray-300 hover:border-blue-400'
                          }`}
                          title={align.value}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COLORS SECTION */}
        {componentProperties.canEditColors && (
          <div className="border-b">
            <button
              onClick={() => toggleSection('colors')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎨</span>
                <span className="font-semibold text-sm">Colors</span>
              </div>
              {openSections.colors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.colors && (
              <div className="px-4 py-3 space-y-4 bg-gray-50">
                {/* Text Color */}
                {componentProperties.canEditTypography && (
                  <div>
                    <label className="block text-xs font-medium mb-2 text-gray-700">Text Color</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={textColor || '#000000'}
                        onChange={(e) => handleColorChange(e.target.value, 'text')}
                        className="w-14 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => handleColorChange(e.target.value, 'text')}
                        className="flex-1 font-mono text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                )}

                {/* Background Color */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Background Color</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                      onChange={(e) => handleColorChange(e.target.value, 'background')}
                      className="w-14 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => handleColorChange(e.target.value, 'background')}
                      className="flex-1 font-mono text-sm"
                      placeholder="transparent"
                    />
                  </div>
                  <div className="mt-2 flex gap-2">
                    {['transparent', '#ffffff', '#f3f4f6', '#000000', '#3b82f6', '#10b981'].map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color, 'background')}
                        className={`w-8 h-8 rounded border-2 ${
                          backgroundColor === color ? 'border-blue-600' : 'border-gray-300'
                        }`}
                        style={{ 
                          backgroundColor: color === 'transparent' ? 'white' : color,
                          backgroundImage: color === 'transparent' 
                            ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                            : 'none',
                          backgroundSize: color === 'transparent' ? '8px 8px' : 'auto',
                          backgroundPosition: color === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SPACING SECTION */}
        {componentProperties.canEditSpacing && (
          <div className="border-b">
            <button
              onClick={() => toggleSection('spacing')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📏</span>
                <span className="font-semibold text-sm">Spacing</span>
              </div>
              {openSections.spacing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.spacing && (
              <div className="px-4 py-3 space-y-4 bg-gray-50">
                {/* Margin */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Margin</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'marginTop', label: 'Top', value: marginTop },
                      { key: 'marginRight', label: 'Right', value: marginRight },
                      { key: 'marginBottom', label: 'Bottom', value: marginBottom },
                      { key: 'marginLeft', label: 'Left', value: marginLeft },
                    ].map(item => (
                      <div key={item.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={item.value}
                            onChange={(e) => handleSpacingChange(e.target.value, item.key)}
                            className="w-full text-sm"
                            min="0"
                          />
                          <span className="text-xs text-gray-500 whitespace-nowrap">px</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Padding */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Padding</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'paddingTop', label: 'Top', value: paddingTop },
                      { key: 'paddingRight', label: 'Right', value: paddingRight },
                      { key: 'paddingBottom', label: 'Bottom', value: paddingBottom },
                      { key: 'paddingLeft', label: 'Left', value: paddingLeft },
                    ].map(item => (
                      <div key={item.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={item.value}
                            onChange={(e) => handleSpacingChange(e.target.value, item.key)}
                            className="w-full text-sm"
                            min="0"
                          />
                          <span className="text-xs text-gray-500 whitespace-nowrap">px</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Quick Presets</label>
                  <div className="flex gap-2">
                    {['0', '8', '16', '24', '32'].map(preset => (
                      <button
                        key={preset}
                        onClick={() => {
                          ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(key => 
                            handleSpacingChange(preset, key)
                          );
                        }}
                        className="px-2 py-1 text-xs rounded border bg-white border-gray-300 hover:border-blue-400"
                        title={`Set all margins to ${preset}px`}
                      >
                        {preset}px
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BORDERS SECTION */}
        {componentProperties.canEditBorders && (
          <div className="border-b">
            <button
              onClick={() => toggleSection('borders')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">⬜</span>
                <span className="font-semibold text-sm">Borders</span>
              </div>
              {openSections.borders ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.borders && (
              <div className="px-4 py-3 space-y-4 bg-gray-50">
                {/* Border Radius */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">
                    Border Radius: {borderRadius || '0px'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={parseInt(borderRadius || '0')}
                    onChange={(e) => handleBorderChange('borderRadius', e.target.value + 'px')}
                    className="w-full"
                  />
                  <div className="mt-2 flex gap-2">
                    {['0px', '4px', '8px', '12px', '16px', '50px'].map(radius => (
                      <button
                        key={radius}
                        onClick={() => handleBorderChange('borderRadius', radius)}
                        className={`px-2 py-1 text-xs rounded border ${
                          borderRadius === radius 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Width */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">
                    Border Width: {borderWidth || '0px'}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={parseInt(borderWidth || '0')}
                      onChange={(e) => handleBorderChange('borderWidth', e.target.value + 'px')}
                      className="w-full text-sm"
                      min="0"
                      max="10"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>

                {/* Border Color */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Border Color</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={borderColor || '#000000'}
                      onChange={(e) => handleBorderChange('borderColor', e.target.value)}
                      className="w-14 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={borderColor}
                      onChange={(e) => handleBorderChange('borderColor', e.target.value)}
                      className="flex-1 font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Border Style */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Border Style</label>
                  <div className="flex gap-2">
                    {['solid', 'dashed', 'dotted'].map(style => (
                      <button
                        key={style}
                        onClick={() => handleBorderChange('borderStyle', style)}
                        className={`px-3 py-2 text-xs rounded border flex-1 ${
                          borderStyle === style 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LINK SECTION */}
        {componentProperties.canEditLink && (
          <div className="border-b">
            <button
              onClick={() => toggleSection('link')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔗</span>
                <span className="font-semibold text-sm">Link</span>
              </div>
              {openSections.link ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.link && (
              <div className="px-4 py-3 space-y-3 bg-gray-50">
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">URL</label>
                  <Input
                    type="url"
                    value={href}
                    onChange={(e) => handleHrefChange(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full text-sm font-mono"
                  />
                  {href && !/^https?:\/\/.+/.test(href) && (
                    <p className="mt-1 text-xs text-amber-600">
                      ⚠️ URL should start with http:// or https://
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Properties - Only for Img components */}
        {componentProperties.canEditImage && (
          <div className="border-b">
            <button
              onClick={() => toggleSection('image')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🖼️</span>
                <span className="font-semibold text-sm">Image</span>
              </div>
              {openSections.image ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.image && (
          <div className="px-4 py-3 space-y-4 bg-gray-50">
            <div>
              <label className="block text-xs font-medium mb-2 text-gray-700">Current Image</label>
              <div className="border rounded-lg p-3 bg-white">
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
              Change Image
            </Button>

            <div>
              <label className="block text-xs font-medium mb-2 text-gray-700">Alt Text</label>
              <Input
                type="text"
                value={imageAlt}
                onChange={(e) => handleAltChange(e.target.value)}
                placeholder="Description for accessibility"
                className="w-full text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Describe what the image shows for accessibility
              </p>
            </div>

            {componentProperties.width && componentProperties.height && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Width</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={imageWidth}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                      className="w-full text-sm"
                      placeholder="Width"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-700">Height</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={imageHeight}
                      onChange={(e) => handleDimensionChange('height', e.target.value)}
                      className="w-full text-sm"
                      placeholder="Height"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>
              </div>
            )}
          </div>
            )}
          </div>
        )}
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

