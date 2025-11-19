/**
 * Component Descriptor System for React Email V2
 * 
 * Maps React Email component types to their editable properties
 * Provides metadata for the visual editing interface
 */

import type { ComponentType } from './types';
import { COMPONENT_PROP_DOCS } from './components/registry';

/**
 * Property types for editing
 */
export type PropertyType = 
  | 'text'
  | 'textarea'
  | 'url'
  | 'color'
  | 'fontSize'
  | 'fontWeight'
  | 'alignment'
  | 'padding'
  | 'margin'
  | 'number'
  | 'select'
  | 'borderRadius';

/**
 * Property category for organizing UI
 */
export type PropertyCategory = 'content' | 'style' | 'spacing';

/**
 * Editable property definition
 */
export interface EditableProperty {
  key: string;
  label: string;
  type: PropertyType;
  category: PropertyCategory;
  options?: string[]; // For select type
  defaultValue?: any;
}

/**
 * Component descriptor for visual editing
 */
export interface ComponentDescriptor {
  componentType: ComponentType;
  displayName: string;
  icon: string;
  editableProperties: EditableProperty[];
  canHaveChildren: boolean;
  canDelete: boolean;
  requiresContent: boolean; // Has text content (for content button)
}

/**
 * Display names for components (user-friendly)
 */
export const COMPONENT_DISPLAY_NAMES: Record<ComponentType, string> = {
  // Layout components
  Html: 'HTML Root',
  Head: 'Head',
  Body: 'Body',
  Container: 'Container',
  Section: 'Section',
  Row: 'Row',
  Column: 'Column',
  // Content components
  Text: 'Text Block',
  Heading: 'Heading',
  Button: 'Button',
  Link: 'Link',
  Img: 'Image',
  Hr: 'Divider',
  // Advanced components
  CodeBlock: 'Code Block',
  CodeInline: 'Inline Code',
  Font: 'Font',
  Markdown: 'Markdown',
  Preview: 'Preview Text',
  Tailwind: 'Tailwind Wrapper',
};

/**
 * Icons for components (emoji for quick implementation)
 */
export const COMPONENT_ICONS: Record<ComponentType, string> = {
  Html: '📄',
  Head: '📋',
  Body: '📃',
  Container: '📦',
  Section: '🔲',
  Row: '↔️',
  Column: '▯',
  Text: 'T',
  Heading: 'H',
  Button: '🔘',
  Link: '🔗',
  Img: '🖼️',
  Hr: '—',
  CodeBlock: '{}',
  CodeInline: '<>',
  Font: 'F',
  Markdown: 'M',
  Preview: '👁️',
  Tailwind: '🎨',
};

/**
 * Get editable properties for a component type
 */
