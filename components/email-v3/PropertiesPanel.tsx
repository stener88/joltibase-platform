'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
  MoveVertical,
  MoveHorizontal,
  ArrowUp,
  ChevronRight,
} from 'lucide-react';

interface PropertiesPanelProps {
  workingTsxRef: React.MutableRefObject<string>; // Ref to working TSX
  selectedComponentId: string | null;
  componentMap: ComponentMap;
  onDirectUpdate: (componentId: string, property: string, value: string) => void;
  onSelectParent?: () => void; // Callback to select parent component
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
  onSelectParent,
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
        textColor: '#0a0a0a',
        backgroundColor: 'transparent',
        marginTop: '0',
        marginBottom: '0',
        paddingTop: '0',
        paddingBottom: '0',
        canEditText: false,
        canEditTypography: false,
        canEditColors: false,
        canEditSpacing: false,
        canEditBorders: false,
        canEditLink: false,
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
    const textColor = getStyleValue('color', '#0a0a0a');
    const borderColor = getStyleValue('border-color', '#0a0a0a');

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
  const [textColorInherit, setTextColorInherit] = useState(true);
  const [fontSize, setFontSize] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [lineHeight, setLineHeight] = useState('');
  const [textAlign, setTextAlign] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [backgroundColorInherit, setBackgroundColorInherit] = useState(true);
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

