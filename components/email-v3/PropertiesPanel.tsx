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
  Type,
} from 'lucide-react';
import { ALL_FONTS, type FontDefinition } from '@/lib/email-v3/fonts';

// Font size mapping: Tailwind class ↔ Pixel value
const FONT_SIZE_MAP = [
  { tailwind: 'text-xs', px: '12px', label: 'XS' },
  { tailwind: 'text-sm', px: '14px', label: 'Small' },
  { tailwind: 'text-base', px: '16px', label: 'Body' },
  { tailwind: 'text-lg', px: '18px', label: 'Large' },
  { tailwind: 'text-xl', px: '20px', label: 'XL' },
  { tailwind: 'text-2xl', px: '24px', label: '2XL' },
  { tailwind: 'text-3xl', px: '30px', label: '3XL' },
  { tailwind: 'text-4xl', px: '36px', label: '4XL' },
  { tailwind: 'text-5xl', px: '48px', label: '5XL' },
  { tailwind: 'text-6xl', px: '60px', label: '6XL' },
  { tailwind: 'text-7xl', px: '72px', label: '7XL' },
  { tailwind: 'text-8xl', px: '96px', label: '8XL' },
  { tailwind: 'text-9xl', px: '128px', label: '9XL' },
] as const;

// Helper: Convert any fontSize value to display value
function normalizeFontSize(value: string): string {
  // If it's a Tailwind class, convert to px
  const mapped = FONT_SIZE_MAP.find(m => value.includes(m.tailwind));
  if (mapped) return mapped.px;
  
  // If it's already px, return as-is
  if (value.includes('px')) return value;
  
  // Default fallback
  return '16px';
}

