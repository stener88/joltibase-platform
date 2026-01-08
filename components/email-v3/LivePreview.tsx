'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { EditMode } from './EmailEditorV3';
import type { ComponentMap } from '@/lib/email-v3/tsx-parser';
import { parseAndInjectIds } from '@/lib/email-v3/tsx-parser';
import { Z_INDEX } from '@/lib/ui-constants';
import { calculateSmartToolbarPosition, type ElementRect } from '@/lib/email-v3/smart-positioning';

interface LivePreviewProps {
  tsxCode: string; // ✅ NEW: Direct prop instead of ref
  tsxCodeSource: 'initial' | 'visual' | 'ai'; // ✅ NEW: Track the source of TSX updates
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
  onIframeReady?: (syncFn: (id: string | null) => void) => void;
  isToolbarLoading?: boolean; // When true, hide big overlay (toolbar has its own inline loading)
  previewMode?: 'desktop' | 'mobile'; // Preview width mode
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
    // Decode numeric HTML entities (hex &#xNNN; and decimal &#NNN;)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return textOnly;
}

export function LivePreview({
  tsxCode,
  tsxCodeSource,
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
  onIframeReady,
  isToolbarLoading = false,
  previewMode = 'desktop',
}: LivePreviewProps) {
  // Local iframe ref (not passed from parent)
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Expose sync function when iframe loads
  const handleIframeLoad = useCallback(() => {
    if (!onIframeReady) return;
    
    onIframeReady((componentId) => {
      iframeRef.current?.contentWindow?.postMessage({
        type: 'update-selection',
        componentId
      }, '*');
    });
  }, [onIframeReady]);
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
          outline: 2px dashed #5f6ad1;
          outline-offset: 2px;
        }
        ` : ''}
        /* Selected state - solid outline, NO background */
        [data-component-id].selected {
          outline: 3px solid #5f6ad1 !important;
          outline-offset: 2px;
        }
        /* Component type label - only in visual mode */
        ${currentMode === 'visual' ? `
        [data-component-id]::before {
          content: attr(data-component-type);
          position: absolute;
          top: -22px;
          left: 0;
          background: #5f6ad1;
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
        
        /* HR (Horizontal Rule) Fixes - Prevent overflow & improve clickability */
        hr[data-component-id], hr {
          max-width: 100% !important;
          width: 100% !important;
          box-sizing: border-box !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        
        /* Make HR elements easier to click - larger hit zone */
        ${currentMode === 'visual' ? `
        hr[data-component-id] {
          position: relative;
          cursor: pointer !important;
          min-height: 20px !important;
          display: flex;
          align-items: center;
        }
        
        /* Larger click target without changing visual appearance */
        hr[data-component-id]::after {
          content: '';
          position: absolute;
          top: -12px;
          bottom: -12px;
          left: 0;
          right: 0;
          cursor: pointer;
        }
        ` : ''}
      </style>
      <script>
        // Handle direct updates from parent
        window.addEventListener('message', (event) => {
          if (event.data.type === 'direct-update') {
            const { componentId, property, value } = event.data;
            const element = document.querySelector('[data-component-id="' + componentId + '"]');
            
            if (!element) {
              return;
            }
            
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
              case 'fontFamily':
                element.style.fontFamily = value;
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
                // Unknown property - silently ignore
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
            }
          } else {
            selectedComponentId = null;
          }
        }
        
        // Listen for selection updates from parent (e.g., "Select Parent" button)
        window.addEventListener('message', (e) => {
          if (e.data.type === 'update-selection') {
            updateSelectedClass(e.data.componentId);
          }
        });
        
        // Handle clicks
        document.addEventListener('click', (e) => {
          const target = e.target.closest('[data-component-id]');
          
          if (target && window.parent) {
            // Clicked on a component
            e.preventDefault();
            const componentId = target.getAttribute('data-component-id');
            const rect = target.getBoundingClientRect();
            
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
            updateSelectedClass(null);
            window.parent.postMessage({ 
              type: 'component-select', 
              componentId: null
            }, '*');
          }
        });
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
      
      // Inject interactive JavaScript into the rendered HTML (mode-aware)
      const interactiveHtml = injectInteractiveScript(data.html, currentMode);
      
      // Enhance componentMap with computed styles and text content from rendered HTML
      const enhancedComponentMap: ComponentMap = {};
      Object.keys(data.componentMap || {}).forEach(componentId => {
        const extractedText = extractTextFromHtml(data.html, componentId);
        
        enhancedComponentMap[componentId] = {
          ...data.componentMap[componentId],
          computedStyles: extractStylesFromHtml(data.html, componentId),
          textContent: extractedText,
        };
      });
      
      setPreviewHtml(interactiveHtml);
      setComponentMap(enhancedComponentMap);
      
      // Notify parent of enhanced component map (with computed styles)
      onComponentMapUpdate(enhancedComponentMap);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[LIVE-PREVIEW] Render error:', error);
      }
      setPreviewHtml(generateErrorHtml(error));
    } finally {
      setIsRendering(false);
    }
  }, [onComponentMapUpdate]);

  // ========================================
  // ✅ NEW: Render when tsxCode changes (React handles this automatically!)
  // ========================================
  useEffect(() => {
    if (!tsxCode) {return;
    }

    // ✅ OPTION 4: Check source to decide rendering strategy
    if (tsxCodeSource === 'visual') {
      // Parse TSX locally to update componentMap without re-rendering
      try {
        const parsed = parseAndInjectIds(tsxCode);
        
        // Enhance componentMap with text content from current iframe HTML
        const enhancedComponentMap: ComponentMap = {};
        Object.keys(parsed.componentMap).forEach(componentId => {
          const extractedText = previewHtml ? extractTextFromHtml(previewHtml, componentId) : '';
          const componentType = parsed.componentMap[componentId].type;
          
          enhancedComponentMap[componentId] = {
            ...parsed.componentMap[componentId],
            computedStyles: previewHtml ? extractStylesFromHtml(previewHtml, componentId) : {},
            textContent: extractedText,
          };
        });
        
        // Update componentMap (this syncs PropertiesPanel)
        onComponentMapUpdate(enhancedComponentMap);
      } catch (error) {
        // Failed to parse - ignore
      }
      
      // Skip API call and full re-render for visual edits
      return;
    }
    
    // For 'ai' or 'initial' sources, do full render with API call
    renderPreview(tsxCode, mode);
  }, [tsxCode, tsxCodeSource, mode, renderPreview, onComponentMapUpdate]); 
  // ✅ Note: previewHtml is read but NOT a dependency - we don't want to re-run when it changes

  // Send direct update to iframe (instant, no re-render)
  const sendDirectUpdate = useCallback((update: DirectUpdate) => {
    if (!iframeRef.current?.contentWindow) return;
    
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
              background: #000000;
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
              outline: 2px dashed #5f6ad1;
              outline-offset: 2px;
            }
            [data-component-id].selected {
              outline: 2px solid #5f6ad1;
              outline-offset: 2px;
              background: rgba(95, 106, 209, 0.05);
            }
            .component-label {
              position: absolute;
              top: -20px;
              left: 0;
              background: #5f6ad1;
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
          <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #000000;">
            <div style="text-align: center;">
              <div style="width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #5f6ad1; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
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
                  return;
                }
                
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
                    // Unknown property - silently ignore
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
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; background: #000000;">
          <div style="max-width: 600px; margin: 0 auto; background: #0a0a0a; padding: 32px; border-radius: 8px; border-left: 4px solid #ef4444;">
            <h1 style="color: #ef4444; margin: 0 0 16px;">⚠️ Render Error</h1>
            <p style="color: #ffffff; margin: 0 0 16px;">Failed to render email preview:</p>
            <pre style="background: #1a1a1a; color: #ffffff; padding: 16px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${error.message || String(error)}</pre>
          </div>
        </body>
      </html>
    `;
  };

  // Handle postMessage from iframe
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'component-select') {
      const { componentId, elementRect } = event.data;
      
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
          { width: 280, height: 48 }, // Toolbar dimensions
          { 
            left: iframeRect.left,
            top: iframeRect.top,
            right: iframeRect.right,
            bottom: iframeRect.bottom,
          }
        );onComponentSelect(componentId, { top: smartPosition.top, left: smartPosition.left });
      } else {
        onComponentSelect(null);
      }
    } else if (event.data.type === 'component-position-update') {
      // Handle scroll updates - recalculate position
      const { componentId, elementRect } = event.data;
      
      // ✅ Only update position if this component is still selected
      // This prevents toolbar from reappearing after user closes it
      if (componentId === selectedComponentId && elementRect && iframeRef.current) {
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
          { width: 280, height: 48 },
          { 
            left: iframeRect.left,
            top: iframeRect.top,
            right: iframeRect.right,
            bottom: iframeRect.bottom,
          }
        );
        
        onComponentSelect(componentId, { top: smartPosition.top, left: smartPosition.left });
      }
    } else if (event.data.type === 'component-hover') {onComponentHover(event.data.componentId);
    }
  }, [onComponentSelect, onComponentHover, selectedComponentId]);

  // Set up message listener
  useEffect(() => {window.addEventListener('message', handleMessage);
    return () => {window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return (
    <div className="relative h-full w-full bg-background rounded-xl overflow-hidden flex items-center justify-center">
      {/* Loading Overlay (AI generation, rendering, saving, or visual mode transitions) */}
      {/* Hide when toolbar is loading - it has its own inline indicator */}
      {((isGenerating && !isToolbarLoading) || isRendering || isSaving || isEnteringVisualMode || isExitingVisualMode) && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
          style={{ zIndex: Z_INDEX.VISUAL_EDITOR_LOADING }}
        >
          <div className="bg-card rounded-lg p-8 text-center max-w-sm">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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

      {/* Email Preview Container - responsive width based on preview mode */}
      <div 
        className="h-full transition-all duration-300 ease-in-out"
        style={{ 
          width: previewMode === 'mobile' ? '375px' : '100%',
          maxWidth: previewMode === 'mobile' ? '375px' : 'none'
        }}
      >
      <iframe
        ref={iframeRef}
        srcDoc={previewHtml || placeholderHtml}
        className="w-full h-full border-0 rounded-xl"
        sandbox="allow-scripts allow-same-origin"
        tabIndex={-1}
        title="Email Preview"
        onLoad={handleIframeLoad}
      />
      </div>

    </div>
  );
}

