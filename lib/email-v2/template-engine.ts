/**
 * Template Engine
 * 
 * Core logic for injecting semantic block data into HTML templates
 * Uses template mappings to find and replace elements/attributes/content
 */

import { loadTemplate } from './template-registry';
import { getMapping, getValue, type ElementMapping } from './template-mappings';
import type { SemanticBlock } from './ai/blocks';
import type { GlobalEmailSettings } from './types';

// Import mappings to register them
import './template-mappings';

/**
 * Populate a template with block data
 * 
 * @param template - HTML template string
 * @param block - Semantic block data
 * @param settings - Global email settings
 * @param mapping - Template mapping configuration
 * @returns Populated HTML string
 */
export function populateTemplate(
  template: string,
  block: SemanticBlock,
  settings: GlobalEmailSettings,
  blockVariant: string
): string {
  console.log(`[TemplateEngine] Populating template for ${block.blockType}/${blockVariant}`);
  
  // Get mapping for this block type + variant
  const mapping = getMapping(block.blockType, blockVariant);
  if (!mapping) {
    console.warn(`[TemplateEngine] No mapping found for ${block.blockType}/${blockVariant}`);
    return template;
  }
  
  let html = template;
  
  // Apply each element mapping
  for (const elementMapping of mapping.mappings) {
    if (elementMapping.repeat) {
      html = applyRepeatingMapping(html, block, elementMapping);
    } else {
      html = applySingleMapping(html, block, elementMapping);
    }
  }
  
  // Apply global settings (fonts, colors)
  html = applyGlobalSettings(html, settings);
  
  return html;
}

/**
 * Apply a single (non-repeating) element mapping
 */
function applySingleMapping(
  html: string,
  block: SemanticBlock,
  mapping: ElementMapping
): string {
  const { selector, attributes, content } = mapping;
  
  // Find elements matching selector
  const elements = findElementsBySelector(html, selector);
  if (elements.length === 0) {
    console.warn(`[TemplateEngine] No elements found for selector: ${selector}`);
    return html;
  }
  
  // Replace first matching element (for single mappings, only replace the first match)
  const element = elements[0];
  let updatedElement = element.html;
  
  // Update attributes
  if (attributes) {
    for (const attrMapping of attributes) {
      const value = getValue(block, attrMapping.valuePath);
      if (value !== undefined && value !== null) {
        updatedElement = updateAttribute(updatedElement, attrMapping.attribute, value);
      }
    }
  }
  
  // Update content
  if (content) {
    // Special case: if content is a literal string (not a path), use it directly
    if (content === 'Unsubscribe' && selector === 'a') {
      updatedElement = updateContent(updatedElement, 'Unsubscribe');
      console.log(`[TemplateEngine] ✓ Updated ${selector} content: "Unsubscribe"`);
    } else {
      const value = getValue(block, content);
      if (value !== undefined && value !== null) {
        updatedElement = updateContent(updatedElement, value);
        console.log(`[TemplateEngine] ✓ Updated ${selector} content: "${String(value).substring(0, 50)}..."`);
      } else {
        console.warn(`[TemplateEngine] ✗ No value found for content path: ${content} in block:`, block);
      }
    }
  }
  
  // Replace in HTML (use first occurrence to avoid replacing wrong instance)
  const firstIndex = html.indexOf(element.html);
  if (firstIndex !== -1) {
    return html.slice(0, firstIndex) + updatedElement + html.slice(firstIndex + element.html.length);
  }
  
  return html.replace(element.html, updatedElement);
}

/**
 * Apply a repeating element mapping (for arrays)
 */
