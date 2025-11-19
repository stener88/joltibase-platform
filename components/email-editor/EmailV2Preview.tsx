'use client';

import { useEffect, useRef, useState } from 'react';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';
import { renderEmailComponent, getComponentPath } from '@/lib/email-v2';
import { Loader2 } from 'lucide-react';

interface EmailV2PreviewProps {
  rootComponent: EmailComponent;
  globalSettings: GlobalEmailSettings;
  selectedComponentId?: string | null;
  onComponentClick?: (id: string) => void;
  deviceMode?: 'desktop' | 'mobile';
  className?: string;
}

export function EmailV2Preview({
  rootComponent,
  globalSettings,
  selectedComponentId,
  onComponentClick,
  deviceMode = 'desktop',
  className = '',
}: EmailV2PreviewProps) {
  const [html, setHtml] = useState<string>('');
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Render email HTML
  useEffect(() => {
    const render = async () => {
      setIsRendering(true);
      setError(null);

      try {
        const result = await renderEmailComponent(rootComponent, globalSettings);
        if (result.html) {
          setHtml(result.html);
        } else {
          setError('Failed to generate HTML');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render email');
      } finally {
        setIsRendering(false);
      }
    };

    render();
  }, [rootComponent, globalSettings]);

  // Inject selection styles and click handlers into iframe
  useEffect(() => {
    if (!html || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Write HTML to iframe
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Add data attributes to elements for selection
    const addDataAttributes = (element: HTMLElement, component: EmailComponent) => {
      element.setAttribute('data-component-id', component.id);
      element.setAttribute('data-component-type', component.component);

      // Add hover and selection styles
      element.style.cursor = 'pointer';
      element.style.transition = 'outline 0.2s ease, box-shadow 0.2s ease';

      // Handle click
      if (onComponentClick) {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          onComponentClick(component.id);
        });
      }

      // Handle hover
      element.addEventListener('mouseenter', () => {
        if (component.id !== selectedComponentId) {
          element.style.outline = '2px dashed rgba(139, 92, 246, 0.3)';
        }
      });

      element.addEventListener('mouseleave', () => {
        if (component.id !== selectedComponentId) {
          element.style.outline = 'none';
        }
      });

      // Recursively process children
      if (component.children) {
        const childElements = Array.from(element.children) as HTMLElement[];
        component.children.forEach((child, index) => {
          if (childElements[index]) {
            addDataAttributes(childElements[index], child);
          }
        });
      }
    };

    // Start from body
    const body = iframeDoc.body;
    if (body) {
      addDataAttributes(body, rootComponent);
    }

    // Apply selection styling
    if (selectedComponentId) {
      const selectedElement = iframeDoc.querySelector(
        `[data-component-id="${selectedComponentId}"]`
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.style.outline = '3px solid rgb(139, 92, 246)';
        selectedElement.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.2)';
        
        // Scroll into view
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [html, selectedComponentId, rootComponent, onComponentClick]);

  return (
    <div className={`h-full overflow-hidden ${className}`}>
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
              ref={iframeRef}
              title="Email Preview"
              className="w-full h-full border-0"
              style={{ minHeight: '600px' }}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
}

