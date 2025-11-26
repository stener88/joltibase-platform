/**
 * DOM Scanner for Visual Editor
 * 
 * Scans entire email DOM to identify all editable components
 * Assigns unique IDs and prepares elements for interactive editing
 */

export interface EditableComponent {
  id: string;
  type: 'heading' | 'text' | 'button' | 'image' | 'section' | 'divider' | 'link';
  element: HTMLElement;
  tagName: string;
  text?: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
  bounds: DOMRect;
}

export interface ScanProgress {
  current: number;
  total: number;
  percent: number;
}

/**
 * Scan entire DOM and identify all editable components
 */
export async function scanEntireDOM(
  document: Document,
  onProgress?: (progress: ScanProgress) => void
): Promise<EditableComponent[]> {
  console.log('[DOM-SCANNER] Starting full DOM scan...');
  
  const components: EditableComponent[] = [];
  let idCounter = 1;
  
  // Selectors for editable elements
  const selectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',  // Headings
    'p',                                   // Text
    'button',                              // Buttons
    'a[href]',                             // Links (with href only)
    'img',                                 // Images
    'hr',                                  // Dividers
    'table', 'td[bgcolor]', 'td[style*="background"]', // Sections (email layout)
    'div[style*="background"]'             // Containers with background
  ];
  
  // Find all potential editable elements
  const allElements = document.querySelectorAll(selectors.join(', '));
  const total = allElements.length;
  
  console.log(`[DOM-SCANNER] Found ${total} potential editable elements`);
  
  // Process each element
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i] as HTMLElement;
    
    // Skip if already processed or hidden
    if (element.hasAttribute('data-editor-id') || !isVisible(element)) {
      continue;
    }
    
    // Determine component type
    const type = determineComponentType(element);
    if (!type) continue;
    
    // Generate unique ID
    const id = `component-${idCounter++}`;
    
    // Attach ID to element for quick lookup
    element.setAttribute('data-editor-id', id);
    
    // Extract component data
    const component: EditableComponent = {
      id,
      type,
      element,
      tagName: element.tagName.toLowerCase(),
      text: extractText(element),
      styles: extractStyles(element),
      attributes: extractAttributes(element),
      bounds: element.getBoundingClientRect(),
    };
    
    components.push(component);
    
    // Report progress every 10 elements or on last element
    if (onProgress && (i % 10 === 0 || i === allElements.length - 1)) {
      onProgress({
        current: i + 1,
        total,
        percent: Math.round(((i + 1) / total) * 100),
      });
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  console.log(`[DOM-SCANNER] Scan complete. Found ${components.length} editable components`);
  return components;
}

/**
 * Determine component type from element
 */
function determineComponentType(element: HTMLElement): EditableComponent['type'] | null {
  const tag = element.tagName.toLowerCase();
  
  // Headings
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    return 'heading';
  }
  
  // Text
  if (tag === 'p') {
    return 'text';
  }
  
  // Button
  if (tag === 'button') {
    return 'button';
  }
  
  // Link (styled as button or regular link)
  if (tag === 'a' && element.hasAttribute('href')) {
    const bgColor = window.getComputedStyle(element).backgroundColor;
    const padding = window.getComputedStyle(element).padding;
    
    // If it has background and padding, treat as button
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && padding && padding !== '0px') {
      return 'button';
    }
    return 'link';
  }
  
  // Image
  if (tag === 'img') {
    return 'image';
  }
  
  // Divider
  if (tag === 'hr') {
    return 'divider';
  }
  
  // Section (tables, cells with background, divs with background)
  if (tag === 'table' || tag === 'td' || tag === 'div') {
    const hasBgColor = element.hasAttribute('bgcolor') || 
                       window.getComputedStyle(element).backgroundColor !== 'rgba(0, 0, 0, 0)';
    if (hasBgColor) {
      return 'section';
    }
  }
  
  return null;
}

/**
 * Check if element is visible
 */
function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0';
}

/**
 * Extract text content (first 100 chars)
 */
function extractText(element: HTMLElement): string | undefined {
  const text = element.textContent?.trim() || '';
  return text ? text.substring(0, 100) : undefined;
}

/**
 * Extract relevant styles
 */
function extractStyles(element: HTMLElement): Record<string, string> {
  const computed = window.getComputedStyle(element);
  
  return {
    fontSize: computed.fontSize,
    color: computed.color,
    backgroundColor: computed.backgroundColor,
    fontWeight: computed.fontWeight,
    textAlign: computed.textAlign,
    padding: computed.padding,
    margin: computed.margin,
    borderRadius: computed.borderRadius,
    width: computed.width,
    height: computed.height,
  };
}

/**
 * Extract relevant attributes
 */
function extractAttributes(element: HTMLElement): Record<string, string> {
  const attrs: Record<string, string> = {};
  
  // Common attributes
  if (element.hasAttribute('href')) attrs.href = element.getAttribute('href')!;
  if (element.hasAttribute('src')) attrs.src = element.getAttribute('src')!;
  if (element.hasAttribute('alt')) attrs.alt = element.getAttribute('alt')!;
  if (element.hasAttribute('width')) attrs.width = element.getAttribute('width')!;
  if (element.hasAttribute('height')) attrs.height = element.getAttribute('height')!;
  
  return attrs;
}

/**
 * Make all scanned components interactive
 */
export function makeElementsInteractive(
  components: EditableComponent[],
  onClick: (component: EditableComponent) => void
): void {
  console.log(`[DOM-SCANNER] Making ${components.length} elements interactive...`);
  
  components.forEach(component => {
    const element = component.element;
    
    // Add hover class
    element.classList.add('ve-hoverable');
    element.style.cursor = 'pointer';
    
    // Add click handler
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(component);
    }, true);
  });
  
  console.log('[DOM-SCANNER] Elements are now interactive');
}

