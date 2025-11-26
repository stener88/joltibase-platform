'use client';

import { useMemo, useCallback } from 'react';
import type { EditMode } from './EmailEditorV3';

interface LivePreviewProps {
  tsxCode: string;
  mode: EditMode;
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  onComponentSelect: (id: string | null, position?: { top: number; left: number }) => void;
  onComponentHover: (id: string | null) => void;
  isGenerating: boolean;
}

export function LivePreview({
  tsxCode,
  mode,
  selectedComponentId,
  hoveredComponentId,
  onComponentSelect,
  onComponentHover,
  isGenerating,
}: LivePreviewProps) {
  // For now, show HTML rendered preview in iframe
  // TODO: Replace with actual TSX compilation when ready
  const previewHtml = useMemo(() => {
    // Temporary: Just show a placeholder
    // In production, this would compile TSX to React component
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            // Handle clicks
            document.addEventListener('click', (e) => {
              const target = e.target.closest('[data-component-id]');
              if (target && window.parent) {
                e.preventDefault();
                const componentId = target.getAttribute('data-component-id');
                const rect = target.getBoundingClientRect();
                const iframeRect = document.body.getBoundingClientRect();
                
                window.parent.postMessage({ 
                  type: 'component-select', 
                  componentId,
                  position: {
                    top: rect.bottom + 8, // 8px below the component
                    left: rect.left + (rect.width / 2) - 150 // centered, accounting for 300px toolbar width
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
  }, [tsxCode, selectedComponentId]);

  // Handle postMessage from iframe
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'component-select') {
      onComponentSelect(event.data.componentId, event.data.position);
    } else if (event.data.type === 'component-hover') {
      onComponentHover(event.data.componentId);
    }
  }, [onComponentSelect, onComponentHover]);

  // Set up message listener
  useMemo(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [handleMessage]);

  return (
    <div className="relative h-full w-full bg-gray-50">
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm">
            <div className="w-12 h-12 border-4 border-[#e9a589] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your project is being updated...</h3>
            <p className="text-sm text-gray-600">Hang tight while we apply changes</p>
          </div>
        </div>
      )}

      {/* Email Preview */}
      <iframe
        srcDoc={previewHtml}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        title="Email Preview"
      />

      {/* Mode Indicator */}
      {mode === 'visual' && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          Visual Edit Mode
        </div>
      )}
    </div>
  );
}