function applyRepeatingMapping(
  html: string,
  block: SemanticBlock,
  mapping: ElementMapping
): string {
  const { selector, arrayPath, itemMappings } = mapping;
  
  if (!arrayPath || !itemMappings) {
    console.warn(`[TemplateEngine] Repeating mapping missing arrayPath or itemMappings`);
    return html;
  }
  
  // Get array data from block
  const arrayData = getValue(block, arrayPath);
  if (!Array.isArray(arrayData) || arrayData.length === 0) {
    console.warn(`[TemplateEngine] No array data found at ${arrayPath}`);
    return html;
  }
  
  // Find all elements matching selector
  const elements = findElementsBySelector(html, selector);
  if (elements.length === 0) {
    console.warn(`[TemplateEngine] ✗ No elements found for repeating selector: ${selector}`);
    return html;
  }
  
  console.log(`[TemplateEngine] Found ${elements.length} elements for repeating ${selector}, array has ${arrayData.length} items`);
  
  // Use first element as template
  const templateElement = elements[0].html;
  
  // Generate HTML for each item
  const generatedElements = arrayData.map((item, index) => {
    let itemHtml = templateElement;
    
    // Update attributes
    if (itemMappings.attributes) {
      for (const attrMapping of itemMappings.attributes) {
        const value = getValue(item, attrMapping.valuePath);
        if (value !== undefined && value !== null) {
          itemHtml = updateAttribute(itemHtml, attrMapping.attribute, value);
        }
      }
    }
    
    // Update content
    if (itemMappings.content) {
      // Special handling for numbered list circles - use index + 1
      if (itemMappings.content === '__INDEX__') {
        const number = String(index + 1);
        itemHtml = updateContent(itemHtml, number);
        console.log(`[TemplateEngine] ✓ Updated numbered circle ${index + 1}`);
      } else {
        const value = getValue(item, itemMappings.content);
        if (value !== undefined && value !== null) {
          itemHtml = updateContent(itemHtml, value);
          console.log(`[TemplateEngine] ✓ Updated repeating ${selector} item ${index + 1}: "${String(value).substring(0, 50)}..."`);
        } else {
          console.warn(`[TemplateEngine] ✗ No value found for item content path: ${itemMappings.content} in item:`, item);
        }
      }
    }
    
    return itemHtml;
  });
  
  // Replace elements IN PLACE to preserve table structure
  // Process from last to first to maintain correct indices during replacement
  let updatedHtml = html;
  const elementsToReplace = Math.min(elements.length, arrayData.length);
  
  // Replace existing elements in place (from last to first to preserve indices)
  // After each replacement, we need to recalculate positions, so we'll do it differently:
  // Find and replace each element individually, working backwards
  for (let i = elementsToReplace - 1; i >= 0; i--) {
    const element = elements[i];
    const generatedElement = generatedElements[i];
    
    // Find this specific element in the current HTML (search from end to find last occurrence)
    // This ensures we replace the right instance even if there are duplicates
    const searchStart = i === elementsToReplace - 1 ? updatedHtml.length : elements[i + 1].start;
    const elementIndex = updatedHtml.lastIndexOf(element.html, searchStart);
    
    if (elementIndex !== -1) {
      updatedHtml = updatedHtml.slice(0, elementIndex) + generatedElement + updatedHtml.slice(elementIndex + element.html.length);
    } else {
      console.warn(`[TemplateEngine] Could not find element ${i} to replace`);
    }
  }
  
  // If we have more data than template elements, we'd need to clone the template structure
  // For now, just use what we have (template should have enough elements)
  if (arrayData.length > elements.length) {
    console.warn(`[TemplateEngine] More data items (${arrayData.length}) than template elements (${elements.length}). Extra items will be ignored.`);
  }
  
  return updatedHtml;
}

/**
 * Apply global settings (fonts, colors) to HTML
 */
