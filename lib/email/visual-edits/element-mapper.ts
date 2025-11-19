/**
 * Element Mapper
 * 
 * Maps HTML elements with data attributes to their corresponding block data.
 * Enables bidirectional mapping between visual elements and block structure.
 */

import { EmailBlock } from '../blocks/types';
import { ElementDescriptor, ElementType, createElementDescriptor, parseElementId, getEditableProperties } from './element-descriptor';

/**
 * Extract element metadata from DOM element data attributes
 */
export function extractElementMetadata(element: HTMLElement): {
  elementId: string;
  elementType: ElementType;
  blockId: string;
} | null {
  const elementId = element.getAttribute('data-element-id');
  const elementType = element.getAttribute('data-element-type') as ElementType;
  const blockId = element.getAttribute('data-block-id');
  
  if (!elementId || !elementType || !blockId) {
    return null;
  }
  
  return { elementId, elementType, blockId };
}

/**
 * Find block by ID in blocks array
 */
export function findBlockById(blocks: EmailBlock[], blockId: string): EmailBlock | null {
  return blocks.find(block => block.id === blockId) || null;
}

/**
 * Get element value from block
 * Handles nested paths like "content.title" or "content.button.text"
 */
export function getElementValue(block: EmailBlock, path: string): any {
  const parts = path.split('.');
  let value: any = block;
  
  for (const part of parts) {
    if (value && typeof value === 'object') {
      value = value[part];
    } else {
      return undefined;
    }
  }
  
  return value;
}

/**
 * Set element value in block (immutable)
 * Returns a new block object with the updated value
 */
export function setElementValue(block: EmailBlock, path: string, value: any): EmailBlock {
  const parts = path.split('.');
  
  // Deep clone block (10x faster than JSON.parse/stringify)
  const newBlock = structuredClone(block);
  
  // Navigate to parent and set value
  let current: any = newBlock;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  
  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
  
  return newBlock;
}

/**
 * Create element descriptor from DOM element
 */
export function createDescriptorFromElement(element: HTMLElement, blocks: EmailBlock[]): ElementDescriptor | null {
  const metadata = extractElementMetadata(element);
  if (!metadata) {
    return null;
  }
  
  const { elementId, elementType, blockId } = metadata;
  return createDescriptorFromMetadata(elementId, elementType, blockId, blocks);
}

/**
 * Create element descriptor from metadata (without needing DOM element)
 * Useful for reconstructing descriptors from pending changes
 */
export function createDescriptorFromMetadata(
  elementId: string,
  elementType: string,
  blockId: string,
  blocks: EmailBlock[]
): ElementDescriptor | null {
  const block = findBlockById(blocks, blockId);
  
  if (!block) {
    return null;
  }
  
  // Get current value and settings from block
  const parsed = parseElementId(elementId);
  const contentKey = parsed?.contentKey || elementType;
  
  // Extract current content value based on element type
  const rawContentValue = [
    'title', 'header', 'paragraph', 'text', 'button', 'subtitle', 'badge',
    'stat-value', 'stat-title', 'stat-description', 'leftColumn', 'rightColumn'
  ].includes(elementType)
    ? getElementValue(block, `content.${contentKey}`) || {}
    : elementType === 'image' || elementType === 'logo'
    ? getElementValue(block, 'content') || {}
    : elementType === 'social-link'
    ? getElementValue(block, `content.links.${contentKey.replace('social-', '')}`) || {}
    : elementType === 'footer-text' || elementType === 'footer-link'
    ? getElementValue(block, `content.${contentKey}`) || {}
    : {};
  
  // Flatten the content value to make properties directly accessible
  let flattenedValue: Record<string, any> = {};
  
  // For text-based elements, handle both string and object formats
  if (['title', 'header', 'paragraph', 'text', 'subtitle', 'badge', 'stat-value', 'stat-title', 'stat-description'].includes(elementType)) {
    if (typeof rawContentValue === 'string') {
      // Direct string value (older format or simple blocks)
      flattenedValue.text = rawContentValue;
    } else if (rawContentValue && typeof rawContentValue === 'object') {
      // Object format - spread to flatten (handles {text: "...", color: "...", etc})
      flattenedValue = { ...rawContentValue };
    }
  } else if (elementType === 'button') {
    // Buttons are always objects with text, url, and optional style properties
    flattenedValue = { ...rawContentValue };
  } else if (elementType === 'image' || elementType === 'logo') {
    // Images have nested structure
    flattenedValue = { ...rawContentValue };
  } else {
    // Default: use as-is
    flattenedValue = rawContentValue;
  }
  
  // Extract current settings - merge block.settings with content-level properties
  // Content-level style properties (like titleContent.fontSize) override settings-level (like settings.titleFontSize)
  const blockSettings = block.settings || {};
  
  // Get editable property keys for this element type to filter settings
  const editableProps = getEditableProperties(elementType as ElementType);
  const editableKeys = editableProps.map(p => p.key);
  
  // Filter block settings to only include properties relevant to this element
  // This prevents block-level settings (like buttonColor, titleColor) from polluting element descriptors
  const currentSettings: Record<string, any> = {};
  Object.keys(blockSettings).forEach(key => {
    if (editableKeys.includes(key)) {
      currentSettings[key] = blockSettings[key];
    }
  });
  
  // Cast elementType to ElementType for the descriptor
  return createElementDescriptor(elementId, elementType as ElementType, blockId, flattenedValue, currentSettings);
}

