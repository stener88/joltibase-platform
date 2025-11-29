/**
 * TSX Manipulator for Direct Code Updates
 * 
 * Provides utilities to directly update TSX code for instant property changes
 * without requiring full AI regeneration.
 */

import type { ComponentMap } from './tsx-parser';

/**
 * Update text content of a component
 */
export function updateComponentText(
  tsxCode: string,
  componentMap: ComponentMap,
  componentId: string,
  newText: string
): string {
  const location = componentMap[componentId];
  if (!location) {
    console.warn(`[TSX-MANIPULATOR] Component ${componentId} not found in map`);
    return tsxCode;
  }
  
  const before = tsxCode.substring(0, location.startChar);
  const componentCode = tsxCode.substring(location.startChar, location.endChar);
  const after = tsxCode.substring(location.endChar);
  
  // Replace text content between > and <
  const updatedComponent = componentCode.replace(
    />([\s\S]*?)</,
    `>${newText}<`
  );
  
  console.log(`[TSX-MANIPULATOR] Updated text for ${componentId}`);
  
  return before + updatedComponent + after;
}

/**
 * Update inline style property or add to existing inline styles
 * Works with both Tailwind (className) and inline styles (style={{}})
 */
export function updateInlineStyle(
  tsxCode: string,
  componentMap: ComponentMap,
  componentId: string,
  styleProp: string,
  value: string
): string {
  const location = componentMap[componentId];
  if (!location) return tsxCode;
  
  const before = tsxCode.substring(0, location.startChar);
  const componentCode = tsxCode.substring(location.startChar, location.endChar);
  const after = tsxCode.substring(location.endChar);
  
  // Check if style attribute exists
  const styleMatch = componentCode.match(/style=\{\{([^}]+)\}\}/);
  
  let updatedComponent: string;
  
  if (styleMatch) {
    // Update existing inline style
    const existingStyles = styleMatch[1];
    
    // Check if property already exists
    const propRegex = new RegExp(`${styleProp}:\\s*['"][^'"]*['"]`);
    
    if (propRegex.test(existingStyles)) {
      // Update existing property
      const updatedStyles = existingStyles.replace(
        propRegex,
        `${styleProp}: '${value}'`
      );
      updatedComponent = componentCode.replace(
        /style=\{\{([^}]+)\}\}/,
        `style={{${updatedStyles}}}`
      );
    } else {
      // Add new property to existing styles
      const updatedStyles = existingStyles.trim().endsWith(',')
        ? `${existingStyles} ${styleProp}: '${value}'`
        : `${existingStyles}, ${styleProp}: '${value}'`;
      updatedComponent = componentCode.replace(
        /style=\{\{([^}]+)\}\}/,
        `style={{${updatedStyles}}}`
      );
    }
  } else {
    // No inline styles - add new style attribute
    // This will override any Tailwind classes for this property
    const tagMatch = componentCode.match(/<(\w+)([^>]*?)(\/?>)/);
    if (tagMatch) {
      const [fullTag, tagName, attributes, closingBracket] = tagMatch;
      const newTag = `<${tagName}${attributes} style={{ ${styleProp}: '${value}' }}${closingBracket}`;
      updatedComponent = componentCode.replace(fullTag, newTag);
    } else {
      updatedComponent = componentCode;
    }
  }
  
  console.log(`[TSX-MANIPULATOR] Updated ${styleProp} for ${componentId} to ${value} (inline style)`);
  
  return before + updatedComponent + after;
}

/**
 * Update Tailwind className
 */
export function updateClassName(
  tsxCode: string,
  componentMap: ComponentMap,
  componentId: string,
  newClassName: string
): string {
  const location = componentMap[componentId];
  if (!location) return tsxCode;
  
  const before = tsxCode.substring(0, location.startChar);
  const componentCode = tsxCode.substring(location.startChar, location.endChar);
  const after = tsxCode.substring(location.endChar);
  
  const classMatch = componentCode.match(/className=["']([^"']+)["']/);
  
  let updatedComponent: string;
  
  if (classMatch) {
    // Update existing className
    updatedComponent = componentCode.replace(
      /className=["']([^"']+)["']/,
      `className="${newClassName}"`
    );
  } else {
    // Add new className
    const tagMatch = componentCode.match(/<(\w+)([^>]*?)(\/?>)/);
    if (tagMatch) {
      const [fullTag, tagName, attributes, closingBracket] = tagMatch;
      const newTag = `<${tagName}${attributes} className="${newClassName}"${closingBracket}`;
      updatedComponent = componentCode.replace(fullTag, newTag);
    } else {
      updatedComponent = componentCode;
    }
  }
  
  console.log(`[TSX-MANIPULATOR] Updated className for ${componentId}`);
  
  return before + updatedComponent + after;
}

