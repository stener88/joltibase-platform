/**
 * V2 Element Descriptor Types
 * 
 * Lightweight types for V2 visual editing
 * (Replaces the V1 lib/email/visual-edits/element-descriptor)
 */

export interface ElementDescriptor {
  blockId: string;
  elementId: string;
  elementType: string;
  contentPath?: string;
  editableProperties?: string[];
  currentValue?: any;
  currentSettings?: any;
}

export type DeleteBehavior = 'deletable' | 'not-deletable';

export interface DeleteBehaviorResult {
  behavior: DeleteBehavior;
  tooltip: string;
}

/**
 * Get delete behavior for a component
 */
export function getDeleteBehavior(
  elementType: string,
  elementId: string
): DeleteBehaviorResult {
  // All V2 components are deletable
  return {
    behavior: 'deletable',
    tooltip: 'Delete component',
  };
}

/**
 * Get editable style properties for a component type
 */
export function getStyleProperties(elementType: string): string[] {
  // Return common style properties for all components
  return ['color', 'backgroundColor', 'fontSize', 'fontWeight', 'fontFamily', 'textAlign'];
}

/**
 * Get editable content properties for a component type
 */
export function getContentProperties(elementType: string): string[] {
  // Return common content properties
  return ['text', 'content', 'href', 'src', 'alt'];
}

/**
 * Get editable spacing properties for a component type
 */
export function getSpacingProperties(elementType: string): string[] {
  // Return common spacing properties
  return ['padding', 'margin', 'gap'];
}

