'use client';

import React, { useEffect, useState, useRef } from 'react';
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

function EmailV2FrameComponent({
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
  // Remounting is controlled via key prop change in parent
  // During editing, postMessage handles live updates without re-rendering
  useEffect(() => {
    console.log('[EmailV2Frame] Rendering email HTML');

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
  }, [rootComponent, globalSettings]); // Keep dependencies - key prop controls when component remounts

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
  // IMPORTANT: This HTML is only regenerated when rootComponent or globalSettings change
  // Selection styling is updated via postMessage to avoid reloading iframe
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
    
    // OPTIMIZED APPROACH: Components already have data-component-id injected during rendering
    // Use component registry for O(1) lookups and single delegated event listener
    function matchAndApplyAttributes() {
      console.log('[V2] Starting component matching for visual edit mode');
      
      // Build component registry from rootComponent tree (O(n) once, then O(1) lookups)
      const componentRegistry = new Map();
      const rootData = ${JSON.stringify(rootComponent)};
      
      function addToRegistry(component) {
        if (component && component.id) {
          componentRegistry.set(component.id, component);
        }
        if (component && component.children) {
          component.children.forEach(addToRegistry);
        }
      }
      
      addToRegistry(rootData);
      console.log('[V2] Built component registry with', componentRegistry.size, 'components');
      
      // Find all elements with data-component-id (injected during rendering)
      const elementsWithIds = Array.from(document.querySelectorAll('[data-component-id]'));
      console.log('[V2] Found', elementsWithIds.length, 'elements with data-component-id');
      
      if (elementsWithIds.length === 0) {
        console.warn('[V2] No elements with data-component-id found - attributes may not have been injected during rendering');
        return;
      }
      
      const componentToDom = new Map();
      
      // Build mapping from component ID to DOM elements (use outermost element for nested structures)
      elementsWithIds.forEach(element => {
        const componentId = element.getAttribute('data-component-id');
        if (componentId && !componentToDom.has(componentId)) {
          // Find the outermost element with this ID (parent table if nested)
          let targetElement = element;
          
          // For table cells/rows, prefer the containing table if it also has the same ID
          if (element.tagName === 'TD' || element.tagName === 'TR') {
            const table = element.closest('table');
            if (table && table.hasAttribute('data-component-id') && 
                table.getAttribute('data-component-id') === componentId) {
              targetElement = table;
            }
          }
          
          componentToDom.set(componentId, targetElement);
        }
      });
      
      console.log('[V2] Built DOM mapping for', componentToDom.size, 'components');
      
      // Ensure all descendants also have the data-component-id for click handling
      componentToDom.forEach((domElement, componentId) => {
        const allDescendants = domElement.querySelectorAll('*');
        allDescendants.forEach(desc => {
          if (!desc.hasAttribute('data-component-id')) {
            desc.setAttribute('data-component-id', componentId);
          }
        });
      });
      
      // Single delegated click handler (event delegation pattern)
      document.body.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        // Find component using .closest() - naturally finds nearest component boundary
        const target = e.target.closest('[data-component-id]');
        if (!target) return;
        
        const clickedId = target.getAttribute('data-component-id');
        const componentType = target.getAttribute('data-component-type');
        
        // O(1) lookup in component registry
        const component = componentRegistry.get(clickedId);
        const domElement = componentToDom.get(clickedId);
        
        if (domElement && component) {
          console.log('[V2 Frame] Component clicked:', {
            id: clickedId,
            type: componentType,
            element: target.tagName
          });
          
          const bounds = domElement.getBoundingClientRect();
          window.parent.postMessage({ 
            type: 'component-click', 
            componentId: clickedId,
            componentType: componentType,
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
      
      console.log('[V2 Frame] Applied attributes and click handlers to', componentToDom.size, 'components');
    }
    
    // Listen for selection updates from parent (prevents iframe reload)
    window.addEventListener('message', (event) => {
      if (event.data.type === 'update-selection') {
        const selectedId = event.data.selectedComponentId;
        
        // Remove all selections
        document.querySelectorAll('[data-component-id]').forEach(el => {
          el.classList.remove('selected');
        });
        
        // Add selection to specified component
        if (selectedId) {
          const selected = document.querySelector(\`[data-component-id="\${selectedId}"]\`);
          if (selected) {
            selected.classList.add('selected');
            // Don't scroll - preserve user's scroll position
          }
        }
      }
      
      // Listen for live edit updates (prevents iframe reload during editing)
      if (event.data.type === 'LIVE_EDIT_UPDATE') {
        const { componentId, updates } = event.data;
        const element = document.querySelector(\`[data-component-id="\${componentId}"]\`);
        
        if (!element) return;
        
        // Apply content updates
        if (updates.content !== undefined) {
          element.textContent = updates.content;
        }
        
        // Apply style updates
        if (updates.styles) {
          Object.assign(element.style, updates.styles);
        }
        
        // Apply spacing updates (padding/margin)
        if (updates.spacing) {
          Object.assign(element.style, updates.spacing);
        }
        
        // Apply prop updates
        if (updates.props) {
          Object.entries(updates.props).forEach(([key, value]) => {
            if (key === 'href') element.setAttribute('href', value);
            if (key === 'src') element.setAttribute('src', value);
            if (key === 'alt') element.setAttribute('alt', value);
            // Add more prop mappings as needed
          });
        }
      }
      
      // Listen for delete component (prevents iframe reload)
      if (event.data.type === 'DELETE_COMPONENT') {
        const { componentId } = event.data;
        const element = document.querySelector(\`[data-component-id="\${componentId}"]\`);
        
        if (element) {
          // Hide element instead of removing (so we can restore on discard)
          element.style.display = 'none';
          element.setAttribute('data-deleted', 'true');
        }
      }
    });
    
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
</body>`
      )
    : '';

  // Update selection styling via postMessage (doesn't reload iframe)
  useEffect(() => {
    if (!html || !iframeRef.current || !onComponentClick) return;
    
    const iframe = iframeRef.current;
    const iframeWindow = iframe.contentWindow;
    
    if (iframeWindow) {
      // Send message to update selection without reloading iframe
      iframeWindow.postMessage({
        type: 'update-selection',
        selectedComponentId: selectedComponentId,
      }, '*');
    }
  }, [selectedComponentId, html, onComponentClick]);

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
        <div className="h-full overflow-auto">
          <iframe
            key={onComponentClick ? 'interactive' : 'static'}
            ref={iframeRef}
            title="Email Preview"
            srcDoc={interactiveHtml}
            className="w-full h-full border-0"
            style={{ minHeight: '100%' }}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </div>
  );
}

// Export component directly - remounting is controlled via key prop in parent
export const EmailV2Frame = EmailV2FrameComponent;

