/**
 * Context Extractor for Visual Editing
 * 
 * Extracts component context from clicked HTML elements.
 * This code will be injected into iframe for runtime extraction.
 */

export interface ComponentContext {
  type: 'text' | 'button' | 'heading' | 'section' | 'image' | 'container';
  id?: string;
  editId?: string;  // data-edit-id for precise element targeting
  currentText?: string;
  currentStyles?: Record<string, string>;
  tagName?: string;
  className?: string;
  fullContent?: string;
  parentContext?: string;
}

export interface ExtractedContext extends ComponentContext {
  position?: { x: number; y: number };
  htmlElement?: string;
}

/**
 * Extract component context from an HTML element
 * This function will be stringified and injected into iframe
 */
export function extractComponentContext(element: HTMLElement): ExtractedContext {
  // Get element position
  const rect = element.getBoundingClientRect();
  const position = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };

  // Determine component type
  const type = determineComponentType(element);

  // Extract current text - only for text elements, not containers
  const currentText = extractText(element, type);

  // Extract current styles
  const currentStyles = extractStyles(element);

  // Get tag name
  const tagName = element.tagName.toLowerCase();

  // Get class name
  const className = element.className;

  // Get parent context
  const parentContext = extractParentContext(element);

  // Get full content (for matching in source) - increased limit for better matching
  const fullContent = element.outerHTML.substring(0, 1000);

  // Get unique identifier if available
  const id = element.id || undefined;
  
  // Get data-edit-id for precise targeting (injected by renderer)
  const editId = element.getAttribute('data-edit-id') || undefined;

  const context: ExtractedContext = {
    type,
    id,
    editId,
    currentText,
    currentStyles,
    tagName,
    className,
    fullContent,
    parentContext,
    position,
    htmlElement: element.outerHTML.substring(0, 200) // For debugging
  };

  return context;
}

/**
 * Determine component type from HTML element
 */
function determineComponentType(element: HTMLElement): ComponentContext['type'] {
  const tagName = element.tagName.toLowerCase();
  
  // Check by tag name first - prioritize text elements
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
    return 'heading';
  }
  
  // Paragraphs are ALWAYS text, even with inline children like <br>, <span>, <strong>
  if (tagName === 'p') {
    return 'text';
  }
  
  // List items are text elements
  if (tagName === 'li') {
    return 'text';
  }
  
  // Buttons and styled links
  if (tagName === 'button') {
    return 'button';
  }
  
  // Links with background/padding are buttons, otherwise text
  if (tagName === 'a') {
    const computed = window.getComputedStyle(element);
    const hasBg = computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent';
    const hasPadding = computed.padding && computed.padding !== '0px';
    if (hasBg || hasPadding) {
      return 'button';
    }
    return 'text';
  }
  
  if (tagName === 'img') {
    return 'image';
  }
  
  // Span with text is text
  if (tagName === 'span') {
    return 'text';
  }
  
  // Divs - check content
  if (tagName === 'div') {
    const text = element.textContent?.trim() || '';
    const childElements = Array.from(element.children).filter(
      child => !['br', 'span', 'strong', 'em', 'b', 'i', 'a'].includes(child.tagName.toLowerCase())
    );
    
    // If no block-level children and has text, it's text
    if (childElements.length === 0 && text.length > 0) {
      return 'text';
    }
    
      return 'container';
  }
  
  if (['section', 'article', 'header', 'footer', 'main'].includes(tagName)) {
    return 'section';
  }
  
  // Tables in email are usually layout containers
  if (['table', 'tr', 'td', 'th', 'tbody'].includes(tagName)) {
    // Check if TD contains primarily text
    if (tagName === 'td') {
      const text = element.textContent?.trim() || '';
      const childElements = Array.from(element.children).filter(
        child => !['br', 'span', 'strong', 'em', 'b', 'i', 'a', 'p'].includes(child.tagName.toLowerCase())
      );
      if (childElements.length === 0 && text.length > 0) {
        return 'text';
      }
    }
    return 'container';
  }
  
  // Default to container
  return 'container';
}

/**
 * Extract text content from element
 * Only extracts text for actual text elements, not containers
 */
function extractText(element: HTMLElement, type: ComponentContext['type']): string | undefined {
  // Containers/sections don't have editable text - they contain other elements
  if (type === 'container' || type === 'section') {
    return undefined;
  }
  
  // For text elements, get direct text content first
  const directText = Array.from(element.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent?.trim())
    .filter(Boolean)
    .join(' ');
  
  if (directText) {
    return directText;
  }
  
  // For headings/buttons/text, get innerHTML text (handles <br> etc)
  const allText = element.textContent?.trim();
  if (allText && allText.length < 500) {
    return allText;
  }
  
  return undefined;
}

/**
 * Extract computed styles from element
 */
