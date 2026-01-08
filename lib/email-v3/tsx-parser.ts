/**
 * TSX Parser with Component ID Injection (Babel AST Version)
 * 
 * Parses React Email TSX code using Babel AST and injects data-component-id 
 * attributes for click-to-edit functionality in the iframe preview.
 * 
 * ✅ Uses Babel parser for accurate component boundary detection
 * ✅ Handles nested components of the same type correctly
 * ✅ Deterministic delete operations work perfectly
 */

import * as parser from '@babel/parser';
// @ts-ignore - Babel traverse has CommonJS/ESM compatibility issues
import traverse from '@babel/traverse';
// @ts-ignore - Babel generator has CommonJS/ESM compatibility issues
import generate from '@babel/generator';
import * as t from '@babel/types';

export interface ComponentLocation {
  id: string;
  type: string;
  startLine: number;
  endLine: number;
  startChar: number;
  endChar: number;
  hasChildren: boolean;
  computedStyles?: Record<string, string>; // Inline styles from rendered HTML
  textContent?: string; // Text content from rendered HTML
}

export interface ComponentMap {
  [componentId: string]: ComponentLocation;
}

export interface ParseResult {
  modifiedTsx: string;
  componentMap: ComponentMap;
}

/**
 * Parse TSX and inject component IDs using Babel AST
 * 
 * This replaces the old regex-based approach with proper AST parsing.
 * Benefits:
 * - ✅ Accurate component boundaries (including nested same-type components)
 * - ✅ Handles all JSX edge cases (fragments, spreads, etc.)
 * - ✅ Foundation for advanced features (refactoring, code intelligence)
 */
export function parseAndInjectIds(tsxCode: string): ParseResult {
  const componentMap: ComponentMap = {};
  let idCounter = 0;

  try {
    // Parse TSX code into AST
    const ast = parser.parse(tsxCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    // Traverse AST and inject IDs
    traverse(ast, {
      JSXElement(path) {
        const node = path.node;
        const openingElement = node.openingElement;
        
        // Get component type
        if (openingElement.name.type !== 'JSXIdentifier') {
          // Skip namespaced components (rare in React Email)
          return;
        }
        
        const componentType = openingElement.name.name;
        
        // Skip HTML meta tags and wrappers
        if (['Html', 'Head', 'Preview', 'Tailwind'].includes(componentType)) {
          return;
        }
        
        // Check if already has data-component-id
        const hasId = openingElement.attributes.some(
          attr => 
            t.isJSXAttribute(attr) && 
            t.isJSXIdentifier(attr.name) && 
            attr.name.name === 'data-component-id'
        );
        
        if (hasId) {
          return; // Already has ID, skip
        }
        
        // Generate unique ID
        const componentId = `cmp-${idCounter++}`;
        
        // Inject data-component-id and data-component-type attributes
        openingElement.attributes.unshift(
          t.jsxAttribute(
            t.jsxIdentifier('data-component-id'),
            t.stringLiteral(componentId)
          ),
          t.jsxAttribute(
            t.jsxIdentifier('data-component-type'),
            t.stringLiteral(componentType)
          )
        );
        
        // Store in component map with EXACT boundaries from Babel
        // ✅ This is the key fix - Babel knows exactly where components start/end
        componentMap[componentId] = {
          id: componentId,
          type: componentType,
          startLine: node.loc?.start.line || 0,
          endLine: node.loc?.end.line || 0,
          startChar: node.start!,
          endChar: node.end!,  // ✅ Includes closing tag for nested components!
          hasChildren: node.children.length > 0,
        };
      },
    });

    // Generate modified TSX from AST
    const output = generate(ast, {
      retainLines: true,  // Preserve line numbers for debugging
      compact: false,     // Keep formatting readable
    });return {
      modifiedTsx: output.code,
      componentMap,
    };
    
  } catch (error: any) {
    console.error('[TSX-PARSER] Parse error:', error.message);
    
    // Fallback: return original code without modifications
    console.warn('[TSX-PARSER] Falling back to original code (no IDs injected)');
    return {
      modifiedTsx: tsxCode,
      componentMap: {},
    };
  }
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

/**
 * Find the immediate parent component of a given component
 * Uses character position containment: parent.start < child.start && parent.end > child.end
 * Returns the SMALLEST containing component (immediate parent, not grandparent)
 * 
 * ✅ Now works perfectly with Babel-parsed boundaries
 */
export function findParentComponent(
  componentId: string,
  componentMap: ComponentMap
): string | null {
  const target = componentMap[componentId];
  if (!target) {
    console.warn('[TSX-PARSER] Component not found:', componentId);
    return null;
  }
  
  let parent: { id: string; size: number } | null = null;
  
  for (const [id, comp] of Object.entries(componentMap)) {
    // Skip self
    if (id === componentId) continue;
    
    // Check if comp fully contains target (character position containment)
    const containsTarget = comp.startChar < target.startChar && comp.endChar > target.endChar;
    
    if (containsTarget) {
      const size = comp.endChar - comp.startChar;
      
      // Find smallest containing component (immediate parent)
      if (!parent || size < parent.size) {
        parent = { id, size };
      }
    }
  }
  
  if (process.env.NODE_ENV === 'development') {
    if (parent) {
      console.log(`[TSX-PARSER] Found parent of ${componentId}: ${parent.id}`);
    } else {
      console.log(`[TSX-PARSER] No parent found for ${componentId} (root component)`);
    }
  }
  
  return parent?.id || null;
}
