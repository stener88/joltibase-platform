/**
 * Element Descriptor System
 * 
 * Maps element types to their editable properties and provides
 * metadata for the visual editing interface.
 */

export type ElementType = 
  | 'block'           // Entire block selection
  | 'title'
  | 'header'
  | 'paragraph'
  | 'text'
  | 'button'
  | 'image'
  | 'divider'
  | 'logo'
  | 'spacer'
  | 'social-link'
  | 'footer-text'
  | 'footer-link'
  | 'stat-value'
  | 'stat-title'
  | 'stat-description'
  | 'subtitle'
  | 'badge';

export interface EditableProperty {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'color' | 'fontSize' | 'fontWeight' | 'alignment' | 'padding' | 'number';
  category: 'content' | 'style' | 'spacing';
}

export interface ElementDescriptor {
  elementId: string;
  blockId: string;
  elementType: ElementType;
  contentPath: string;
  settingsPath?: string;
  editableProperties: EditableProperty[];
  currentValue: Record<string, unknown>;
  currentSettings: Record<string, unknown>;
}

/**
 * Get editable properties for an element type
 */
export function getEditableProperties(elementType: ElementType): EditableProperty[] {
  switch (elementType) {
    case 'block':
      // Block-level selection - edit block-wide settings
      return [
        { key: 'backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'padding', label: 'Padding', type: 'padding', category: 'spacing' },
      ];
    
    case 'title':
    case 'header':
    case 'paragraph':
      return [
        { key: 'text', label: 'Text Content', type: 'textarea', category: 'content' },
        { key: 'color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
        { key: 'align', label: 'Alignment', type: 'alignment', category: 'style' },
      ];
    
    case 'text':
      return [
        { key: 'text', label: 'Text Content', type: 'textarea', category: 'content' },
        { key: 'color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
        { key: 'align', label: 'Alignment', type: 'alignment', category: 'style' },
        { key: 'lineHeight', label: 'Line Height', type: 'text', category: 'style' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'padding', label: 'Padding', type: 'padding', category: 'spacing' },
      ];
    
    case 'button':
      return [
        { key: 'text', label: 'Button Text', type: 'text', category: 'content' },
        { key: 'url', label: 'Link URL', type: 'url', category: 'content' },
        { key: 'backgroundColor', label: 'Button Color', type: 'color', category: 'style' },
        { key: 'textColor', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
        { key: 'borderRadius', label: 'Border Radius', type: 'text', category: 'style' },
        { key: 'padding', label: 'Padding', type: 'padding', category: 'spacing' },
      ];
    
    case 'image':
      return [
        { key: 'imageUrl', label: 'Image URL', type: 'url', category: 'content' },
        { key: 'altText', label: 'Alt Text', type: 'text', category: 'content' },
        { key: 'linkUrl', label: 'Link URL', type: 'url', category: 'content' },
        { key: 'borderRadius', label: 'Border Radius', type: 'text', category: 'style' },
        { key: 'align', label: 'Alignment', type: 'alignment', category: 'style' },
        { key: 'width', label: 'Width', type: 'text', category: 'spacing' },
        { key: 'height', label: 'Height', type: 'text', category: 'spacing' },
        { key: 'padding', label: 'Padding', type: 'padding', category: 'spacing' },
      ];
    
    case 'logo':
      return [
        { key: 'imageUrl', label: 'Logo URL', type: 'url', category: 'content' },
        { key: 'altText', label: 'Alt Text', type: 'text', category: 'content' },
        { key: 'linkUrl', label: 'Link URL', type: 'url', category: 'content' },
        { key: 'align', label: 'Alignment', type: 'alignment', category: 'style' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'width', label: 'Width', type: 'text', category: 'spacing' },
        { key: 'height', label: 'Height', type: 'text', category: 'spacing' },
        { key: 'padding', label: 'Padding', type: 'padding', category: 'spacing' },
      ];
    
    case 'spacer':
      return [
        { key: 'backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'height', label: 'Height', type: 'number', category: 'spacing' },
      ];
    
    case 'divider':
      return [
        { key: 'color', label: 'Line Color', type: 'color', category: 'style' },
        { key: 'align', label: 'Alignment', type: 'alignment', category: 'style' },
        { key: 'thickness', label: 'Thickness', type: 'number', category: 'spacing' },
        { key: 'width', label: 'Width', type: 'text', category: 'spacing' },
        { key: 'padding', label: 'Padding', type: 'padding', category: 'spacing' },
      ];
    
    case 'social-link':
      return [
        { key: 'url', label: 'Link URL', type: 'url', category: 'content' },
        { key: 'platform', label: 'Platform', type: 'text', category: 'content' },
      ];
    
    case 'footer-text':
      return [
        { key: 'text', label: 'Text Content', type: 'textarea', category: 'content' },
        { key: 'color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
      ];
    
    case 'footer-link':
      return [
        { key: 'text', label: 'Link Text', type: 'text', category: 'content' },
        { key: 'url', label: 'Link URL', type: 'url', category: 'content' },
        { key: 'color', label: 'Link Color', type: 'color', category: 'style' },
      ];
    
    case 'stat-value':
      return [
        { key: 'value', label: 'Value', type: 'text', category: 'content' },
        { key: 'color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
      ];
    
    case 'stat-title':
      return [
        { key: 'title', label: 'Title', type: 'text', category: 'content' },
        { key: 'color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
      ];
    
    case 'stat-description':
      return [
        { key: 'description', label: 'Description', type: 'textarea', category: 'content' },
        { key: 'color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
      ];
    
    case 'subtitle':
      return [
        { key: 'text', label: 'Subtitle Text', type: 'textarea', category: 'content' },
        { key: 'color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
        { key: 'fontWeight', label: 'Font Weight', type: 'fontWeight', category: 'style' },
      ];
    
    case 'badge':
      return [
        { key: 'text', label: 'Badge Text', type: 'text', category: 'content' },
        { key: 'color', label: 'Text Color', type: 'color', category: 'style' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color', category: 'style' },
        { key: 'fontSize', label: 'Font Size', type: 'fontSize', category: 'style' },
      ];
    
    default:
      return [];
  }
}

/**
 * Parse element ID to extract block ID and content key
 * Format: "{blockId}-{contentKey}"
 */
export function parseElementId(elementId: string): { blockId: string; contentKey: string } | null {
  const parts = elementId.split('-');
  if (parts.length < 2) {
    return null;
  }
  
  // Last part is content key, everything before is block ID
  const contentKey = parts[parts.length - 1];
  const blockId = parts.slice(0, -1).join('-');
  
  return { blockId, contentKey };
}

/**
 * Create element descriptor from data attributes
 */
export function createElementDescriptor(
  elementId: string,
  elementType: ElementType,
  blockId: string,
  currentValue: Record<string, unknown> = {},
  currentSettings: Record<string, unknown> = {}
): ElementDescriptor {
  const parsed = parseElementId(elementId);
  const contentKey = parsed?.contentKey || elementType;
  
  // Determine content path based on element type
  const contentPath = ['title', 'header', 'paragraph', 'text', 'button'].includes(elementType)
    ? `content.${contentKey}`
    : elementType === 'image' || elementType === 'logo'
    ? 'content'
    : 'settings';
  
  return {
    elementId,
    blockId,
    elementType,
    contentPath,
    settingsPath: 'settings',
    editableProperties: getEditableProperties(elementType),
    currentValue,
    currentSettings,
  };
}

/**
 * Get content properties (properties that modify content)
 */
export function getContentProperties(elementType: ElementType): EditableProperty[] {
  return getEditableProperties(elementType).filter(prop => prop.category === 'content');
}

/**
 * Get style properties (properties that modify styles)
 */
export function getStyleProperties(elementType: ElementType): EditableProperty[] {
  return getEditableProperties(elementType).filter(prop => prop.category === 'style');
}

/**
 * Get spacing properties (properties that modify layout/spacing)
 */
export function getSpacingProperties(elementType: ElementType): EditableProperty[] {
  return getEditableProperties(elementType).filter(prop => prop.category === 'spacing');
}

/**
 * Delete Behavior Types
 */
export type DeleteBehavior = 
  | 'delete-block'      // Delete entire block (simple blocks)
  | 'clear-content'     // Clear content only (layout elements)
  | 'remove-item'       // Remove from array (collection items)
  | 'not-deletable';    // Cannot be deleted (required footer elements)

/**
 * Determine delete behavior for an element type
 */
export function getDeleteBehavior(elementType: ElementType, elementId: string): {
  behavior: DeleteBehavior;
  tooltip: string;
} {
  // Block-level selection - always delete entire block
  if (elementType === 'block') {
    return {
      behavior: 'delete-block',
      tooltip: 'Delete Block',
    };
  }
  
  // Simple blocks - entire block can be deleted
  if (['text', 'button', 'image', 'logo', 'spacer', 'divider'].includes(elementType)) {
    return {
      behavior: 'delete-block',
      tooltip: 'Delete Block',
    };
  }
  
  // Collection items - remove from array
  if (elementType === 'social-link') {
    return {
      behavior: 'remove-item',
      tooltip: 'Remove Link',
    };
  }
  
  // Stat items - remove from stats array
  if (['stat-value', 'stat-title', 'stat-description'].includes(elementType)) {
    return {
      behavior: 'remove-item',
      tooltip: 'Remove Stat Item',
    };
  }
  
  // Footer optional elements - can clear content
  if (elementType === 'footer-text' || elementType === 'footer-link') {
    // Check if it's a required field by element ID
    const requiredFields = ['companyName', 'companyAddress', 'unsubscribe', 'preferences'];
    const isRequired = requiredFields.some(field => elementId.includes(field));
    
    if (isRequired) {
      return {
        behavior: 'not-deletable',
        tooltip: 'Required Field',
      };
    }
    
    return {
      behavior: 'clear-content',
      tooltip: 'Clear Content',
    };
  }
  
  // Layout elements (title, header, paragraph, button in layouts) - clear content only
  if (['title', 'header', 'paragraph', 'subtitle', 'badge'].includes(elementType)) {
    return {
      behavior: 'clear-content',
      tooltip: 'Clear Content',
    };
  }
  
  // Button in layout - can clear text but keep structure
  if (elementType === 'button') {
    // If it's part of a layout (has parent layout variation), clear content
    // Otherwise it's a simple button block, delete it
    // This is determined by checking if elementId has more than 2 parts
    const parts = elementId.split('-');
    if (parts.length > 2) {
      return {
        behavior: 'clear-content',
        tooltip: 'Clear Button Text',
      };
    }
    return {
      behavior: 'delete-block',
      tooltip: 'Delete Block',
    };
  }
  
  // Default to clear content for safety
  return {
    behavior: 'clear-content',
    tooltip: 'Clear Content',
  };
}

/**
 * Check if an element type represents a simple block
 */
export function isSimpleBlock(elementType: ElementType): boolean {
  return ['text', 'button', 'image', 'logo', 'spacer', 'divider'].includes(elementType);
}

/**
 * Check if an element is a collection item
 */
export function isCollectionItem(elementType: ElementType): boolean {
  return elementType === 'social-link' || 
         ['stat-value', 'stat-title', 'stat-description'].includes(elementType);
}

/**
 * Extract array index from element ID for collection items
 * Format: "{blockId}-stat0-value" or "{blockId}-social-0"
 */
export function extractArrayIndex(elementId: string, elementType: ElementType): number | null {
  if (elementType === 'social-link') {
    // Format: blockId-social-0, blockId-social-1
    const match = elementId.match(/-social-(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }
  
  if (['stat-value', 'stat-title', 'stat-description'].includes(elementType)) {
    // Format: blockId-stat0-value, blockId-stat1-title
    const match = elementId.match(/-stat(\d+)-/);
    return match ? parseInt(match[1], 10) : null;
  }
  
  return null;
}