/**
 * Get element current value from blocks
 */
export function getElementCurrentValue(
  descriptor: ElementDescriptor,
  blocks: EmailBlock[]
): Record<string, any> {
  const block = findBlockById(blocks, descriptor.blockId);
  if (!block) {
    return {};
  }
  
  const result: Record<string, any> = {};
  
  for (const prop of descriptor.editableProperties) {
    const path = prop.category === 'content' 
      ? `${descriptor.contentPath.includes('.') ? descriptor.contentPath.split('.')[0] : descriptor.contentPath}.${prop.key}`
      : `settings.${prop.key}`;
    
    const value = getElementValue(block, path);
    if (value !== undefined) {
      result[prop.key] = value;
    }
  }
  
  return result;
}

/**
 * Apply element changes to block
 */
export function applyElementChanges(
  block: EmailBlock,
  descriptor: ElementDescriptor,
  changes: Record<string, any>
): EmailBlock {
  let updatedBlock = { ...block };
  
  for (const [key, value] of Object.entries(changes)) {
    const property = descriptor.editableProperties.find(p => p.key === key);
    if (!property) {
      continue;
    }
    
    // Determine the correct path for the change
    let path: string;
    
    if (property.category === 'content') {
      // Check if the current value at contentPath is a string or object
      const currentValue = getElementValue(updatedBlock, descriptor.contentPath);
      
      if (typeof currentValue === 'string') {
        // Content is a direct string value (e.g., block.content.text = "string")
        // Path should be just the contentPath itself
        path = descriptor.contentPath;
      } else if (currentValue && typeof currentValue === 'object') {
        // Content is an object with properties (e.g., block.content.title = { text: "...", color: "..." })
        // Need to append the property key
        path = `${descriptor.contentPath}.${key}`;
      } else {
        // Content doesn't exist yet, append the key
        path = `${descriptor.contentPath}.${key}`;
      }
    } else {
      // Style and spacing properties:
      // For layout elements (title, paragraph, etc.), style properties are stored IN the content object
      // For simple blocks and block-level properties, they go in settings
      const isLayoutElement = ['title', 'header', 'paragraph', 'subtitle', 'badge', 'stat-value', 'stat-title', 'stat-description'].includes(descriptor.elementType);
      
      // Check if this is a button inside a layout (not a simple button block)
      // Layout buttons have elementIds with more than 2 parts (e.g., "blockId-button" = 2 parts for simple, "blockId-hero-button" = 3+ parts for layout)
      const isLayoutButton = descriptor.elementType === 'button' && descriptor.elementId.split('-').length > 2;
      
      const isStyleProperty = property.category === 'style';
      
      if ((isLayoutElement || isLayoutButton) && isStyleProperty) {
        // Layout element style properties go in the content object
        // e.g., content.title.color, content.paragraph.fontSize, content.button.textColor
        
        // Check if content is currently a string - if so, convert to object first
        const currentValue = getElementValue(updatedBlock, descriptor.contentPath);
        if (typeof currentValue === 'string') {
          // Convert string to object format: "text" -> { text: "text" }
          updatedBlock = setElementValue(updatedBlock, descriptor.contentPath, { text: currentValue });
        }
        
        path = `${descriptor.contentPath}.${key}`;
      } else {
        // Block-level or simple block properties go in settings
        // e.g., settings.padding, settings.backgroundColor (for block-level)
        path = `settings.${key}`;
      }
    }
    
    updatedBlock = setElementValue(updatedBlock, path, value);
  }
  
  return updatedBlock;
}

