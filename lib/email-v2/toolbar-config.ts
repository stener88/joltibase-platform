/**
 * Toolbar Configuration System
 * 
 * Defines which toolbar features are available for each component type
 * Customizes the FloatingToolbar based on component capabilities
 */

import type { ComponentType } from './types';
import {
  getComponentDescriptor,
  hasContentProperties,
  hasStyleProperties,
  hasSpacingProperties,
} from './component-descriptor';

/**
 * Toolbar configuration for a component type
 */
export interface ToolbarConfig {
  showAIInput: boolean;
  showContentButton: boolean;
  showStylesButton: boolean;
  showSpacingButton: boolean;
  showDeleteButton: boolean;
  aiPromptPlaceholder: string;
}

/**
 * Get toolbar configuration for a component type
 */
export function getToolbarConfig(componentType: ComponentType): ToolbarConfig {
  const descriptor = getComponentDescriptor(componentType);
  
  // Determine which buttons to show
  const showContentButton = hasContentProperties(componentType);
  const showStylesButton = hasStyleProperties(componentType);
  const showSpacingButton = hasSpacingProperties(componentType);
  const showDeleteButton = descriptor.canDelete;
  
  // Always show AI input for editable components
  const showAIInput = true;
  
  // Customize placeholder based on component type
  const aiPromptPlaceholder = getPlaceholder(componentType, descriptor.requiresContent);
  
  return {
    showAIInput,
    showContentButton,
    showStylesButton,
    showSpacingButton,
    showDeleteButton,
    aiPromptPlaceholder,
  };
}

/**
 * Get placeholder text for AI input based on component type
 */
function getPlaceholder(componentType: ComponentType, hasContent: boolean): string {
  // Specific placeholders for common components
  switch (componentType) {
    case 'Heading':
      return 'Edit heading text or style...';
    case 'Text':
      return 'Edit text content or formatting...';
    case 'Button':
      return 'Change button text, color, or link...';
    case 'Link':
      return 'Update link text or URL...';
    case 'Img':
      return 'Change image URL or styling...';
    case 'Container':
      return 'Adjust container width, padding, or background...';
    case 'Section':
      return 'Modify section spacing or background...';
    case 'Hr':
      return 'Change divider color or style...';
    default:
      if (hasContent) {
        return 'Edit content or styling...';
      }
      return 'Adjust styling and spacing...';
  }
}