/**
 * Update multiple style properties at once
 */
export function updateMultipleStyles(
  tsxCode: string,
  componentMap: ComponentMap,
  componentId: string,
  styles: Record<string, string>
): string {
  let updatedTsx = tsxCode;
  
  Object.entries(styles).forEach(([prop, value]) => {
    updatedTsx = updateInlineStyle(updatedTsx, componentMap, componentId, prop, value);
  });
  
  return updatedTsx;
}

/**
 * Extract current value of a style property
 */
export function getStyleValue(
  tsxCode: string,
  componentMap: ComponentMap,
  componentId: string,
  styleProp: string
): string | null {
  const location = componentMap[componentId];
  if (!location) return null;
  
  const componentCode = tsxCode.substring(location.startChar, location.endChar);
  
  const styleMatch = componentCode.match(/style=\{\{([^}]+)\}\}/);
  if (!styleMatch) return null;
  
  const propRegex = new RegExp(`${styleProp}:\\s*['"]([^'"]*?)['"]`);
  const match = styleMatch[1].match(propRegex);
  
  return match ? match[1] : null;
}

/**
 * Update image src and related attributes
 */
export function updateImageSrc(
  tsxCode: string,
  componentMap: ComponentMap,
  componentId: string,
  newSrc?: string,
  newAlt?: string,
  newWidth?: number,
  newHeight?: number
): string {
  const location = componentMap[componentId];
  if (!location || location.type !== 'Img') {
    console.warn(`[TSX-MANIPULATOR] Component ${componentId} is not an Img component`);
    return tsxCode;
  }
  
  const before = tsxCode.substring(0, location.startChar);
  let componentCode = tsxCode.substring(location.startChar, location.endChar);
  const after = tsxCode.substring(location.endChar);
  
  // Update src (if provided)
  // ✅ FIX: Match either double-quoted or single-quoted strings properly
  // This handles apostrophes and special characters in URLs
  if (newSrc !== undefined) {
    componentCode = componentCode.replace(
      /src=(?:"[^"]*"|'[^']*')/,
      `src="${newSrc}"`
    );
  }
  
  // Update alt if provided
  // ✅ FIX: Match either double-quoted or single-quoted strings properly
  // This handles apostrophes in alt text like "person's hand"
  if (newAlt !== undefined) {
    if (/alt=(?:"[^"]*"|'[^']*')/.test(componentCode)) {
      componentCode = componentCode.replace(
        /alt=(?:"[^"]*"|'[^']*')/,
        `alt="${newAlt}"`
      );
    } else {
      // Add alt attribute if it doesn't exist
      componentCode = componentCode.replace(
        /<Img/,
        `<Img alt="${newAlt}"`
      );
    }
  }
  
  // Update width if provided
  if (newWidth !== undefined) {
    if (/width=\{?\d+\}?/.test(componentCode)) {
      componentCode = componentCode.replace(
        /width=\{?\d+\}?/,
        `width={${newWidth}}`
      );
    } else {
      componentCode = componentCode.replace(
        /<Img/,
        `<Img width={${newWidth}}`
      );
    }
  }
  
  // Update height if provided
  if (newHeight !== undefined) {
    if (/height=\{?\d+\}?/.test(componentCode)) {
      componentCode = componentCode.replace(
        /height=\{?\d+\}?/,
        `height={${newHeight}}`
      );
    } else {
      componentCode = componentCode.replace(
        /<Img/,
        `<Img height={${newHeight}}`
      );
    }
  }
  
  const srcPreview = newSrc ? `src="${newSrc.substring(0, 50)}..."` : 'alt/dimensions only';
  console.log(`[TSX-MANIPULATOR] Updated image ${componentId}: ${srcPreview}`);
  
  return before + componentCode + after;
}