/**
 * Find parent block of an element
 */
export function findParentBlock(element: HTMLElement, blocks: EmailBlock[]): EmailBlock | null {
  const metadata = extractElementMetadata(element);
  if (!metadata) {
    return null;
  }
  
  return findBlockById(blocks, metadata.blockId);
}

/**
 * Delete operation result
 */
export interface DeleteResult {
  success: boolean;
  updatedBlocks?: EmailBlock[];
  error?: string;
}

/**
 * Delete an element based on its type and context
 */
export function deleteElement(
  blocks: EmailBlock[],
  descriptor: ElementDescriptor
): DeleteResult {
  const { getDeleteBehavior, extractArrayIndex } = require('./element-descriptor');
  const { behavior } = getDeleteBehavior(descriptor.elementType, descriptor.elementId);
  
  switch (behavior) {
    case 'delete-block':
      return deleteBlock(blocks, descriptor.blockId);
    
    case 'clear-content':
      return clearElementContent(blocks, descriptor);
    
    case 'remove-item':
      return removeArrayItem(blocks, descriptor);
    
    case 'not-deletable':
      return {
        success: false,
        error: 'This element cannot be deleted as it is required.',
      };
    
    default:
      return {
        success: false,
        error: 'Unknown delete behavior.',
      };
  }
}

/**
 * Delete entire block from blocks array
 */
function deleteBlock(blocks: EmailBlock[], blockId: string): DeleteResult {
  const blockIndex = blocks.findIndex(b => b.id === blockId);
  
  if (blockIndex === -1) {
    return {
      success: false,
      error: 'Block not found.',
    };
  }
  
  const updatedBlocks = [...blocks];
  updatedBlocks.splice(blockIndex, 1);
  
  // Re-index positions
  updatedBlocks.forEach((block, index) => {
    block.position = index;
  });
  
  return {
    success: true,
    updatedBlocks,
  };
}

/**
 * Clear content of an element (set to empty string or default)
 */
function clearElementContent(blocks: EmailBlock[], descriptor: ElementDescriptor): DeleteResult {
  const block = findBlockById(blocks, descriptor.blockId);
  
  if (!block) {
    return {
      success: false,
      error: 'Block not found.',
    };
  }
  
  // Determine which content field to clear
  const parsed = require('./element-descriptor').parseElementId(descriptor.elementId);
  const contentKey = parsed?.contentKey || descriptor.elementType;
  
  let updatedBlock = { ...block };
  
  // Check current value to determine if it's a string or object
  const currentValue = getElementValue(updatedBlock, `content.${contentKey}`);
  
  // Clear the appropriate content field based on current structure
  if (['title', 'header', 'paragraph', 'text', 'subtitle', 'badge'].includes(descriptor.elementType)) {
    // Check if the value is already a string or an object with .text property
    if (typeof currentValue === 'string') {
      // Direct string value - set to empty string
      updatedBlock = setElementValue(updatedBlock, `content.${contentKey}`, '');
    } else if (currentValue && typeof currentValue === 'object' && 'text' in currentValue) {
      // Object with text property - clear the text
      updatedBlock = setElementValue(updatedBlock, `content.${contentKey}.text`, '');
    } else {
      // Unknown structure - try setting direct path to empty string
      updatedBlock = setElementValue(updatedBlock, `content.${contentKey}`, '');
    }
  } else if (descriptor.elementType === 'button') {
    // Buttons are always objects with .text property
    updatedBlock = setElementValue(updatedBlock, `content.${contentKey}.text`, '');
  } else if (descriptor.elementType === 'footer-text') {
    updatedBlock = setElementValue(updatedBlock, `content.${contentKey}`, '');
  }
  
  // Check if this is a layout block and if it's now completely empty
  if (updatedBlock.type === 'layouts') {
    const content = updatedBlock.content;
    const isEmpty = isLayoutBlockEmpty(content);
    
    // If layout is completely empty, delete the entire block instead
    if (isEmpty) {
      return deleteBlock(blocks, descriptor.blockId);
    }
  }
  
  const blockIndex = blocks.findIndex(b => b.id === descriptor.blockId);
  const updatedBlocks = [...blocks];
  updatedBlocks[blockIndex] = updatedBlock;
  
  return {
    success: true,
    updatedBlocks,
  };
}