  // Sync local state with component properties ONLY when switching components
  // Don't reset on every componentProperties change (that would wipe user edits!)
  const prevComponentIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    // Only reset if we switched to a different component (not same component with updated map)
    if (componentProperties && selectedComponentId !== prevComponentIdRef.current) {
      console.log('[PROPERTIES-PANEL] Component changed, resetting state:', selectedComponentId);
      prevComponentIdRef.current = selectedComponentId;
      
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
  }, [selectedComponentId, componentProperties]); // ✅ Reset only when switching components

  // Handle instant updates
  const handleTextChange = (newText: string) => {
    setText(newText);
    if (selectedComponentId) {
      onDirectUpdate(selectedComponentId, 'text', newText);
    }
  };

  const handleColorChange = (newColor: string, type: 'text' | 'background') => {
    if (type === 'text') {
      setTextColor(newColor);
      setTextColorInherit(false);
      if (selectedComponentId) {
        onDirectUpdate(selectedComponentId, 'color', newColor); // ✅ FIX: Use 'color' (valid CSS) not 'textColor'
      }
    } else {
      setBackgroundColor(newColor);
      setBackgroundColorInherit(false);
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
      <div className="h-full flex items-center justify-center p-6 text-center bg-background">
        <div className="max-w-sm">
          <h3 className="text-sm font-semibold mb-1.5 text-foreground">Select an element</h3>
          <p className="text-xs text-muted-foreground">
            Click on any element in the preview to edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Compact Header with breadcrumb & Select Parent */}
      <div className="px-3 py-2.5 border-b border-border">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground overflow-hidden">
            <span>Design</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">{componentProperties.type}</span>
          </div>
          <button
            onClick={() => {
              if (onSelectParent) {
                onSelectParent();
              } else {
                console.log('[PROPERTIES] Select parent - no callback provided');
              }
            }}
            disabled={!onSelectParent}
            className="flex items-center gap-1 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Select parent element"
          >
            <ArrowUp className="w-3 h-3" />
            <span>Select parent</span>
          </button>
        </div>
      </div>

      {/* Properties Form - Clean Lovable-style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 properties-panel-scroll">
        
        {/* CONTENT - Text editing */}
        {componentProperties.canEditText && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Content</label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-y"
              placeholder="Enter text content..."
            />
          </div>
        )}

        {/* TYPOGRAPHY */}
        {componentProperties.canEditTypography && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Typography</h3>
            
            {/* Font Size */}
            <div className="flex flex-wrap gap-1.5">
              {['12px', '14px', '16px', '18px', '24px', '32px'].map(size => (
                <button
                  key={size}
                  onClick={() => handleTypographyChange('fontSize', size)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    fontSize === size 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-card border-border hover:border-foreground text-foreground'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Font Weight */}
            <div className="flex gap-1.5">
              {[
                { value: '400', label: 'Normal' },
                { value: '600', label: 'Semi' },
                { value: '700', label: 'Bold' },
              ].map(weight => (
                <button
                  key={weight.value}
                  onClick={() => handleTypographyChange('fontWeight', weight.value)}
                  className={`flex-1 px-2.5 py-1 text-xs rounded border transition-colors ${
                    fontWeight === weight.value 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-card border-border hover:border-foreground text-foreground'
                  }`}
                >
                  {weight.label}
                </button>
              ))}
            </div>

            {/* Text Align */}
            <div className="flex gap-1.5">
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
                    className={`flex-1 px-2.5 py-2 rounded border transition-colors flex items-center justify-center ${
                      textAlign === align.value 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card border-border hover:border-foreground text-foreground'
                    }`}
                    title={align.value}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* COLORS */}
        {componentProperties.canEditColors && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Colors</h3>
            
            {/* Text Color */}
            {componentProperties.canEditTypography && (
              <div className="space-y-2">
                <label className="block text-xs text-muted-foreground">Text color</label>
                {textColorInherit ? (
                  <button
                    onClick={() => setTextColorInherit(false)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-muted transition-colors text-left"
                  >
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border border-border" />
                      Inherit
                    </span>
                  </button>
                ) : (
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
                    <button
                      onClick={() => setTextColorInherit(true)}
                      className="px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Background Color */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Background color</label>
              {backgroundColorInherit ? (
                <button
                  onClick={() => setBackgroundColorInherit(false)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-muted transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border border-border" />
                    Inherit
                  </span>
                </button>
              ) : (
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
                  <button
                    onClick={() => setBackgroundColorInherit(true)}
                    className="px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SPACING */}
        {componentProperties.canEditSpacing && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Spacing</h3>
            
            {/* Margin */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Margin</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'marginTop', value: marginTop, icon: <MoveHorizontal className="w-3.5 h-3.5 rotate-90" /> },
                  { key: 'marginRight', value: marginRight, icon: <MoveHorizontal className="w-3.5 h-3.5" /> },
                  { key: 'marginBottom', value: marginBottom, icon: <MoveHorizontal className="w-3.5 h-3.5 rotate-90" /> },
                  { key: 'marginLeft', value: marginLeft, icon: <MoveHorizontal className="w-3.5 h-3.5" /> },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                    <span className="text-muted-foreground">{item.icon}</span>
                    <Input
                      type="number"
                      value={item.value}
                      onChange={(e) => handleSpacingChange(e.target.value, item.key)}
                      className="flex-1 text-sm border-0 p-0 h-6 bg-transparent"
                      min="0"
                      placeholder="0"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Padding */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Padding</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'paddingTop', value: paddingTop, icon: <MoveVertical className="w-3.5 h-3.5" /> },
                  { key: 'paddingRight', value: paddingRight, icon: <MoveHorizontal className="w-3.5 h-3.5" /> },
                  { key: 'paddingBottom', value: paddingBottom, icon: <MoveVertical className="w-3.5 h-3.5" /> },
                  { key: 'paddingLeft', value: paddingLeft, icon: <MoveHorizontal className="w-3.5 h-3.5" /> },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                    <span className="text-muted-foreground">{item.icon}</span>
                    <Input
                      type="number"
                      value={item.value}
                      onChange={(e) => handleSpacingChange(e.target.value, item.key)}
                      className="flex-1 text-sm border-0 p-0 h-6 bg-transparent"
                      min="0"
                      placeholder="0"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BORDERS */}
        {componentProperties.canEditBorders && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Border</h3>
            
            {/* Border Radius */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Border radius</label>
              <div className="flex flex-wrap gap-1.5">
                {['0px', '4px', '8px', '12px', '16px', '50px'].map(radius => (
                  <button
                    key={radius}
                    onClick={() => handleBorderChange('borderRadius', radius)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      borderRadius === radius 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card border-border hover:border-foreground text-foreground'
                    }`}
                  >
                    {radius}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Width */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Border width</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={parseInt(borderWidth || '0')}
                  onChange={(e) => handleBorderChange('borderWidth', e.target.value + 'px')}
                  className="flex-1 text-sm"
                  min="0"
                  max="10"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            </div>

            {/* Border Style */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Border style</label>
              <div className="flex gap-1.5">
                {['solid', 'dashed', 'dotted'].map(style => (
                  <button
                    key={style}
                    onClick={() => handleBorderChange('borderStyle', style)}
                    className={`flex-1 px-2.5 py-1.5 text-xs rounded border transition-colors ${
                      borderStyle === style 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card border-border hover:border-foreground text-foreground'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LINK */}
        {componentProperties.canEditLink && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Link</label>
            <Input
              type="url"
              value={href}
              onChange={(e) => handleHrefChange(e.target.value)}
              placeholder="https://example.com"
              className="w-full text-sm font-mono"
            />
            {href && !/^https?:\/\/.+/.test(href) && (
              <p className="text-xs text-destructive">
                ⚠️ URL should start with http:// or https://
              </p>
            )}
          </div>
        )}

        {/* IMAGE */}
        {componentProperties.canEditImage && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Image</h3>
            
            <div className="border border-border rounded-lg p-3 bg-card">
              {imageSrc ? (
                <img src={imageSrc} alt={imageAlt} className="w-full h-auto rounded" />
              ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                  No image
                </div>
              )}
            </div>

            <Button
              onClick={() => setImagePickerOpen(true)}
              variant="outline"
              className="w-full"
            >
              Change Image
            </Button>

            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Alt text</label>
              <Input
                type="text"
                value={imageAlt}
                onChange={(e) => handleAltChange(e.target.value)}
                placeholder="Description for accessibility"
                className="w-full text-sm"
              />
            </div>

            {componentProperties.width && componentProperties.height && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-xs text-muted-foreground">Width</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={imageWidth}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                      className="w-full text-sm"
                      placeholder="Auto"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-muted-foreground">Height</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={imageHeight}
                      onChange={(e) => handleDimensionChange('height', e.target.value)}
                      className="w-full text-sm"
                      placeholder="Auto"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                </div>
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