function applyGlobalSettings(html: string, settings: GlobalEmailSettings): string {
  let updated = html;
  
  // Replace font-family if specified
  if (settings.fontFamily) {
    updated = updated.replace(
      /font-family:\s*['"][^'"]+['"]/g,
      `font-family: '${settings.fontFamily}'`
    );
  }
  
  // Replace primary color if specified
  // CRITICAL: Only replace button/CTA backgrounds, NEVER text colors or content backgrounds
  if (settings.primaryColor) {
    // ONLY replace background-color in <a> tags that have brand colors (buttons/CTAs)
    // Do NOT touch any other colors - preserve all text colors and content backgrounds
    const brandColors = ['#4f46e5', '#7c3aed', '#6366f1', '#3b82f6'];
    
    // Replace button background colors only (in <a> tags with brand color backgrounds)
    for (const brandColor of brandColors) {
      // Match <a> tags with this brand color as background-color
      updated = updated.replace(
        new RegExp(`(<a[^>]*style="[^"]*background-color:\\s*)${brandColor}`, 'gi'),
        `$1${settings.primaryColor}`
      );
    }
    
    // DO NOT replace any text colors - they should stay as designed
    // Headlines: black (#000000)
    // Body text: gray (#6b7280, #374151)
    // Links: can stay as-is or use brand color, but don't force it
  }
  
  // CRITICAL: Ensure all content sections (td elements) have white backgrounds if missing
  // This prevents colored body backgrounds from showing through
  // Only add white background if one doesn't exist - don't replace existing backgrounds
  updated = updated.replace(
    /(<td[^>]*style=")([^"]*)(")/g,
    (match, prefix, style, suffix) => {
      // If style doesn't already have background-color, add white background
      if (!style.includes('background-color')) {
        return `${prefix}${style};background-color:#ffffff${suffix}`;
      }
      // If it already has a background-color, keep it as-is
      return match;
    }
  );
  
  return updated;
}

/**
 * Find elements matching a CSS selector
 * Simplified implementation for common selectors
 */
interface ElementMatch {
  html: string;
  tag: string;
  start: number;
  end: number;
}

/**
 * Parse CSS selector to extract tag and attribute filters
 * Handles: tag, tag[attr], tag[attr1][attr2], tag[attr] descendant
 */
function parseSelector(selector: string): {
  tag: string;
  attributes: string[];
  descendant?: string;
} {
  // Handle descendant selectors: "table td a" -> take last part
  // But be careful not to break attribute selectors with spaces inside []
  // We need to find spaces that are NOT inside brackets
  let lastSpaceIndex = -1;
  let bracketDepth = 0;
  for (let i = 0; i < selector.length; i++) {
    if (selector[i] === '[') bracketDepth++;
    else if (selector[i] === ']') bracketDepth--;
    else if (selector[i] === ' ' && bracketDepth === 0) {
      lastSpaceIndex = i;
    }
  }
  
  if (lastSpaceIndex !== -1) {
    selector = selector.substring(lastSpaceIndex + 1).trim();
  }
  
  // Extract tag and all attribute selectors
  // Match: tag followed by zero or more [attr] selectors
  const match = selector.match(/^(\w+)((?:\[[^\]]+\])*)$/);
  if (!match) {
    // No attributes, just tag
    return { tag: selector, attributes: [] };
  }
  
  const tag = match[1];
  const attrString = match[2];
  
  // Extract each [attr] selector
  const attributes: string[] = [];
  const attrRegex = /\[([^\]]+)\]/g;
  let attrMatch;
  while ((attrMatch = attrRegex.exec(attrString)) !== null) {
    attributes.push(attrMatch[1]);
  }
  
  return { tag, attributes };
}