/**
 * Check if a layout block's content is completely empty
 */
function isLayoutBlockEmpty(content: any): boolean {
  // Check common layout content fields
  const hasTitle = content.title && (typeof content.title === 'string' ? content.title : content.title.text);
  const hasHeader = content.header && (typeof content.header === 'string' ? content.header : content.header.text);
  const hasParagraph = content.paragraph && (typeof content.paragraph === 'string' ? content.paragraph : content.paragraph.text);
  const hasSubtitle = content.subtitle && (typeof content.subtitle === 'string' ? content.subtitle : content.subtitle.text);
  const hasBadge = content.badge && (typeof content.badge === 'string' ? content.badge : content.badge.text);
  const hasButton = content.button && content.button.text;
  const hasImage = content.image && content.image.url;
  const hasLeftColumn = content.leftColumn && (typeof content.leftColumn === 'string' ? content.leftColumn : content.leftColumn.text);
  const hasRightColumn = content.rightColumn && (typeof content.rightColumn === 'string' ? content.rightColumn : content.rightColumn.text);
  const hasStats = content.stats && Array.isArray(content.stats) && content.stats.length > 0;
  
  // Layout is empty if none of the content fields have values
  return !hasTitle && !hasHeader && !hasParagraph && !hasSubtitle && !hasBadge && 
         !hasButton && !hasImage && !hasLeftColumn && !hasRightColumn && !hasStats;
}

/**
 * Remove item from an array (stats, social links)
 */
function removeArrayItem(blocks: EmailBlock[], descriptor: ElementDescriptor): DeleteResult {
  const { extractArrayIndex } = require('./element-descriptor');
  const block = findBlockById(blocks, descriptor.blockId);
  
  if (!block) {
    return {
      success: false,
      error: 'Block not found.',
    };
  }
  
  const arrayIndex = extractArrayIndex(descriptor.elementId, descriptor.elementType);
  
  if (arrayIndex === null) {
    return {
      success: false,
      error: 'Could not determine array index.',
    };
  }
  
  let updatedBlock = { ...block };
  
  // Handle different collection types
  if (descriptor.elementType === 'social-link') {
    // Remove from social links array
    const links = block.content.links || [];
    if (arrayIndex >= 0 && arrayIndex < links.length) {
      const newLinks = [...links];
      newLinks.splice(arrayIndex, 1);
      updatedBlock = setElementValue(updatedBlock, 'content.links', newLinks);
    }
  } else if (['stat-value', 'stat-title', 'stat-description'].includes(descriptor.elementType)) {
    // Remove from stats array
    const stats = block.content.stats || [];
    if (arrayIndex >= 0 && arrayIndex < stats.length) {
      const newStats = [...stats];
      newStats.splice(arrayIndex, 1);
      updatedBlock = setElementValue(updatedBlock, 'content.stats', newStats);
    }
  }
  
  const blockIndex = blocks.findIndex(b => b.id === descriptor.blockId);
  const updatedBlocks = [...blocks];
  updatedBlocks[blockIndex] = updatedBlock;
  
  return {
    success: true,
    updatedBlocks,
  };
}