export function getEditableProperties(componentType: ComponentType): EditableProperty[] {
  switch (componentType) {
    case 'Container':
      return [
        { key: 'style.backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'style.maxWidth', label: 'Max Width', type: 'text', category: 'spacing', defaultValue: '600px' },
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
        { key: 'style.margin', label: 'Margin', type: 'margin', category: 'spacing' },
        { key: 'style.borderRadius', label: 'Border Radius', type: 'borderRadius', category: 'style' },
      ];
    
    case 'Section':
      return [
        { key: 'style.backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
        { key: 'style.margin', label: 'Margin', type: 'margin', category: 'spacing' },
        { key: 'style.borderRadius', label: 'Border Radius', type: 'borderRadius', category: 'style' },
      ];
    
    case 'Row':
      return [
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
        { key: 'style.margin', label: 'Margin', type: 'margin', category: 'spacing' },
      ];
    
    case 'Column':
      return [
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
        { key: 'style.margin', label: 'Margin', type: 'margin', category: 'spacing' },
        { key: 'style.verticalAlign', label: 'Vertical Align', type: 'select', category: 'style', options: ['top', 'middle', 'bottom'] },
        { key: 'style.width', label: 'Width', type: 'text', category: 'spacing' },
      ];
    
    case 'Body':
      return [
        { key: 'style.backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'style.fontFamily', label: 'Font Family', type: 'text', category: 'style' },
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
        { key: 'style.margin', label: 'Margin', type: 'margin', category: 'spacing' },
      ];
    
    case 'Heading':
      return [
        { key: 'content', label: 'Text Content', type: 'textarea', category: 'content' },
        { key: 'props.as', label: 'Heading Level', type: 'select', category: 'content', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
        { key: 'style.color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'style.fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'style.fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
        { key: 'style.textAlign', label: 'Text Align', type: 'alignment', category: 'style' },
        { key: 'style.lineHeight', label: 'Line Height', type: 'text', category: 'style' },
        { key: 'style.margin', label: 'Margin', type: 'margin', category: 'spacing' },
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
      ];
    
    case 'Text':
      return [
        { key: 'content', label: 'Text Content', type: 'textarea', category: 'content' },
        { key: 'style.color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'style.fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'style.fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
        { key: 'style.textAlign', label: 'Text Align', type: 'alignment', category: 'style' },
        { key: 'style.lineHeight', label: 'Line Height', type: 'text', category: 'style' },
        { key: 'style.margin', label: 'Margin', type: 'margin', category: 'spacing' },
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
      ];
    
    case 'Button':
      return [
        { key: 'content', label: 'Button Text', type: 'text', category: 'content' },
        { key: 'props.href', label: 'Link URL', type: 'url', category: 'content' },
        { key: 'props.target', label: 'Link Target', type: 'select', category: 'content', options: ['_self', '_blank'] },
        { key: 'style.backgroundColor', label: 'Button Color', type: 'color', category: 'style' },
        { key: 'style.color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'style.fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'style.fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
        { key: 'style.textAlign', label: 'Text Align', type: 'alignment', category: 'style' },
        { key: 'style.borderRadius', label: 'Border Radius', type: 'borderRadius', category: 'style' },
        { key: 'style.border', label: 'Border', type: 'text', category: 'style' },
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
      ];
    
    case 'Link':
      return [
        { key: 'content', label: 'Link Text', type: 'text', category: 'content' },
        { key: 'props.href', label: 'Link URL', type: 'url', category: 'content' },
        { key: 'props.target', label: 'Link Target', type: 'select', category: 'content', options: ['_self', '_blank'] },
        { key: 'style.color', label: 'Link Color', type: 'color', category: 'style' },
        { key: 'style.textDecoration', label: 'Text Decoration', type: 'select', category: 'style', options: ['none', 'underline'] },
        { key: 'style.fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'style.fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
      ];
    
    case 'Img':
      return [
        { key: 'props.src', label: 'Image URL', type: 'url', category: 'content' },
        { key: 'props.alt', label: 'Alt Text', type: 'text', category: 'content' },
        { key: 'props.width', label: 'Width', type: 'number', category: 'spacing' },
        { key: 'props.height', label: 'Height', type: 'number', category: 'spacing' },
        { key: 'style.borderRadius', label: 'Border Radius', type: 'borderRadius', category: 'style' },
        { key: 'style.display', label: 'Display', type: 'select', category: 'style', options: ['block', 'inline-block'] },
        { key: 'style.margin', label: 'Margin', type: 'margin', category: 'spacing' },
        { key: 'style.maxWidth', label: 'Max Width', type: 'text', category: 'spacing' },
      ];
    
    case 'Hr':
      return [
        { key: 'style.borderColor', label: 'Line Color', type: 'color', category: 'style' },
        { key: 'style.borderWidth', label: 'Thickness', type: 'number', category: 'style' },
        { key: 'style.borderStyle', label: 'Line Style', type: 'select', category: 'style', options: ['solid', 'dashed', 'dotted'] },
        { key: 'style.margin', label: 'Margin', type: 'margin', category: 'spacing' },
      ];
    
    case 'CodeBlock':
      return [
        { key: 'props.code', label: 'Code Content', type: 'textarea', category: 'content' },
        { key: 'props.language', label: 'Language', type: 'text', category: 'content' },
        { key: 'style.backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
        { key: 'style.borderRadius', label: 'Border Radius', type: 'borderRadius', category: 'style' },
        { key: 'style.fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
      ];
    
    case 'CodeInline':
      return [
        { key: 'content', label: 'Code', type: 'text', category: 'content' },
        { key: 'style.backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'style.color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'style.padding', label: 'Padding', type: 'padding', category: 'spacing' },
        { key: 'style.borderRadius', label: 'Border Radius', type: 'borderRadius', category: 'style' },
        { key: 'style.fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
      ];
    
    case 'Markdown':
      return [
        { key: 'content', label: 'Markdown Content', type: 'textarea', category: 'content' },
      ];
    
    case 'Preview':
      return [
        { key: 'content', label: 'Preview Text', type: 'text', category: 'content' },
      ];
    
    default:
      return [];
  }
}

/**
 * Get component descriptor with all metadata
 */
export function getComponentDescriptor(componentType: ComponentType): ComponentDescriptor {
  const propDocs = COMPONENT_PROP_DOCS[componentType];
  const editableProperties = getEditableProperties(componentType);
  
  // Determine if component can have children
  const canHaveChildren = [
    'Html', 'Head', 'Body', 'Container', 'Section', 'Row', 'Column',
    'Button', 'Link', 'Font', 'Tailwind', 'Markdown'
  ].includes(componentType);
  
  // Determine if component requires content (has text/code content)
  const requiresContent = [
    'Text', 'Heading', 'Button', 'Link', 'CodeInline', 'Markdown', 'Preview'
  ].includes(componentType);
  
  // Root elements shouldn't be deletable
  const canDelete = !['Html', 'Head', 'Body'].includes(componentType);
  
  return {
    componentType,
    displayName: COMPONENT_DISPLAY_NAMES[componentType],
    icon: COMPONENT_ICONS[componentType],
    editableProperties,
    canHaveChildren,
    canDelete,
    requiresContent,
  };
}

/**
 * Get properties by category
 */
export function getPropertiesByCategory(
  componentType: ComponentType,
  category: PropertyCategory
): EditableProperty[] {
  return getEditableProperties(componentType).filter(prop => prop.category === category);
}

/**
 * Check if component has content properties
 */
export function hasContentProperties(componentType: ComponentType): boolean {
  return getPropertiesByCategory(componentType, 'content').length > 0;
}

/**
 * Check if component has style properties
 */
export function hasStyleProperties(componentType: ComponentType): boolean {
  return getPropertiesByCategory(componentType, 'style').length > 0;
}

/**
 * Check if component has spacing properties
 */
export function hasSpacingProperties(componentType: ComponentType): boolean {
  return getPropertiesByCategory(componentType, 'spacing').length > 0;
}

