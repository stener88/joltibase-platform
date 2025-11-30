'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { EditMode } from './EmailEditorV3';
import type { ComponentMap } from '@/lib/email-v3/tsx-parser';
import { Z_INDEX } from '@/lib/ui-constants';
import { calculateSmartToolbarPosition, type ElementRect } from '@/lib/email-v3/smart-positioning';

interface LivePreviewProps {
  workingTsxRef: React.MutableRefObject<string>; // Ref to working TSX (no re-renders on edit!)
  renderVersion: number; // Version counter to trigger re-renders
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

// Helper: Extract inline styles from rendered HTML for a component
function extractStylesFromHtml(html: string, componentId: string): Record<string, string> {
  // Find the element with this component ID and extract its style attribute
  const regex = new RegExp(`data-component-id="${componentId}"[^>]*style="([^"]*)"`, 'i');
  const match = html.match(regex);
  
  if (!match) return {};
  
  const styleString = match[1];
  const styles: Record<string, string> = {};
  
  // Parse "color: rgb(0,0,0); background-color: blue; padding: 10px"
  styleString.split(';').forEach(pair => {
    const [key, value] = pair.split(':').map(s => s?.trim());
    if (key && value) {
      styles[key] = value;
    }
  });
  
  return styles;
}

// Helper: Extract text content from rendered HTML for a component
function extractTextFromHtml(html: string, componentId: string): string {
  // Find the opening tag
  const openingRegex = new RegExp(`<([^\\s>]+)[^>]*data-component-id="${componentId}"[^>]*>`, 'i');
  const openingMatch = html.match(openingRegex);
  
  if (!openingMatch) return '';
  
  const tagName = openingMatch[1];
  const startPos = openingMatch.index! + openingMatch[0].length;
  
  // Find the corresponding closing tag
  const closingTag = `</${tagName}>`;
  const closingPos = html.indexOf(closingTag, startPos);
  
  if (closingPos === -1) return ''; // Self-closing tag
  
  // Extract content between tags
  const content = html.substring(startPos, closingPos);
  
  // Strip HTML tags and decode entities
  const textOnly = content
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return textOnly;
}

export function LivePreview({
  workingTsxRef,
  renderVersion,
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
              
              // Typography properties
              case 'fontSize':
                element.style.fontSize = value;
                break;
              case 'fontWeight':
                element.style.fontWeight = value;
                break;
              case 'lineHeight':
                element.style.lineHeight = value;
                break;
              case 'textAlign':
                element.style.textAlign = value;
                break;
              
              // Spacing properties - Margin
              case 'marginTop':
                element.style.marginTop = value + 'px';
                break;
              case 'marginBottom':
                element.style.marginBottom = value + 'px';
                break;
              case 'marginLeft':
                element.style.marginLeft = value + 'px';
                break;
              case 'marginRight':
                element.style.marginRight = value + 'px';
                break;
              
              // Spacing properties - Padding
              case 'paddingTop':
                element.style.paddingTop = value + 'px';
                break;
              case 'paddingBottom':
                element.style.paddingBottom = value + 'px';
                break;
              case 'paddingLeft':
                element.style.paddingLeft = value + 'px';
                break;
              case 'paddingRight':
                element.style.paddingRight = value + 'px';
                break;
              
              // Border properties
              case 'borderRadius':
                element.style.borderRadius = value;
                break;
              case 'borderWidth':
                element.style.borderWidth = value;
                break;
              case 'borderColor':
                element.style.borderColor = value;
                break;
              case 'borderStyle':
                element.style.borderStyle = value;
                break;
              
              // Link properties
              case 'href':
                if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                  element.setAttribute('href', value);
                }
                break;
              
              // Image properties
              case 'imageSrc':
                // Parse JSON image data
                try {
                  const imageData = JSON.parse(value);
                  if (element.tagName === 'IMG') {
                    element.src = imageData.url;
                    if (imageData.alt) element.alt = imageData.alt;
                    if (imageData.width) element.width = imageData.width;
                    if (imageData.height) element.height = imageData.height;
                  }
                } catch (e) {
                  console.error('[IFRAME] Failed to parse image data:', e);
                }
                break;
              case 'imageAlt':
                if (element.tagName === 'IMG') {
                  element.alt = value;
                }
                break;
              case 'imageWidth':
                if (element.tagName === 'IMG') {
                  element.width = parseInt(value, 10);
                }
                break;
              case 'imageHeight':
                if (element.tagName === 'IMG') {
                  element.height = parseInt(value, 10);
                }
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
            
            // Send raw element rect to parent for coordinate transformation
            window.parent.postMessage({ 
              type: 'component-select', 
              componentId,
              elementRect: {
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right,
                width: rect.width,
                height: rect.height,
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
        
        // Handle scroll - update toolbar position
        let scrollTimeout;
        window.addEventListener('scroll', () => {
          if (!selectedComponentId) return;
          
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            const element = document.querySelector('[data-component-id="' + selectedComponentId + '"]');
            if (!element) return;
            
            const rect = element.getBoundingClientRect();
            
            console.log('[IFRAME] Scroll update for', selectedComponentId);
            
            window.parent.postMessage({
              type: 'component-position-update',
              componentId: selectedComponentId,
              elementRect: {
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right,
                width: rect.width,
                height: rect.height,
              }
            }, '*');
          }, 16); // ~60fps smooth updates
        }, { passive: true });
        
        // Handle keyboard - Escape to deselect
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && selectedComponentId && window.parent) {
            console.log('[IFRAME] Escape pressed, deselecting');
            updateSelectedClass(null);
            window.parent.postMessage({ 
              type: 'component-select', 
              componentId: null
            }, '*');
          }
        });
        
        console.log('[IFRAME] Event listeners registered (click, hover, scroll, keyboard)');
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
      
      // Enhance componentMap with computed styles and text content from rendered HTML
      const enhancedComponentMap: ComponentMap = {};
      Object.keys(data.componentMap || {}).forEach(componentId => {
        enhancedComponentMap[componentId] = {
          ...data.componentMap[componentId],
          computedStyles: extractStylesFromHtml(data.html, componentId),
          textContent: extractTextFromHtml(data.html, componentId),
        };
      });
      
      setPreviewHtml(interactiveHtml);
      setComponentMap(enhancedComponentMap);
      
      // Notify parent of enhanced component map (with computed styles)
      onComponentMapUpdate(enhancedComponentMap);
    } catch (error) {
      console.error('[LIVE-PREVIEW] Render error:', error);
      setPreviewHtml(generateErrorHtml(error));
    } finally {
      setIsRendering(false);
    }
  }, [onComponentMapUpdate]);

  // Render on version change (triggered by AI updates or visual edit saves)
  // ✅ CRITICAL: Only re-renders on renderVersion changes, NOT on every edit!
  useEffect(() => {
    const currentTsx = workingTsxRef.current;
    if (!currentTsx) {
      console.warn('[LIVE-PREVIEW] No TSX code in ref');
      return;
    }

    console.log('[LIVE-PREVIEW] Render triggered by version change:', renderVersion, '| TSX length:', currentTsx.length);
    renderPreview(currentTsx, mode);
  }, [renderVersion, mode, renderPreview, workingTsxRef]); // Only re-render on version/mode changes!

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
          <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f9fafb;">
            <div style="text-align: center;">
              <div style="width: 48px; height: 48px; border: 4px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">Loading email preview...</p>
            </div>
          </div>
          <style>
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
          
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
                  
                  // Typography properties
                  case 'fontSize':
                    element.style.fontSize = value;
                    break;
                  case 'fontWeight':
                    element.style.fontWeight = value;
                    break;
                  case 'lineHeight':
                    element.style.lineHeight = value;
                    break;
                  case 'textAlign':
                    element.style.textAlign = value;
                    break;
                  
                  // Spacing properties - Margin
                  case 'marginTop':
                    element.style.marginTop = value + 'px';
                    break;
                  case 'marginBottom':
                    element.style.marginBottom = value + 'px';
                    break;
                  case 'marginLeft':
                    element.style.marginLeft = value + 'px';
                    break;
                  case 'marginRight':
                    element.style.marginRight = value + 'px';
                    break;
                  
                  // Spacing properties - Padding
                  case 'paddingTop':
                    element.style.paddingTop = value + 'px';
                    break;
                  case 'paddingBottom':
                    element.style.paddingBottom = value + 'px';
                    break;
                  case 'paddingLeft':
                    element.style.paddingLeft = value + 'px';
                    break;
                  case 'paddingRight':
                    element.style.paddingRight = value + 'px';
                    break;
                  
                  // Border properties
                  case 'borderRadius':
                    element.style.borderRadius = value;
                    break;
                  case 'borderWidth':
                    element.style.borderWidth = value;
                    break;
                  case 'borderColor':
                    element.style.borderColor = value;
                    break;
                  case 'borderStyle':
                    element.style.borderStyle = value;
                    break;
                  
                  // Link properties
                  case 'href':
                    if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                      element.setAttribute('href', value);
                    }
                    break;
                  
                  // Image properties
                  case 'imageSrc':
                    // Parse JSON image data
                    try {
                      const imageData = JSON.parse(value);
                      if (element.tagName === 'IMG') {
                        element.src = imageData.url;
                        if (imageData.alt) element.alt = imageData.alt;
                        if (imageData.width) element.width = imageData.width;
                        if (imageData.height) element.height = imageData.height;
                      }
                    } catch (e) {
                      console.error('[IFRAME] Failed to parse image data:', e);
                    }
                    break;
                  case 'imageAlt':
                    if (element.tagName === 'IMG') {
                      element.alt = value;
                    }
                    break;
                  case 'imageWidth':
                    if (element.tagName === 'IMG') {
                      element.width = parseInt(value, 10);
                    }
                    break;
                  case 'imageHeight':
                    if (element.tagName === 'IMG') {
                      element.height = parseInt(value, 10);
                    }
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
                  elementRect: {
                    top: rect.top,
                    left: rect.left,
                    bottom: rect.bottom,
                    right: rect.right,
                    width: rect.width,
                    height: rect.height,
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
      const { componentId, elementRect } = event.data;
      console.log('[LIVE-PREVIEW] Component selected:', componentId);
      
      if (componentId && elementRect && iframeRef.current) {
        // Get iframe position in parent viewport
        const iframeRect = iframeRef.current.getBoundingClientRect();
        
        // Use smart positioning to calculate optimal toolbar position
        // Pass iframe bounds as the safe area (semantically correct!)
        const smartPosition = calculateSmartToolbarPosition(
          {
            top: iframeRect.top,
            left: iframeRect.left,
            bottom: iframeRect.bottom,
            right: iframeRect.right,
            width: iframeRect.width,
            height: iframeRect.height,
          },
          elementRect as ElementRect,
          { width: 320, height: 60 }, // Toolbar dimensions
          { 
            left: iframeRect.left,
            top: iframeRect.top,
            right: iframeRect.right,
            bottom: iframeRect.bottom,
          }
        );
        
        console.log('[LIVE-PREVIEW] Smart position:', smartPosition.placement, smartPosition);
        onComponentSelect(componentId, { top: smartPosition.top, left: smartPosition.left });
      } else {
        onComponentSelect(null);
      }
    } else if (event.data.type === 'component-position-update') {
      // Handle scroll updates - recalculate position
      const { componentId, elementRect } = event.data;
      
      if (componentId && elementRect && iframeRef.current) {
        const iframeRect = iframeRef.current.getBoundingClientRect();
        
        const smartPosition = calculateSmartToolbarPosition(
          {
            top: iframeRect.top,
            left: iframeRect.left,
            bottom: iframeRect.bottom,
            right: iframeRect.right,
            width: iframeRect.width,
            height: iframeRect.height,
          },
          elementRect as ElementRect,
          { width: 320, height: 60 },
          { 
            left: iframeRect.left,
            top: iframeRect.top,
            right: iframeRect.right,
            bottom: iframeRect.bottom,
          }
        );
        
        onComponentSelect(componentId, { top: smartPosition.top, left: smartPosition.left });
      }
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
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
          style={{ zIndex: Z_INDEX.VISUAL_EDITOR_LOADING }}
        >
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
        tabIndex={-1}
        title="Email Preview"
      />

    </div>
  );
}

