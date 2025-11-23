/**
 * HTML Parser
 * 
 * Converts HTML email templates to EmailComponent tree structure
 * Used for visual editing mode - parses rendered HTML back to editable components
 */

import type { EmailComponent, ComponentType } from './types';

/**
 * Parse HTML string to EmailComponent tree
 * 
 * @param html - HTML email string
 * @returns Root EmailComponent
 */
export function parseHTMLToEmailComponent(html: string): EmailComponent {
  console.log('[HTMLParser] Parsing HTML to EmailComponent tree');
  
  // Parse HTML document structure (using [\s\S] instead of . with /s flag for ES5 compatibility)
  const htmlMatch = html.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
  if (!htmlMatch) {
    throw new Error('[HTMLParser] Invalid HTML - missing <html> tag');
  }
  
  const htmlContent = htmlMatch[1];
  
  // Extract head and body
  const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  
  if (!bodyMatch) {
    throw new Error('[HTMLParser] Invalid HTML - missing <body> tag');
  }
  
  const head = headMatch ? parseHead(headMatch[1]) : createEmptyHead();
  const body = parseBody(bodyMatch[1], extractStyleFromTag(bodyMatch[0]));
  
  // Create root HTML component
  const root: EmailComponent = {
    id: 'root',
    component: 'Html',
    props: extractPropsFromTag(html.match(/<html[^>]*>/i)?.[0] || '<html>'),
    children: [head, body],
  };
  
  console.log('[HTMLParser] Successfully parsed HTML to EmailComponent');
  return root;
}

/**
 * Parse <head> section
 */