function findElementsBySelector(html: string, selector: string): ElementMatch[] {
  const elements: ElementMatch[] = [];
  
  // Parse selector to extract tag and all attribute filters
  const { tag, attributes } = parseSelector(selector);
  
  console.log(`[DEBUG] Searching for selector: ${selector} -> tag: ${tag}, attributes: [${attributes.join(', ')}]`);
  
  // Find all opening tags
  const tagRegex = new RegExp(`<${tag}[^>]*>`, 'gis');
  let match;
  let tagCount = 0;
  
  while ((match = tagRegex.exec(html)) !== null) {
    const openTag = match[0];
    const start = match.index;
    tagCount++;
    
    console.log(`[DEBUG] Found ${tag} tag #${tagCount}: ${openTag.substring(0, 100).replace(/\n/g, '\\n')}...`);
    
    // Check all attribute filters if specified
    let matches = true;
    if (attributes.length > 0) {
      for (const attrFilter of attributes) {
        const filterResult = matchesAttributeFilter(openTag, attrFilter);
        console.log(`[DEBUG]   Filter "${attrFilter}": ${filterResult ? '✓ MATCH' : '✗ NO MATCH'}`);
        if (!filterResult) {
          matches = false;
          break;
        }
      }
    }
    
    if (!matches) {
      console.log(`[DEBUG]   → Skipped (filters didn't match)`);
      continue;
    }
    
    console.log(`[DEBUG]   → ✓ Added to results`);
    
    // Find closing tag (if not self-closing)
    const isSelfClosing = openTag.endsWith('/>');
    if (isSelfClosing) {
      elements.push({
        html: openTag,
        tag,
        start,
        end: start + openTag.length,
      });
    } else {
      const closeTag = `</${tag}>`;
      
      // For anchor tags and other non-nestable elements, use simple search
      // Anchor tags cannot legally be nested, so we can use simple indexOf
      const nonNestableElements = ['a', 'button', 'img', 'input', 'br', 'hr'];
      
      if (nonNestableElements.includes(tag.toLowerCase())) {
        // Use regex to find closing tag with optional whitespace before >
        // Handles cases like </a>, </a >, </a\n>, etc.
        const closeTagRegex = new RegExp(`</${tag}\\s*>`, 'i');
        closeTagRegex.lastIndex = start + openTag.length;
        const closeMatch = closeTagRegex.exec(html.substring(start + openTag.length));
        
        if (closeMatch) {
          const closeIndex = start + openTag.length + closeMatch.index;
          const end = closeIndex + closeMatch[0].length;
          elements.push({
            html: html.slice(start, end),
            tag,
            start,
            end,
          });
          console.log(`[DEBUG]   → ✓ Complete element added (${end - start} chars)`);
        } else {
          console.log(`[DEBUG]   → ✗ No closing tag found for ${tag}`);
        }
      } else {
        // For nestable elements, use depth tracking
        const openTagPattern = new RegExp(`<${tag}[\\s>]`, 'gi');
        const closeTagPattern = new RegExp(`</${tag}>`, 'gi');
        
        let depth = 1;
        let searchPos = start + openTag.length;
        let closeIndex = -1;
        
        // Search for matching closing tag by tracking depth
        while (depth > 0 && searchPos < html.length) {
          // Find next opening or closing tag
          openTagPattern.lastIndex = searchPos;
          closeTagPattern.lastIndex = searchPos;
          
          const nextOpen = openTagPattern.exec(html);
          const nextClose = closeTagPattern.exec(html);
          
          if (!nextClose) {
            console.log(`[DEBUG]   → ✗ No closing tag found for ${tag}`);
            break;
          }
          
          // Check if there's an opening tag before the closing tag
          if (nextOpen && nextOpen.index < nextClose.index) {
            depth++;
            searchPos = nextOpen.index + 1;
          } else {
            depth--;
            if (depth === 0) {
              closeIndex = nextClose.index;
            }
            searchPos = nextClose.index + closeTag.length;
          }
        }
        
        if (closeIndex > start) {
          const end = closeIndex + closeTag.length;
          elements.push({
            html: html.slice(start, end),
            tag,
            start,
            end,
          });
          console.log(`[DEBUG]   → ✓ Complete element added (${end - start} chars)`);
        } else {
          console.log(`[DEBUG]   → ✗ Failed to find matching closing tag`);
        }
      }
    }
  }
  
  console.log(`[DEBUG] Found ${tagCount} ${tag} tags total, ${elements.length} matched all filters`);
  
  return elements;
}

/**
 * Check if an HTML tag matches an attribute filter
 * Handles patterns like: alt*="logo", href, data-id="something"
 */
