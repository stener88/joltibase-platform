'use client';

import { useEffect, useState, useRef } from 'react';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';
import { renderEmailComponent } from '@/lib/email-v2';
import { Loader2 } from 'lucide-react';

interface EmailV2FrameProps {
  rootComponent: EmailComponent;
  globalSettings: GlobalEmailSettings;
  selectedComponentId?: string | null;
  onComponentClick?: (id: string, bounds: DOMRect) => void;
  deviceMode?: 'desktop' | 'mobile';
  className?: string;
}

export function EmailV2Frame({
  rootComponent,
  globalSettings,
  selectedComponentId,
  onComponentClick,
  deviceMode = 'desktop',
  className = '',
}: EmailV2FrameProps) {
  const [html, setHtml] = useState<string>('');
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Render email HTML
  useEffect(() => {
    console.log('[EmailV2Frame] rootComponent changed:', {
      id: rootComponent.id,
      component: rootComponent.component,
      childrenCount: rootComponent.children?.length,
      hasChildren: !!rootComponent.children,
    });

    // Defer expensive tree inspection to avoid blocking render
    setTimeout(() => {
      if (rootComponent.component === 'Html' && rootComponent.children) {
        const body = rootComponent.children.find((c: EmailComponent) => c.component === 'Body');
        const container = body?.children?.find((c: EmailComponent) => c.component === 'Container');
        if (container) {
          console.log('[EmailV2Frame] Container has', container.children?.length || 0, 'children');
        }
      }
    }, 0);

    const render = async () => {
      setIsRendering(true);
      setError(null);

      try {
        const result = await renderEmailComponent(rootComponent, globalSettings);
        if (result.html) {
          console.log('[EmailV2Frame] HTML rendered successfully, length:', result.html.length);
          setHtml(result.html);
        } else {
          console.error('[EmailV2Frame] No HTML in render result');
          setError('Failed to render email');
        }
      } catch (err) {
        console.error('[EmailV2Frame] Render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render email');
      } finally {
        setIsRendering(false);
      }
    };

    render();
  }, [rootComponent, globalSettings]);

  // Add selection and click handling with bounds
  useEffect(() => {
    if (!html) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'component-click' && onComponentClick) {
        const { componentId, bounds } = event.data;
        
        // Get iframe position in viewport to convert coordinates
        if (iframeRef.current) {
          const iframeRect = iframeRef.current.getBoundingClientRect();
          
          // Convert iframe-relative bounds to viewport coordinates
          const viewportBounds = new DOMRect(
            bounds.x + iframeRect.left,
            bounds.y + iframeRect.top,
            bounds.width,
            bounds.height
          );
          
          onComponentClick(componentId, viewportBounds);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [html, onComponentClick]);

  // Inject interactive script for component selection with bounds
  // Only add hover/click when onComponentClick is provided (visual edits mode)
  const interactiveHtml = html
    ? html.replace(
        '</body>',
        `
  ${onComponentClick ? `
  <style>
    [data-component-id] { 
      cursor: pointer;
      transition: outline 0.15s ease, box-shadow 0.15s ease;
    }
    /* Hover on component itself */
    [data-component-id]:hover:not(.selected) {
      outline: 3px dashed rgb(139, 92, 246) !important;
      outline-offset: 2px;
    }
    /* Hover on any descendant of component - show parent's outline */
    [data-component-id]:has(*:hover):not(.selected):not(:hover) {
      outline: 3px dashed rgb(139, 92, 246) !important;
      outline-offset: 2px;
    }
    [data-component-id].selected {
      outline: 4px solid rgb(139, 92, 246) !important;
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.25) !important;
    }
  </style>
  <script>
    console.log('[V2 Frame] Interactive mode active');
    
    // Collect all components in a flat list with DFS
    function collectComponents(component, list = []) {
      list.push(component);
      if (component.children) {
        component.children.forEach(child => collectComponents(child, list));
      }
      return list;
    }
    
    // Collect all DOM elements in a flat list with DFS
    function collectDOMElements(element, list = []) {
      list.push(element);
      for (let i = 0; i < element.children.length; i++) {
        collectDOMElements(element.children[i], list);
      }
      return list;
    }
    
    // Try to match components to DOM elements by count and structure
    function matchAndApplyAttributes() {
      const rootData = ${JSON.stringify(rootComponent)};
      const components = collectComponents(rootData);
      
      console.log('[V2] Found', components.length, 'components:', 
        components.map(c => ({id: c.id, type: c.component})));
      
      // Get all DOM elements
      const rootElement = document.body.firstElementChild;
      if (!rootElement) {
        console.error('[V2] No root element found');
        return;
      }
      
      const domElements = collectDOMElements(rootElement);
      console.log('[V2] Found', domElements.length, 'DOM elements:', 
        domElements.map(el => el.tagName));
      
      // Strategy: For each component, find a matching DOM element
      // Match by looking for specific patterns (TABLE for Container, etc)
      const componentToDom = [];
      
      components.forEach(component => {
        // Find a DOM element that hasn't been assigned yet
        let matchedElement = null;
        
        if (component.component === 'Container') {
          // Container should be the root TABLE
          matchedElement = domElements.find(el => 
            el.tagName === 'TABLE' && !componentToDom.some(entry => entry.domElement === el)
          );
        } else if (component.component === 'Section') {
          // Section could be TABLE or TBODY
          matchedElement = domElements.find(el => 
            (el.tagName === 'TABLE' || el.tagName === 'TBODY') && 
            !componentToDom.some(entry => entry.domElement === el)
          );
        } else if (component.component === 'Heading') {
          // Heading should match to the actual H1/H2/H3/H4/H5/H6 element first, fallback to TD
          matchedElement = domElements.find(el => 
            (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || 
             el.tagName === 'H4' || el.tagName === 'H5' || el.tagName === 'H6') && 
            !componentToDom.some(entry => entry.domElement === el)
          ) || domElements.find(el => 
            el.tagName === 'TD' && 
            !componentToDom.some(entry => entry.domElement === el)
          );
        } else if (component.component === 'Text') {
          // Text should match to P element first, fallback to TD
          matchedElement = domElements.find(el => 
            el.tagName === 'P' && 
            !componentToDom.some(entry => entry.domElement === el)
          ) || domElements.find(el => 
            el.tagName === 'TD' && 
            !componentToDom.some(entry => entry.domElement === el)
          );
        } else if (component.component === 'Button') {
          // Button should match to A tag first, fallback to TD
          matchedElement = domElements.find(el => 
            el.tagName === 'A' && 
            !componentToDom.some(entry => entry.domElement === el)
          ) || domElements.find(el => 
            el.tagName === 'TD' && 
            !componentToDom.some(entry => entry.domElement === el)
          );
        }
        
        if (matchedElement) {
          componentToDom.push({ componentId: component.id, domElement: matchedElement, component });
          console.log('[V2] Matched', component.id, '(' + component.component + ') to', matchedElement.tagName);
        } else {
          console.warn('[V2] Could not match component:', component.id, component.component);
        }
      });
      
      // Apply attributes in normal order - parents first
      componentToDom.forEach(({ componentId, domElement }) => {
        domElement.setAttribute('data-component-id', componentId);
        
        const allDescendants = domElement.querySelectorAll('*');
        allDescendants.forEach(desc => {
          if (!desc.hasAttribute('data-component-id')) {
            desc.setAttribute('data-component-id', componentId);
          }
        });
      });
      
      // Single click handler using event delegation
      document.body.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        // Find component - check target element first, then search ancestors
        let target = e.target;
        if (!target.hasAttribute('data-component-id')) {
          target = target.closest('[data-component-id]');
        }
        if (!target) return;
        
        const clickedId = target.getAttribute('data-component-id');
        const entry = componentToDom.find(c => c.componentId === clickedId);
        
        if (entry) {
          console.log('[V2 Frame] Component clicked:', {
            id: clickedId,
            type: entry.component.component,
            element: target.tagName
          });
          
          const bounds = entry.domElement.getBoundingClientRect();
          window.parent.postMessage({ 
            type: 'component-click', 
            componentId: clickedId,
            bounds: {
              x: bounds.x,
              y: bounds.y,
              width: bounds.width,
              height: bounds.height,
              top: bounds.top,
              left: bounds.left,
              bottom: bounds.bottom,
              right: bounds.right
            }
          }, '*');
        }
      });
      
      console.log('[V2 Frame] Applied attributes to', componentToDom.length, 'elements');
    }
    
    // Initialize when DOM ready
    matchAndApplyAttributes();
  </script>
  ` : `
  <style>
    [data-component-id].selected {
      outline: 4px solid rgb(139, 92, 246) !important;
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.25) !important;
    }
  </style>
  <script>
    console.log('[V2 Frame] Static mode - no interactions');
    // Just add data attributes for selection styling
    function addComponentIds(element, component) {
      if (component.id) {
        element.setAttribute('data-component-id', component.id);
      }
      if (component.children && element.children) {
        for (let i = 0; i < component.children.length && i < element.children.length; i++) {
          addComponentIds(element.children[i], component.children[i]);
        }
      }
    }
    
    const rootData = ${JSON.stringify(rootComponent)};
    if (document.body.firstElementChild) {
      addComponentIds(document.body.firstElementChild, rootData);
    }
  </script>
  `}
  
  <script>
    // Update selection styling (always present)
    const selectedId = ${JSON.stringify(selectedComponentId)};
    if (selectedId) {
      document.querySelectorAll('[data-component-id]').forEach(el => {
        el.classList.remove('selected');
      });
      const selected = document.querySelector(\`[data-component-id="\${selectedId}"]\`);
      if (selected) {
        selected.classList.add('selected');
        selected.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  </script>
</body>`
      )
    : '';

  return (
    <div className={`h-full overflow-hidden ${className}`} data-email-frame>
      {isRendering && (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Rendering email...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="h-full flex items-center justify-center bg-red-50 p-6">
          <div className="text-center max-w-md">
            <p className="text-sm font-medium text-red-900 mb-2">Rendering Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {!isRendering && !error && (
        <div className="h-full overflow-auto bg-gray-100 p-8">
          <div
            className="mx-auto bg-white shadow-lg"
            style={{
              width: deviceMode === 'mobile' ? '375px' : '600px',
              minHeight: '400px',
            }}
          >
            <iframe
              key={onComponentClick ? 'interactive' : 'static'}
              ref={iframeRef}
              title="Email Preview"
              srcDoc={interactiveHtml}
              className="w-full h-full border-0"
              style={{ minHeight: '600px' }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
}