function parseHead(headContent: string): EmailComponent {
  const children: EmailComponent[] = [];
  
  // Extract preview text if present
  const previewMatch = headContent.match(/<meta\s+name=["']preview["'][^>]*>([^<]*)</i);
  if (previewMatch) {
    children.push({
      id: 'preview',
      component: 'Preview',
      props: {},
      content: previewMatch[1],
    });
  }
  
  return {
    id: 'head',
    component: 'Head',
    props: {},
    children: children.length > 0 ? children : undefined,
  };
}

/**
 * Create empty head component
 */
function createEmptyHead(): EmailComponent {
  return {
    id: 'head',
    component: 'Head',
    props: {},
  };
}

/**
 * Parse <body> section
 */
function parseBody(bodyContent: string, bodyStyle: Record<string, any>): EmailComponent {
  const children = parseChildren(bodyContent);
  
  return {
    id: 'body',
    component: 'Body',
    props: { style: bodyStyle },
    children,
  };
}

/**
 * Parse child elements recursively
 */
function parseChildren(html: string): EmailComponent[] {
  const components: EmailComponent[] = [];
  let remainingHtml = html.trim();
  let idCounter = 0;
  
  // Match all top-level elements
  while (remainingHtml.length > 0) {
    // Skip whitespace and text nodes (simplified - only structural elements)
    remainingHtml = remainingHtml.trimStart();
    
    if (!remainingHtml.startsWith('<')) {
      // Text content - wrap in Text component
      const textEnd = remainingHtml.indexOf('<');
      const text = textEnd > 0 ? remainingHtml.slice(0, textEnd) : remainingHtml;
      const trimmedText = text.trim();
      
      if (trimmedText) {
        components.push({
          id: `text-${idCounter++}`,
          component: 'Text',
          props: {},
          content: trimmedText,
        });
      }
      
      remainingHtml = textEnd > 0 ? remainingHtml.slice(textEnd) : '';
      continue;
    }
    
    // Parse next element
    const element = parseNextElement(remainingHtml, idCounter++);
    if (element) {
      components.push(element.component);
      remainingHtml = element.remaining;
    } else {
      break;
    }
  }
  
  return components;
}

/**
 * Parse next HTML element
 */
interface ParseResult {
  component: EmailComponent;
  remaining: string;
}

function parseNextElement(html: string, idCounter: number): ParseResult | null {
  // Match opening tag
  const tagMatch = html.match(/^<(\w+)([^>]*)>/);
  if (!tagMatch) {
    return null;
  }
  
  const tagName = tagMatch[1].toLowerCase();
  const tagAttributes = tagMatch[2];
  const openTagEnd = tagMatch[0].length;
  
  // Check if self-closing
  const isSelfClosing = tagAttributes.trim().endsWith('/') || ['img', 'hr', 'br', 'meta', 'link'].includes(tagName);
  
  if (isSelfClosing) {
    return {
      component: {
        id: `${tagName}-${idCounter}`,
        component: mapHTMLTagToComponent(tagName),
        props: parseAttributes(tagAttributes),
      },
      remaining: html.slice(openTagEnd),
    };
  }
  
  // Find matching closing tag
  const closeTag = `</${tagName}>`;
  const depth = countTagDepth(html.slice(openTagEnd), tagName);
  const closeIndex = findMatchingCloseTag(html, openTagEnd, tagName, depth);
  
  if (closeIndex === -1) {
    console.warn(`[HTMLParser] No closing tag found for <${tagName}>`);
    return null;
  }
  
  // Extract content between tags
  const content = html.slice(openTagEnd, closeIndex);
  const props = parseAttributes(tagAttributes);
  
  // Map tag to component type first
  const componentType = mapHTMLTagToComponent(tagName);
  
  // Parse component
  const component: EmailComponent = {
    id: `${tagName}-${idCounter}`,
    component: componentType,
    props,
  };
  
  // Check if component type can have children, not just tag name
  // Components that CANNOT have children: Text, Heading, Button, Link, Hr, Img
  // When parsing HTML, we flatten nested HTML in these elements to avoid invalid structures
  const componentCanHaveChildren = !['Text', 'Heading', 'Button', 'Link', 'Hr', 'Img'].includes(componentType);
  
  if (!componentCanHaveChildren) {
    // Text-only components: strip HTML and use content (flatten nested HTML)
    component.content = stripHTMLTags(content).trim();
  } else {
    // Container components: recursively parse children
    const children = parseChildren(content);
    if (children.length > 0) {
      component.children = children;
    }
  }
  
  return {
    component,
    remaining: html.slice(closeIndex + closeTag.length),
  };
}

/**
 * Map HTML tag to EmailComponent type
 */
function mapHTMLTagToComponent(tag: string): ComponentType {
  const mapping: Record<string, ComponentType> = {
    'table': 'Section',
    'tr': 'Row',
    'td': 'Column',
    'img': 'Img',
    'a': 'Link',
    'p': 'Text',
    'h1': 'Heading',
    'h2': 'Heading',
    'h3': 'Heading',
    'h4': 'Heading',
    'span': 'Text',
    'div': 'Section',
    'hr': 'Hr',
  };
  
  return mapping[tag.toLowerCase()] || 'Section';
}

/**
 * Check if tag represents text content
 */
function isTextElement(tag: string): boolean {
  return ['p', 'span', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag.toLowerCase());
}

/**
 * Parse HTML attributes to props object
 */
function parseAttributes(attributesString: string): Record<string, any> {
  const props: Record<string, any> = {};
  
  // Extract style attribute
  const styleMatch = attributesString.match(/style\s*=\s*["']([^"']*)["']/i);
  if (styleMatch) {
    props.style = parseStyleString(styleMatch[1]);
  }
  
  // Extract other common attributes
  const attrPatterns = [
    { name: 'href', pattern: /href\s*=\s*["']([^"']*)["']/i },
    { name: 'src', pattern: /src\s*=\s*["']([^"']*)["']/i },
    { name: 'alt', pattern: /alt\s*=\s*["']([^"']*)["']/i },
    { name: 'width', pattern: /width\s*=\s*["']?(\d+)["']?/i },
    { name: 'height', pattern: /height\s*=\s*["']?(\d+)["']?/i },
    { name: 'align', pattern: /align\s*=\s*["']([^"']*)["']/i },
    { name: 'target', pattern: /target\s*=\s*["']([^"']*)["']/i },
  ];
  
  for (const { name, pattern } of attrPatterns) {
    const match = attributesString.match(pattern);
    if (match) {
      props[name] = match[1];
    }
  }
  
  return props;
}

/**
 * Parse inline style string to style object
 */
function parseStyleString(styleString: string): Record<string, any> {
  const style: Record<string, any> = {};
  
  // Split by semicolon and parse each property
  const declarations = styleString.split(';').filter(d => d.trim());
  
  for (const declaration of declarations) {
    const colonIndex = declaration.indexOf(':');
    if (colonIndex > 0) {
      const property = declaration.slice(0, colonIndex).trim();
      const value = declaration.slice(colonIndex + 1).trim();
      
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      style[camelProperty] = value;
    }
  }
  
  return style;
}

/**
 * Extract style from opening tag
 */
function extractStyleFromTag(tag: string): Record<string, any> {
  const styleMatch = tag.match(/style\s*=\s*["']([^"']*)["']/i);
  return styleMatch ? parseStyleString(styleMatch[1]) : {};
}

/**
 * Extract props from opening tag
 */
function extractPropsFromTag(tag: string): Record<string, any> {
  const propsMatch = tag.match(/<\w+([^>]*)>/);
  return propsMatch ? parseAttributes(propsMatch[1]) : {};
}

/**
 * Count tag depth (for nested tags with same name)
 */
function countTagDepth(html: string, tagName: string): number {
  let depth = 1;
  const openRegex = new RegExp(`<${tagName}[^>]*>`, 'gi');
  const closeRegex = new RegExp(`</${tagName}>`, 'gi');
  
  let match;
  while ((match = openRegex.exec(html)) !== null) {
    depth++;
  }
  while ((match = closeRegex.exec(html)) !== null) {
    depth--;
  }
  
  return depth;
}

/**
 * Find matching closing tag accounting for nesting
 */
function findMatchingCloseTag(html: string, startPos: number, tagName: string, initialDepth: number = 1): number {
  const openTag = `<${tagName}`;
  const closeTag = `</${tagName}>`;
  
  let depth = initialDepth;
  let pos = startPos;
  
  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf(openTag, pos);
    const nextClose = html.indexOf(closeTag, pos);
    
    if (nextClose === -1) {
      return -1; // No closing tag found
    }
    
    if (nextOpen !== -1 && nextOpen < nextClose) {
      // Found nested opening tag
      depth++;
      pos = nextOpen + openTag.length;
    } else {
      // Found closing tag
      depth--;
      if (depth === 0) {
        return nextClose;
      }
      pos = nextClose + closeTag.length;
    }
  }
  
  return -1;
}

/**
 * Strip HTML tags from string
 */
function stripHTMLTags(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

