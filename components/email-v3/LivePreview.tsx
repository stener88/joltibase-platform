'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { EditMode } from './EmailEditorV3';
import type { ComponentMap } from '@/lib/email-v3/tsx-parser';

interface LivePreviewProps {
  tsxCode: string;
  mode: EditMode;
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  onComponentSelect: (id: string | null, position?: { top: number; left: number }) => void;
  onComponentHover: (id: string | null) => void;
  onComponentMapUpdate: (componentMap: ComponentMap) => void;
  isGenerating: boolean;
  isSaving?: boolean;
  isEnteringVisualMode?: boolean;
  isExitingVisualMode?: boolean;
  iframeKey?: number;
}

export interface DirectUpdate {
  type: 'direct-update';
  componentId: string;
  property: string;
  value: string;
}

export function LivePreview({
  tsxCode,
  mode,
  selectedComponentId,
  hoveredComponentId,
  onComponentSelect,
  onComponentHover,
  onComponentMapUpdate,
  isGenerating,
  isSaving = false,
  isEnteringVisualMode = false,
  isExitingVisualMode = false,
  iframeKey = 0,
}: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [componentMap, setComponentMap] = useState<ComponentMap>({});
  const [isRendering, setIsRendering] = useState(false);
  const renderTimeoutRef = useRef<NodeJS.Timeout>();
  const hasRenderedRef = useRef(false);

  // Inject interactive JavaScript into rendered HTML
  const injectInteractiveScript = (html: string, currentMode: EditMode): string => {
    const interactiveScript = `
      <style>
        [data-component-id] {
          position: relative;
          transition: outline 0.15s ease;
          ${currentMode === 'visual' ? 'cursor: pointer;' : ''}
        }
        /* Only show hover in visual mode, on direct hover, not on child elements */
        ${currentMode === 'visual' ? `
        [data-component-id]:hover:not(:has([data-component-id]:hover)) {
          outline: 2px dashed #3b82f6;
          outline-offset: 2px;
        }
        ` : ''}
        /* Selected state - solid outline, NO background */
        [data-component-id].selected {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px;
        }
        /* Component type label - only in visual mode */
        ${currentMode === 'visual' ? `
        [data-component-id]::before {
          content: attr(data-component-type);
          position: absolute;
          top: -22px;
          left: 0;
          background: #3b82f6;
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 3px;
          text-transform: uppercase;
          display: none;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          pointer-events: none;
        }
        /* Show label only on direct hover or when selected */
        [data-component-id]:hover:not(:has([data-component-id]:hover))::before,
        [data-component-id].selected::before {
          display: block;
        }
        ` : ''}
      </style>
      <script>
        console.log('[IFRAME] Interactive script loaded');
        
        // Handle direct updates from parent
        window.addEventListener('message', (event) => {
          if (event.data.type === 'direct-update') {
            const { componentId, property, value } = event.data;
            const element = document.querySelector('[data-component-id="' + componentId + '"]');
            
            if (!element) {
              console.warn('[IFRAME] Element not found:', componentId);
              return;
            }
            
            console.log('[IFRAME] Direct update:', property, '=', value);
            
            switch (property) {
              case 'text':
              case 'textContent':
                element.textContent = value;
                break;
              case 'color':
              case 'textColor':
                element.style.color = value;
                break;
              case 'backgroundColor':
              case 'bgColor':
                element.style.backgroundColor = value;
                break;
              case 'fontSize':
                element.style.fontSize = value;
                break;
              case 'marginTop':
                element.style.marginTop = value + 'px';
                break;
              case 'marginBottom':
                element.style.marginBottom = value + 'px';
                break;
              case 'paddingTop':
                element.style.paddingTop = value + 'px';
                break;
              case 'paddingBottom':
                element.style.paddingBottom = value + 'px';
                break;
              default:
                console.warn('[IFRAME] Unknown property:', property);
            }
          }
        });
        
        // Track selected component
        let selectedComponentId = null;
        
        // Update selected class
        function updateSelectedClass(componentId) {
          // Remove selected class from all
          document.querySelectorAll('[data-component-id].selected').forEach(el => {
            el.classList.remove('selected');
          });
          
          // Add to selected
          if (componentId) {
            const element = document.querySelector('[data-component-id="' + componentId + '"]');
            if (element) {
              element.classList.add('selected');
              selectedComponentId = componentId;
              console.log('[IFRAME] Applied selected class to', componentId);
            }
          } else {
            selectedComponentId = null;
          }
        }
        
        // Handle clicks
        document.addEventListener('click', (e) => {
          console.log('[IFRAME] Click detected', e.target);
          const target = e.target.closest('[data-component-id]');
          
          if (target && window.parent) {
            // Clicked on a component
            e.preventDefault();
            const componentId = target.getAttribute('data-component-id');
            const rect = target.getBoundingClientRect();
            
            console.log('[IFRAME] Sending component-select for', componentId);
            
            // Update visual selection
            updateSelectedClass(componentId);
            
            window.parent.postMessage({ 
              type: 'component-select', 
              componentId,
              position: {
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) - 150
              }
            }, '*');
          } else if (window.parent) {
            // Clicked on empty space - deselect
            console.log('[IFRAME] Clicked empty space, deselecting');
            updateSelectedClass(null);
            
            window.parent.postMessage({ 
              type: 'component-select', 
              componentId: null
            }, '*');
          }
        });
        
        // Handle hover
        let lastHovered = null;
        document.addEventListener('mouseover', (e) => {
          const target = e.target.closest('[data-component-id]');
          if (target && window.parent) {
            const componentId = target.getAttribute('data-component-id');
            if (componentId !== lastHovered) {
              lastHovered = componentId;
              window.parent.postMessage({ 
                type: 'component-hover', 
                componentId 
              }, '*');
            }
          }
        });
        
        document.addEventListener('mouseout', (e) => {
          const target = e.target.closest('[data-component-id]');
          if (target && !e.relatedTarget?.closest('[data-component-id]') && window.parent) {
            lastHovered = null;
            window.parent.postMessage({ 
              type: 'component-hover', 
              componentId: null 
            }, '*');
          }
        });
        
        console.log('[IFRAME] Event listeners registered');
      </script>
    `;
    
    // Inject before </body> tag
    return html.replace('</body>', `${interactiveScript}</body>`);
  };

  // Render TSX to HTML with component IDs
  const renderPreview = useCallback(async (tsx: string, currentMode: EditMode) => {
    setIsRendering(true);
    
    try {
      const response = await fetch('/api/v3/campaigns/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tsxCode: tsx }),
      });

      if (!response.ok) {
        throw new Error(`Render failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('[LIVE-PREVIEW] Rendered with', Object.keys(data.componentMap || {}).length, 'components');
      
      // Inject interactive JavaScript into the rendered HTML (mode-aware)
      const interactiveHtml = injectInteractiveScript(data.html, currentMode);
      
      setPreviewHtml(interactiveHtml);
      setComponentMap(data.componentMap || {});
      
      // Notify parent of component map update
      onComponentMapUpdate(data.componentMap || {});
    } catch (error) {
      console.error('[LIVE-PREVIEW] Render error:', error);
      setPreviewHtml(generateErrorHtml(error));
    } finally {
      setIsRendering(false);
    }
  }, [onComponentMapUpdate]);

  // Render on TSX change or mode change (including initial mount)
  useEffect(() => {
    if (!tsxCode) {
      console.warn('[LIVE-PREVIEW] No TSX code provided');
      return;
    }

    // First render - immediate, no debounce
    if (!hasRenderedRef.current) {
      console.log('[LIVE-PREVIEW] Initial render (immediate)', { tsxLength: tsxCode.length, mode });
      hasRenderedRef.current = true;
      renderPreview(tsxCode, mode);
      return;
    }

    // Skip re-render if in visual mode (rely on direct updates)
    if (mode === 'visual') {
      console.log('[LIVE-PREVIEW] Visual mode - skipping auto re-render (direct updates only)');
      return;
    }

    // Subsequent renders - debounced (chat mode or AI edits)
    console.log('[LIVE-PREVIEW] TSX or mode changed, scheduling debounced render', { tsxLength: tsxCode.length, mode });
    
    // Clear existing timeout
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    // Debounce render (300ms)
    renderTimeoutRef.current = setTimeout(() => {
      console.log('[LIVE-PREVIEW] Executing render after debounce');
      renderPreview(tsxCode, mode);
    }, 300);

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [tsxCode, mode, renderPreview]);

  // Send direct update to iframe (instant, no re-render)
  const sendDirectUpdate = useCallback((update: DirectUpdate) => {
    if (!iframeRef.current?.contentWindow) return;
    
    console.log('[LIVE-PREVIEW] Sending direct update:', update);
    
    iframeRef.current.contentWindow.postMessage(update, '*');
  }, []);

  // Expose sendDirectUpdate for parent component
  useEffect(() => {
    // Store reference on window for parent to access
    (window as any).__livePreviewSendDirectUpdate = sendDirectUpdate;
    
    return () => {
      delete (window as any).__livePreviewSendDirectUpdate;
    };
  }, [sendDirectUpdate]);

  // Placeholder HTML for initial load
  const placeholderHtml = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Preview</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background: #f0f0f0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            [data-component-id] {
              position: relative;
              transition: outline 0.15s ease;
            }
            [data-component-id]:hover {
              outline: 2px dashed #3b82f6;
              outline-offset: 2px;
            }
            [data-component-id].selected {
              outline: 2px solid #3b82f6;
              outline-offset: 2px;
              background: rgba(59, 130, 246, 0.05);
            }
            .component-label {
              position: absolute;
              top: -20px;
              left: 0;
              background: #3b82f6;
              color: white;
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 3px;
              font-weight: 600;
              text-transform: uppercase;
              display: none;
            }
            [data-component-id]:hover .component-label,
            [data-component-id].selected .component-label {
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div data-component-id="header-1" class="${selectedComponentId === 'header-1' ? 'selected' : ''}">
              <span class="component-label">h1</span>
              <h1 style="color: #007fff; font-size: 48px; margin: 0 0 16px;">Your Big things</h1>
            </div>
            
            <div data-component-id="text-1" class="${selectedComponentId === 'text-1' ? 'selected' : ''}">
              <span class="component-label">text</span>
              <p style="color: #666; font-size: 18px; line-height: 1.6; margin: 0 0 32px;">
                Transform your ideas into reality with powerful tools designed for modern creators and innovators
              </p>
            </div>
            
            <div data-component-id="buttons-1" style="display: flex; gap: 12px;">
              <div data-component-id="button-1" class="${selectedComponentId === 'button-1' ? 'selected' : ''}">
                <span class="component-label">button</span>
                <a href="#" style="background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                  Get Started →
                </a>
              </div>
              
              <div data-component-id="button-2" class="${selectedComponentId === 'button-2' ? 'selected' : ''}">
                <span class="component-label">button</span>
                <a href="#" style="background: #007fff; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                  Jolt
                </a>
              </div>
            </div>
          </div>
          
          <script>
            // Handle direct updates from parent (INSTANT, NO RE-RENDER)
            window.addEventListener('message', (event) => {
              if (event.data.type === 'direct-update') {
                const { componentId, property, value } = event.data;
                const element = document.querySelector('[data-component-id="' + componentId + '"]');
                
                if (!element) {
                  console.warn('[IFRAME] Element not found:', componentId);
                  return;
                }
                
                console.log('[IFRAME] Direct update:', property, '=', value);
                
                // Apply update based on property type
                switch (property) {
                  case 'text':
                  case 'textContent':
                    element.textContent = value;
                    break;
                  case 'color':
                  case 'textColor':
                    element.style.color = value;
                    break;
                  case 'backgroundColor':
                  case 'bgColor':
                    element.style.backgroundColor = value;
                    break;
                  case 'fontSize':
                    element.style.fontSize = value;
                    break;
                  case 'marginTop':
                    element.style.marginTop = value + 'px';
                    break;
                  case 'marginBottom':
                    element.style.marginBottom = value + 'px';
                    break;
                  case 'paddingTop':
                    element.style.paddingTop = value + 'px';
                    break;
                  case 'paddingBottom':
                    element.style.paddingBottom = value + 'px';
                    break;
                  default:
                    console.warn('[IFRAME] Unknown property:', property);
                }
              }
            });
            
            // Handle clicks
            document.addEventListener('click', (e) => {
              const target = e.target.closest('[data-component-id]');
              if (target && window.parent) {
                e.preventDefault();
                const componentId = target.getAttribute('data-component-id');
                const rect = target.getBoundingClientRect();
                
                window.parent.postMessage({ 
                  type: 'component-select', 
                  componentId,
                  position: {
                    top: rect.bottom + 8,
                    left: rect.left + (rect.width / 2) - 150
                  }
                }, '*');
              }
            });
            
            // Handle hover
            let lastHovered = null;
            document.addEventListener('mouseover', (e) => {
              const target = e.target.closest('[data-component-id]');
              if (target && window.parent) {
                const componentId = target.getAttribute('data-component-id');
                if (componentId !== lastHovered) {
                  lastHovered = componentId;
                  window.parent.postMessage({ 
                    type: 'component-hover', 
                    componentId 
                  }, '*');
                }
              }
            });
            
            document.addEventListener('mouseout', (e) => {
              const target = e.target.closest('[data-component-id]');
              if (target && !e.relatedTarget?.closest('[data-component-id]') && window.parent) {
                lastHovered = null;
                window.parent.postMessage({ 
                  type: 'component-hover', 
                  componentId: null 
                }, '*');
              }
            });
          </script>
        </body>
      </html>
    `;
  }, [selectedComponentId]);

  // Generate error HTML
  const generateErrorHtml = (error: any): string => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Render Error</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; background: #fef2f2;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 32px; border-radius: 8px; border-left: 4px solid #dc2626;">
            <h1 style="color: #dc2626; margin: 0 0 16px;">⚠️ Render Error</h1>
            <p style="color: #374151; margin: 0 0 16px;">Failed to render email preview:</p>
            <pre style="background: #f3f4f6; padding: 16px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${error.message || String(error)}</pre>
          </div>
        </body>
      </html>
    `;
  };

  // Handle postMessage from iframe
  const handleMessage = useCallback((event: MessageEvent) => {
    console.log('[LIVE-PREVIEW] Received message:', event.data);
    
    if (event.data.type === 'component-select') {
      console.log('[LIVE-PREVIEW] Component selected:', event.data.componentId);
      onComponentSelect(event.data.componentId, event.data.position);
    } else if (event.data.type === 'component-hover') {
      console.log('[LIVE-PREVIEW] Component hovered:', event.data.componentId);
      onComponentHover(event.data.componentId);
    }
  }, [onComponentSelect, onComponentHover]);

  // Set up message listener
  useEffect(() => {
    console.log('[LIVE-PREVIEW] Setting up message listener');
    window.addEventListener('message', handleMessage);
    return () => {
      console.log('[LIVE-PREVIEW] Removing message listener');
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return (
    <div className="relative h-full w-full bg-gray-50">
      {/* Loading Overlay (AI generation, rendering, saving, or visual mode transitions) */}
      {(isGenerating || isRendering || isSaving || isEnteringVisualMode || isExitingVisualMode) && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm">
            <div className="w-12 h-12 border-4 border-[#e9a589] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isEnteringVisualMode ? 'Preparing visual editor...' :
               isExitingVisualMode ? 'Applying changes...' :
               isSaving ? 'Saving changes...' : 
               isGenerating ? 'AI is updating your email...' : 
               'Rendering preview...'}
            </h3>
            <p className="text-sm text-gray-600">
              {isEnteringVisualMode ? 'Setting up interactive preview' :
               isExitingVisualMode ? 'Saving your edits' :
               isSaving ? 'Your email is being saved' : 
               isGenerating ? 'Hang tight while we apply changes' : 
               'This will just take a moment'}
            </p>
          </div>
        </div>
      )}

      {/* Email Preview */}
      <iframe
        ref={iframeRef}
        key={`email-preview-${iframeKey}`}
        srcDoc={previewHtml || placeholderHtml}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        title="Email Preview"
      />

    </div>
  );
}

