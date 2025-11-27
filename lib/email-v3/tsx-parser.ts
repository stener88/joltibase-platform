/**
 * TSX Parser with Component ID Injection
 * 
 * Parses React Email TSX code and injects data-component-id attributes
 * for click-to-edit functionality in the iframe preview.
 */

export interface ComponentLocation {
  id: string;
  type: string;
  startLine: number;
  endLine: number;
  startChar: number;
  endChar: number;
  hasChildren: boolean;
  computedStyles?: Record<string, string>; // Inline styles from rendered HTML
}

export interface ComponentMap {
  [componentId: string]: ComponentLocation;
}

export interface ParseResult {
  modifiedTsx: string;
  componentMap: ComponentMap;
}

/**
 * Parse TSX and inject component IDs
 */
export function parseAndInjectIds(tsxCode: string): ParseResult {
  const componentMap: ComponentMap = {};
  let idCounter = 0;
  let modifiedTsx = tsxCode;
  let charOffset = 0;

  // Find all JSX opening tags (React Email components and HTML elements)
  // Matches: <Section>, <Text>, <Button>, <div>, etc.
  const jsxOpeningTagRegex = /<(\w+)(\s+[^>]*?)?(\/?>)/g;
  
  const lines = tsxCode.split('\n');
  let match;
  
  while ((match = jsxOpeningTagRegex.exec(tsxCode)) !== null) {
    const fullMatch = match[0];
    const componentType = match[1];
    const attributes = match[2] || '';
    const closingBracket = match[3];
    
    // Skip if already has data-component-id
    if (attributes.includes('data-component-id')) {
      continue;
    }
    
    // Skip HTML meta tags
    if (['Html', 'Head', 'Preview', 'Tailwind'].includes(componentType)) {
      continue;
    }
    
    // Generate unique ID
    const componentId = `cmp-${idCounter++}`;
    
    // Calculate line number
    const textBeforeMatch = tsxCode.substring(0, match.index);
    const lineNumber = textBeforeMatch.split('\n').length;
    
    // Determine if self-closing or has children
    const isSelfClosing = closingBracket === '/>';
    
    // Find closing tag if not self-closing
    let endLine = lineNumber;
    let endChar = match.index + fullMatch.length;
    
    if (!isSelfClosing) {
      const closingTagRegex = new RegExp(`</${componentType}>`, 'g');
      closingTagRegex.lastIndex = match.index + fullMatch.length;
      const closingMatch = closingTagRegex.exec(tsxCode);
      
      if (closingMatch) {
        const textBeforeClosing = tsxCode.substring(0, closingMatch.index);
        endLine = textBeforeClosing.split('\n').length;
        endChar = closingMatch.index + closingMatch[0].length;
      }
    }
    
    // Store in component map
    componentMap[componentId] = {
      id: componentId,
      type: componentType,
      startLine: lineNumber,
      endLine: endLine,
      startChar: match.index,
      endChar: endChar,
      hasChildren: !isSelfClosing,
    };
    
    // Inject data-component-id and data-component-type attributes
    const injectedAttributes = ` data-component-id="${componentId}" data-component-type="${componentType}"`;
    const newTag = `<${componentType}${injectedAttributes}${attributes}${closingBracket}`;
    
    // Calculate position with offset
    const replaceStart = match.index + charOffset;
    const replaceEnd = replaceStart + fullMatch.length;
    
    modifiedTsx = 
      modifiedTsx.substring(0, replaceStart) +
      newTag +
      modifiedTsx.substring(replaceEnd);
    
    // Update offset for next iteration
    charOffset += newTag.length - fullMatch.length;
  }
  
  console.log(`[TSX-PARSER] Injected ${idCounter} component IDs`);
  
  return {
    modifiedTsx,
    componentMap,
  };
}

/**
 * Extract text content from a component by ID
 */
export function extractTextContent(
  tsxCode: string,
  componentMap: ComponentMap,
  componentId: string
): string | null {
  const location = componentMap[componentId];
  if (!location) return null;
  
  const componentCode = tsxCode.substring(location.startChar, location.endChar);
  
  // Extract text between > and <
  const textMatch = componentCode.match(/>([^<]+)</);
  return textMatch ? textMatch[1].trim() : null;
}

/**
 * Extract style properties from a component
 */
export function extractStyles(
  tsxCode: string,
  componentMap: ComponentMap,
  componentId: string
): Record<string, string> {
  const location = componentMap[componentId];
  if (!location) return {};
  
  const componentCode = tsxCode.substring(location.startChar, location.endChar);
  
  // Extract style or className attributes
  const styles: Record<string, string> = {};
  
  // Extract inline styles: style={{ color: '#000' }}
  const styleMatch = componentCode.match(/style=\{\{([^}]+)\}\}/);
  if (styleMatch) {
    const styleStr = styleMatch[1];
    const stylePairs = styleStr.split(',');
    stylePairs.forEach(pair => {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (key && value) {
        styles[key] = value.replace(/['"]/g, '');
      }
    });
  }
  
  // Extract className for Tailwind
  const classMatch = componentCode.match(/className=["']([^"']+)["']/);
  if (classMatch) {
    styles.className = classMatch[1];
  }
  
  return styles;
}

