'use client';

import { useState, useRef, useEffect } from 'react';
// Icons no longer needed in this component (moved to parent)

export type DeviceMode = 'desktop' | 'mobile';
export type ViewMode = 'html' | 'text';

interface EmailPreviewProps {
  html: string;
  plainText?: string;
  subject?: string;
  deviceMode?: DeviceMode;
  viewMode?: ViewMode;
  onDeviceModeChange?: (mode: DeviceMode) => void;
  onViewModeChange?: (mode: ViewMode) => void;
}

export function EmailPreview({
  html,
  plainText = '',
  subject,
  deviceMode = 'desktop',
  viewMode = 'html',
  onDeviceModeChange,
  onViewModeChange,
}: EmailPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [localDeviceMode, setLocalDeviceMode] = useState<DeviceMode>(deviceMode);
  const [localViewMode, setLocalViewMode] = useState<ViewMode>(viewMode);
  const [iframeHeight, setIframeHeight] = useState<number>(800);

  // Sync with props
  useEffect(() => {
    setLocalDeviceMode(deviceMode);
  }, [deviceMode]);

  useEffect(() => {
    setLocalViewMode(viewMode);
  }, [viewMode]);

  // Update iframe content when HTML changes
  useEffect(() => {
    if (iframeRef.current && localViewMode === 'html') {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        
        // Inject CSS to disable iframe internal scrolling
        const style = doc.createElement('style');
        style.textContent = `
          body { overflow: hidden !important; margin: 0; padding: 0; }
        `;
        doc.head.appendChild(style);
        
        // Set iframe height to match content
        const updateHeight = () => {
          const body = doc.body;
          const html = doc.documentElement;
          const height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.scrollHeight,
            html.offsetHeight
          );
          iframe.style.height = `${height}px`;
          setIframeHeight(height); // Save height to state
        };
        
        // Update immediately and after images load
        setTimeout(updateHeight, 100);
        window.addEventListener('load', updateHeight);
      }
    }
  }, [html, localViewMode]);

  const handleDeviceModeChange = (mode: DeviceMode) => {
    setLocalDeviceMode(mode);
    onDeviceModeChange?.(mode);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setLocalViewMode(mode);
    onViewModeChange?.(mode);
  };

  const getDeviceWidth = () => {
    switch (localDeviceMode) {
      case 'mobile':
        return '375px';
      case 'desktop':
      default:
        return '600px';
    }
  };

  const getScale = () => {
    // Mobile: scale 600px email to fit 375px viewport
    return localDeviceMode === 'mobile' ? 0.625 : 1;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex justify-center items-start">
        {localViewMode === 'html' ? (
          <div style={{ 
            width: getDeviceWidth(),
            overflow: 'hidden',
            height: localDeviceMode === 'mobile' ? `${iframeHeight * getScale()}px` : undefined
          }}>
            <iframe
              ref={iframeRef}
              title="Email Preview"
              className="border-0"
              style={{ 
                width: '600px',
                minHeight: '800px',
                transform: `scale(${getScale()})`,
                transformOrigin: 'top left'
              }}
              sandbox="allow-same-origin"
            />
          </div>
        ) : (
          <div className="w-full max-w-3xl p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
              {plainText || 'No plain text version available'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