function extractStyles(element: HTMLElement): Record<string, string> {
  const computed = window.getComputedStyle(element);
  
  // Extract key CSS properties
  const styles: Record<string, string> = {};
  
  const importantProps = [
    'backgroundColor',
    'color',
    'fontSize',
    'fontWeight',
    'fontFamily',
    'padding',
    'margin',
    'border',
    'borderRadius',
    'width',
    'height',
    'display',
    'textAlign',
    'textDecoration'
  ];
  
  importantProps.forEach(prop => {
    const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
    const value = computed.getPropertyValue(cssProp);
    if (value && value !== 'none' && value !== 'normal' && value !== '0px') {
      styles[prop] = value;
    }
  });
  
  return styles;
}

/**
 * Extract parent context for better matching
 */
function extractParentContext(element: HTMLElement): string | undefined {
  const parent = element.parentElement;
  if (!parent || parent.tagName === 'BODY') {
    return undefined;
  }
  
  const parentTag = parent.tagName.toLowerCase();
  const parentClass = parent.className ? `.${parent.className.split(' ')[0]}` : '';
  const parentId = parent.id ? `#${parent.id}` : '';
  
  return `${parentTag}${parentId}${parentClass}`;
}

/**
 * Get stringified version of context extraction code for injection
 */
export function getContextExtractionCode(): string {
  return `
    function determineComponentType(element) {
      const tagName = element.tagName.toLowerCase();
      
      // Headings
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) return 'heading';
      
      // Paragraphs are ALWAYS text
      if (tagName === 'p') return 'text';
      
      // List items are text
      if (tagName === 'li') return 'text';
      
      // Buttons
      if (tagName === 'button') return 'button';
      
      // Links - styled links are buttons
      if (tagName === 'a') {
        const computed = window.getComputedStyle(element);
        const hasBg = computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent';
        const hasPadding = computed.padding && computed.padding !== '0px';
        if (hasBg || hasPadding) return 'button';
        return 'text';
      }
      
      // Images
      if (tagName === 'img') return 'image';
      
      // Span is text
      if (tagName === 'span') return 'text';
      
      // Divs
      if (tagName === 'div') {
        const text = element.textContent?.trim() || '';
        const childElements = Array.from(element.children).filter(
          child => !['br', 'span', 'strong', 'em', 'b', 'i', 'a'].includes(child.tagName.toLowerCase())
        );
        if (childElements.length === 0 && text.length > 0) return 'text';
        return 'container';
      }
      
      // Sections
      if (['section', 'article', 'header', 'footer', 'main'].includes(tagName)) return 'section';
      
      // Tables - check if TD has text
      if (['table', 'tr', 'td', 'th', 'tbody'].includes(tagName)) {
        if (tagName === 'td') {
          const text = element.textContent?.trim() || '';
          const childElements = Array.from(element.children).filter(
            child => !['br', 'span', 'strong', 'em', 'b', 'i', 'a', 'p'].includes(child.tagName.toLowerCase())
          );
          if (childElements.length === 0 && text.length > 0) return 'text';
        }
        return 'container';
      }
      
      return 'container';
    }
    
    function extractText(element, type) {
      // Containers/sections don't have editable text
      if (type === 'container' || type === 'section') {
        return undefined;
      }
      
      const directText = Array.from(element.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent?.trim())
        .filter(Boolean)
        .join(' ');
      if (directText) return directText;
      
      const allText = element.textContent?.trim();
      if (allText && allText.length < 500) return allText;
      return undefined;
    }
    
    function extractStyles(element) {
      const computed = window.getComputedStyle(element);
      const styles = {};
      const props = ['backgroundColor', 'color', 'fontSize', 'fontWeight', 'fontFamily', 'padding', 'margin', 'border', 'borderRadius', 'width', 'height', 'display', 'textAlign', 'textDecoration'];
      props.forEach(prop => {
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        const value = computed.getPropertyValue(cssProp);
        if (value && value !== 'none' && value !== 'normal' && value !== '0px') {
          styles[prop] = value;
        }
      });
      return styles;
    }
    
    function extractParentContext(element) {
      const parent = element.parentElement;
      if (!parent || parent.tagName === 'BODY') return undefined;
      const parentTag = parent.tagName.toLowerCase();
      const parentClass = parent.className ? '.' + parent.className.split(' ')[0] : '';
      const parentId = parent.id ? '#' + parent.id : '';
      return parentTag + parentId + parentClass;
    }
    
    function extractComponentContext(element) {
      const rect = element.getBoundingClientRect();
      const position = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      const type = determineComponentType(element);
      const currentText = extractText(element, type);
      const currentStyles = extractStyles(element);
      const tagName = element.tagName.toLowerCase();
      const className = element.className;
      const parentContext = extractParentContext(element);
      const fullContent = element.outerHTML.substring(0, 1000);
      const id = element.id || undefined;
      const editId = element.getAttribute('data-edit-id') || undefined;
      
      return {
        type: type,
        id: id,
        editId: editId,
        currentText: currentText,
        currentStyles: currentStyles,
        tagName: tagName,
        className: className,
        fullContent: fullContent,
        parentContext: parentContext,
        position: position,
        htmlElement: element.outerHTML.substring(0, 200)
      };
    }
  `;
}