function matchesAttributeFilter(tag: string, filter: string): boolean {
  // Normalize tag HTML - collapse newlines and extra whitespace
  // This is critical for multi-line tags where attributes span multiple lines
  const normalizedTag = tag.replace(/\s+/g, ' ').trim();
  
  console.log(`[DEBUG]     Normalized tag: ${normalizedTag.substring(0, 150)}`);
  console.log(`[DEBUG]     Testing filter: "${filter}"`);
  
  // Handle *= (contains)
  if (filter.includes('*=')) {
    const [attr, value] = filter.split('*=').map(s => s.trim().replace(/['"]/g, ''));
    const attrRegex = new RegExp(`${escapeRegex(attr)}\\s*=\\s*["']([^"']*)["']`, 'i');
    const match = normalizedTag.match(attrRegex);
    const result = match ? match[1].includes(value) : false;
    console.log(`[DEBUG]     Contains check: attr="${attr}", value="${value}", match=${!!match}, result=${result}`);
    return result;
  }
  
  // Handle = (equals)
  if (filter.includes('=')) {
    const [attr, value] = filter.split('=').map(s => s.trim().replace(/['"]/g, ''));
    const attrRegex = new RegExp(`${escapeRegex(attr)}\\s*=\\s*["']${escapeRegex(value)}["']`, 'i');
    const result = attrRegex.test(normalizedTag);
    console.log(`[DEBUG]     Equals check: attr="${attr}", value="${value}", regex=${attrRegex}, result=${result}`);
    return result;
  }
  
  // Just attribute presence - more robust without word boundary
  const attrRegex = new RegExp(`${escapeRegex(filter)}\\s*=`, 'i');
  const result = attrRegex.test(normalizedTag);
  console.log(`[DEBUG]     Presence check: attr="${filter}", regex=${attrRegex}, result=${result}`);
  return result;
}

/**
 * Escape special characters in a string for use in regex
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Update an attribute value in an HTML element
 */
function updateAttribute(elementHtml: string, attribute: string, value: string): string {
  const attrRegex = new RegExp(`${attribute}\\s*=\\s*["']([^"']*)["']`, 'i');
  
  if (attrRegex.test(elementHtml)) {
    // Update existing attribute
    return elementHtml.replace(attrRegex, `${attribute}="${escapeHtml(value)}"`);
  } else {
    // Add new attribute (insert before closing >)
    return elementHtml.replace(/>$/, ` ${attribute}="${escapeHtml(value)}">`);
  }
}

/**
 * Update text content of an HTML element
 * Handles elements with nested children by finding the deepest text node
 */
function updateContent(elementHtml: string, content: string): string {
  // For buttons with nested spans, find the span with actual text content
  if (elementHtml.includes('<span')) {
    // Find the span with actual text (not MSO comments)
    const textSpanRegex = /<span[^>]*>((?:(?!<span|<\/span>).)*?)<\/span>/g;
    let match;
    let lastMatch;
    
    while ((match = textSpanRegex.exec(elementHtml)) !== null) {
      // Skip MSO conditional comments
      if (!match[1].includes('<!--[if mso]') && match[1].trim().length > 0) {
        lastMatch = match;
      }
    }
    
    if (lastMatch) {
      const [fullMatch, innerText] = lastMatch;
      const replacement = fullMatch.replace(innerText, escapeHtml(content));
      return elementHtml.replace(fullMatch, replacement);
    }
  }
  
  // Simple element structure: <tag>content</tag>
  const contentRegex = /^(<[^>]+>)([\s\S]*)(<\/[^>]+>)$/;
  const match = elementHtml.match(contentRegex);
  
  if (match) {
    return `${match[1]}${escapeHtml(content)}${match[3]}`;
  }
  
  return elementHtml;
}

/**
 * Find parent container element containing a child
 */
function findParentContainer(html: string, childHtml: string): ElementMatch | null {
  const childIndex = html.indexOf(childHtml);
  if (childIndex === -1) {
    return null;
  }
  
  // Find the nearest parent <td>, <tr>, or <table> (search from closest to farthest)
  const containerTags = ['td', 'tr', 'table'];
  
  for (const tag of containerTags) {
    const openTag = `<${tag}`;
    const closeTag = `</${tag}>`;
    
    // Search backwards for opening tag
    let start = html.lastIndexOf(openTag, childIndex);
    if (start === -1) continue;
    
    // Find the matching closing tag after child
    let end = html.indexOf(closeTag, childIndex + childHtml.length);
    if (end === -1) continue;
    
    end += closeTag.length;
    
    return {
      html: html.slice(start, end),
      tag,
      start,
      end,
    };
  }
  
  return null;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

/**
 * Main entry point: Load template and populate with block data
 * 
 * @param block - Semantic block
 * @param settings - Global email settings
 * @returns Populated HTML string or null if template not found
 */
export function renderBlockToHTML(
  block: SemanticBlock,
  settings: GlobalEmailSettings
): string | null {
  console.log(`[TemplateEngine] Rendering ${block.blockType} block to HTML`);
  
  // Get variant from block
  // Special handling for CTA: map 'style' field to 'variant' for template lookup
  let blockVariant = (block as any).variant;
  
  if (!blockVariant) {
    if (block.blockType === 'cta' && (block as any).style) {
      // Map CTA style to variant for template lookup
      blockVariant = (block as any).style; // 'primary', 'secondary', 'outline' → mapped to 'simple' in registry
    } else {
      blockVariant = getDefaultVariant(block.blockType);
    }
  }
  
  // Load template
  const template = loadTemplate(block.blockType, blockVariant);
  if (!template) {
    console.error(`[TemplateEngine] Template not found for ${block.blockType}/${blockVariant}`);
    return null;
  }
  
  // For mapping lookup, use 'simple' variant for CTA regardless of style
  const mappingVariant = block.blockType === 'cta' ? 'simple' : blockVariant;
  
  // Populate with data
  const html = populateTemplate(template, block, settings, mappingVariant);
  
  console.log(`[TemplateEngine] Successfully rendered ${block.blockType} block`);
  return html;
}

/**
 * Get default variant for a block type
 */
function getDefaultVariant(blockType: string): string {
  const defaults: Record<string, string> = {
    header: 'centered-menu',
    hero: 'centered',
    features: 'grid',
    content: 'image-top',
    testimonial: 'centered',
    cta: 'primary',
    footer: 'one-column',
    gallery: 'grid-2x2',
    stats: 'simple',
    pricing: 'simple',
    article: 'image-top',
    list: 'numbered',
    ecommerce: 'single',
    marketing: 'bento-grid',
    feedback: 'simple-rating',
  };
  
  return defaults[blockType] || 'default';
}

/**
 * Render multiple blocks to HTML and combine
 * 
 * @param blocks - Array of semantic blocks
 * @param settings - Global email settings
 * @param previewText - Optional preview text
 * @returns Complete HTML email string
 */
export function renderBlocksToHTML(
  blocks: SemanticBlock[],
  settings: GlobalEmailSettings,
  previewText?: string
): string {
  console.log(`[TemplateEngine] Rendering ${blocks.length} blocks to HTML`);
  
  const blockHtmls: string[] = [];
  
  for (const block of blocks) {
    const html = renderBlockToHTML(block, settings);
    if (html) {
      blockHtmls.push(html);
    }
  }
  
  // Wrap in email structure (templates now include spacing via margin-bottom)
  return wrapInEmailStructure(blockHtmls.join('\n'), settings, previewText);
}

/**
 * Wrap block HTML in complete email structure
 */
function wrapInEmailStructure(
  bodyContent: string,
  settings: GlobalEmailSettings,
  previewText?: string
): string {
  // Note: Preview text should be added via React Email Preview component in the body
  // Not as a meta tag in the head, as that doesn't work properly
  const previewHtml = previewText 
    ? `<div style="display:none;opacity:0;overflow:hidden;line-height:1px;max-height:0;max-width:0;font-size:0;mso-hide:all;">${escapeHtml(previewText)}</div>`
    : '';
    
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <style>
      @font-face {
        font-family: '${settings.fontFamily}';
        font-style: normal;
        font-weight: 400;
        mso-font-alt: 'Helvetica';
      }
      * {
        font-family: '${settings.fontFamily}', Helvetica, Arial, sans-serif;
      }
    </style>
  </head>
  <body style="margin:0;background-color:#ffffff">
    ${previewHtml}
    ${bodyContent}
  </body>
</html>`;
}