interface PropertiesPanelProps {
  tsxCode: string; // NEW: Direct prop instead of ref
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
  fontFamily?: string;
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
  tsxCode,
  selectedComponentId,
  componentMap,
  onDirectUpdate,
  onSelectParent,
}: PropertiesPanelProps) {
  // Extract properties from selected component
  const componentProperties = useMemo<ComponentProperties | null>(() => {
    if (!selectedComponentId) {return null;
    }

    // ✅ Guard: Check if tsxCode is available
    if (!tsxCode) {return null;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[PROPERTIES-PANEL] Component selected:', selectedComponentId);
      console.log('[PROPERTIES-PANEL] Component map:', componentMap);
    }

    // Get component info from map
    const componentInfo = componentMap[selectedComponentId];
    if (!componentInfo) {return {
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
    }// Determine component capabilities based on type
    const componentType = componentInfo.type;
    const isTextComponent = ['Text', 'Heading', 'Button', 'Link'].includes(componentType);
    const isImageComponent = componentType === 'Img';
    
    // Get text content from rendered HTML (reliable!)
    const text = componentInfo.textContent || '';
    
    // Check if text content is dynamic (contains JSX expressions)
    // We check the TSX code for this since rendered HTML won't show the expressions
    const componentCode = tsxCode.substring(componentInfo.startChar, componentInfo.endChar);
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
      fontFamily: isTextComponent ? getStyleValue('font-family', 'inherit') : undefined,
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
  }, [selectedComponentId, componentMap, tsxCode]);

  // Local state for editing
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('');
  const [textColorInherit, setTextColorInherit] = useState(true);
  const [fontSize, setFontSize] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [fontFamily, setFontFamily] = useState('inherit');
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
  const [marginExpanded, setMarginExpanded] = useState(false);
  const [paddingExpanded, setPaddingExpanded] = useState(false);
  const dragStateRef = useRef<{ property: string; startValue: number; startX: number } | null>(null);

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
      setFontFamily(componentProperties.fontFamily || 'inherit');
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
      case 'fontFamily':
        setFontFamily(value);
        onDirectUpdate(selectedComponentId, 'fontFamily', value);
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

  // Drag-to-adjust handler for spacing
  const handleDragStart = (e: React.MouseEvent, property: string, currentValue: string) => {
    e.preventDefault();
    const startValue = parseInt(currentValue) || 0;
    const startX = e.clientX;
    
    dragStateRef.current = { property, startValue, startX };
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStateRef.current) return;
      
      const deltaX = moveEvent.clientX - dragStateRef.current.startX;
      const newValue = Math.max(0, dragStateRef.current.startValue + Math.round(deltaX / 2)); // Divide by 2 for smoother control
      
      handleSpacingChange(newValue.toString(), dragStateRef.current.property);
    };
    
    const handleMouseUp = () => {
      dragStateRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
      {/* Compact Header with breadcrumb & Controls */}
      <div className="px-3 py-2.5 border-b border-border">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground overflow-hidden">
            <span>Design</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">{componentProperties.type}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* Select Parent button */}
          <button
            onClick={() => {
              if (onSelectParent) {
                onSelectParent();
              } else {}
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
            
            {/* Row 1: Font Size + Font Style */}
            <div className="grid grid-cols-2 gap-3">
              {/* Font Size */}
            <div className="space-y-2">
                <label className="block text-xs text-muted-foreground">Font size</label>
                <select
                  value={normalizeFontSize(fontSize)}
                  onChange={(e) => handleTypographyChange('fontSize', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  {FONT_SIZE_MAP.map(size => (
                    <option key={size.px} value={size.px}>
                      {size.label} ({size.px})
                    </option>
                ))}
                </select>
            </div>
            
              {/* Font Style */}
              <div className="space-y-2">
                <label className="block text-xs text-muted-foreground">
                  Font style <span className="text-[10px]">✦ = Web font</span>
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  style={{ fontFamily: fontFamily !== 'inherit' ? fontFamily : undefined }}
                >
                  {ALL_FONTS.map((font: FontDefinition) => (
                    <option key={font.value} value={font.value}>
                      {font.label} {font.webFont ? '✦' : ''}
                    </option>
              ))}
                </select>
              </div>
            </div>

            {/* Row 2: Font Weight + Alignment */}
            <div className="grid grid-cols-2 gap-3">
            {/* Font Weight */}
              <div className="space-y-2">
                <label className="block text-xs text-muted-foreground">Font weight</label>
                <select
                  value={fontWeight || '400'}
                  onChange={(e) => handleTypographyChange('fontWeight', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="300">Light</option>
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi-bold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra-bold</option>
                </select>
            </div>

              {/* Alignment */}
              <div className="space-y-2">
                <label className="block text-xs text-muted-foreground">Alignment</label>
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
            </div>

            {/* Row 3: Line Height */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Line height</label>
              <div className="flex gap-1.5">
                {[
                  { value: '1', label: 'None' },
                  { value: '1.25', label: 'Tight' },
                  { value: '1.5', label: 'Normal' },
                  { value: '1.75', label: 'Relaxed' },
                  { value: '2', label: 'Loose' },
                ].map(lh => (
                  <button
                    key={lh.value}
                    onClick={() => handleTypographyChange('lineHeight', lh.value)}
                    className={`flex-1 px-2 py-2 rounded border transition-colors text-xs ${
                      lineHeight === lh.value 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card border-border hover:border-foreground text-foreground'
                    }`}
                    title={`Line height: ${lh.value}`}
                  >
                    {lh.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COLORS */}
        {componentProperties.canEditColors && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Colors</h3>
            
            {/* Text Color + Background Color - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
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
                        <span className="text-xs">Inherit</span>
                    </span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={textColor || '#000000'}
                      onChange={(e) => handleColorChange(e.target.value, 'text')}
                        className="w-10 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => handleColorChange(e.target.value, 'text')}
                        className="flex-1 font-mono text-xs"
                      placeholder="#000000"
                    />
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
                      <span className="text-xs">Inherit</span>
                  </span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                    onChange={(e) => handleColorChange(e.target.value, 'background')}
                      className="w-10 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => handleColorChange(e.target.value, 'background')}
                      className="flex-1 font-mono text-xs"
                    placeholder="transparent"
                  />
                </div>
              )}
              </div>
            </div>
          </div>
        )}

        {/* SPACING - Compact with drag-to-adjust and expand */}
        {componentProperties.canEditSpacing && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Spacing</h3>
            
            {/* Margin */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Margin</label>
              <div className="flex gap-2">
                {/* Left (Horizontal) */}
                <div className="flex-1 flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                  <span 
                    className="text-muted-foreground hover:text-foreground cursor-ew-resize transition-colors"
                    onMouseDown={(e) => handleDragStart(e, 'marginLeft', marginLeft)}
                    title="Drag to adjust"
                  >
                    <MoveHorizontal className="w-3.5 h-3.5" />
                  </span>
                    <Input
                      type="number"
                    value={marginLeft}
                    onChange={(e) => handleSpacingChange(e.target.value, 'marginLeft')}
                    className="flex-1 text-sm border-0 p-0 h-6 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                      placeholder="0"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                
                {/* Top (Vertical) */}
                <div className="flex-1 flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                  <span 
                    className="text-muted-foreground hover:text-foreground cursor-ew-resize transition-colors"
                    onMouseDown={(e) => handleDragStart(e, 'marginTop', marginTop)}
                    title="Drag to adjust"
                  >
                    <MoveHorizontal className="w-3.5 h-3.5 rotate-90" />
                  </span>
                  <Input
                    type="number"
                    value={marginTop}
                    onChange={(e) => handleSpacingChange(e.target.value, 'marginTop')}
                    className="flex-1 text-sm border-0 p-0 h-6 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground">px</span>
              </div>
                
                {/* Expand button with rotation animation */}
                <button
                  onClick={() => setMarginExpanded(!marginExpanded)}
                  className={`px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
                    marginExpanded 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-card border-border hover:border-foreground text-foreground'
                  }`}
                  title="Individual sides"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${marginExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
                  </svg>
                </button>
            </div>

              {/* Expanded view with slide animation */}
              <div 
                className={`grid transition-all duration-200 ease-in-out ${
                  marginExpanded 
                    ? 'grid-rows-[1fr] opacity-100' 
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex gap-2 pt-2">
                    {/* Right */}
                    <div className="flex-1 flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                      <span 
                        className="text-muted-foreground hover:text-foreground cursor-ew-resize transition-colors"
                        onMouseDown={(e) => handleDragStart(e, 'marginRight', marginRight)}
                        title="Drag to adjust"
                      >
                        <MoveHorizontal className="w-3.5 h-3.5" />
                      </span>
                    <Input
                      type="number"
                        value={marginRight}
                        onChange={(e) => handleSpacingChange(e.target.value, 'marginRight')}
                        className="flex-1 text-sm border-0 p-0 h-6 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                      placeholder="0"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                    
                    {/* Bottom */}
                    <div className="flex-1 flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                      <span 
                        className="text-muted-foreground hover:text-foreground cursor-ew-resize transition-colors"
                        onMouseDown={(e) => handleDragStart(e, 'marginBottom', marginBottom)}
                        title="Drag to adjust"
                      >
                        <MoveHorizontal className="w-3.5 h-3.5 rotate-90" />
                      </span>
                      <Input
                        type="number"
                        value={marginBottom}
                        onChange={(e) => handleSpacingChange(e.target.value, 'marginBottom')}
                        className="flex-1 text-sm border-0 p-0 h-6 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                        placeholder="0"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
              </div>
                    
                    {/* Spacer */}
                    <div className="w-[42px]" />
            </div>
          </div>
              </div>
            </div>
            
            {/* Padding */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Padding</label>
              <div className="flex gap-2">
                {/* Left */}
                <div className="flex-1 flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                  <span 
                    className="text-muted-foreground hover:text-foreground cursor-ew-resize transition-colors"
                    onMouseDown={(e) => handleDragStart(e, 'paddingLeft', paddingLeft)}
                    title="Drag to adjust"
                  >
                    <MoveHorizontal className="w-3.5 h-3.5" />
                  </span>
                  <Input
                    type="number"
                    value={paddingLeft}
                    onChange={(e) => handleSpacingChange(e.target.value, 'paddingLeft')}
                    className="flex-1 text-sm border-0 p-0 h-6 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
                
                {/* Top */}
                <div className="flex-1 flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                  <span 
                    className="text-muted-foreground hover:text-foreground cursor-ew-resize transition-colors"
                    onMouseDown={(e) => handleDragStart(e, 'paddingTop', paddingTop)}
                    title="Drag to adjust"
                  >
                    <MoveVertical className="w-3.5 h-3.5" />
                  </span>
                  <Input
                    type="number"
                    value={paddingTop}
                    onChange={(e) => handleSpacingChange(e.target.value, 'paddingTop')}
                    className="flex-1 text-sm border-0 p-0 h-6 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
                
                {/* Expand button */}
                  <button
                  onClick={() => setPaddingExpanded(!paddingExpanded)}
                  className={`px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
                    paddingExpanded 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card border-border hover:border-foreground text-foreground'
                    }`}
                  title="Individual sides"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${paddingExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
                  </svg>
                  </button>
              </div>
              
              {/* Expanded view */}
              <div 
                className={`grid transition-all duration-200 ease-in-out ${
                  paddingExpanded 
                    ? 'grid-rows-[1fr] opacity-100' 
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex gap-2 pt-2">
                    {/* Right */}
                    <div className="flex-1 flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                      <span 
                        className="text-muted-foreground hover:text-foreground cursor-ew-resize transition-colors"
                        onMouseDown={(e) => handleDragStart(e, 'paddingRight', paddingRight)}
                        title="Drag to adjust"
                      >
                        <MoveHorizontal className="w-3.5 h-3.5" />
                      </span>
                      <Input
                        type="number"
                        value={paddingRight}
                        onChange={(e) => handleSpacingChange(e.target.value, 'paddingRight')}
                        className="flex-1 text-sm border-0 p-0 h-6 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                        placeholder="0"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
            </div>

                    {/* Bottom */}
                    <div className="flex-1 flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                      <span 
                        className="text-muted-foreground hover:text-foreground cursor-ew-resize transition-colors"
                        onMouseDown={(e) => handleDragStart(e, 'paddingBottom', paddingBottom)}
                        title="Drag to adjust"
                      >
                        <MoveVertical className="w-3.5 h-3.5" />
                      </span>
                      <Input
                        type="number"
                        value={paddingBottom}
                        onChange={(e) => handleSpacingChange(e.target.value, 'paddingBottom')}
                        className="flex-1 text-sm border-0 p-0 h-6 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                        placeholder="0"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                    
                    {/* Spacer */}
                    <div className="w-[42px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BORDERS */}
        {componentProperties.canEditBorders && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Border</h3>
            
            {/* Row 1: Border Width + Border Style */}
            <div className="grid grid-cols-2 gap-3">
            {/* Border Width */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Border width</label>
                <div className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1.5">
                <Input
                  type="number"
                  value={parseInt(borderWidth || '0')}
                  onChange={(e) => handleBorderChange('borderWidth', e.target.value + 'px')}
                    className="flex-1 text-sm border-0 p-0 h-6 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="10"
                    placeholder="0"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            </div>

            {/* Border Style */}
            <div className="space-y-2">
              <label className="block text-xs text-muted-foreground">Border style</label>
                <div className="flex gap-1">
                {['solid', 'dashed', 'dotted'].map(style => (
                  <button
                    key={style}
                      onClick={() => {
                        // Toggle: if clicking the same style, reset to 'none'
                        if (borderStyle === style) {
                          handleBorderChange('borderStyle', 'none');
                        } else {
                          handleBorderChange('borderStyle', style);
                        }
                      }}
                      className={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
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

            {/* Row 2: Border Radius - Keep as single row (common presets) */}
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
