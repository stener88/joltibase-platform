'use client';

import { useState, useRef, useEffect } from 'react';
// Icons no longer needed in this component (moved to parent)

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
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
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  const getDeviceHeight = () => {
    switch (localDeviceMode) {
      case 'mobile':
        return '667px';
      case 'tablet':
        return '1024px';
      case 'desktop':
      default:
        return '800px';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {subject && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-500">Subject:</p>
            <p className="text-lg font-semibold text-gray-900">{subject}</p>
          </div>
        )}

        <div className="flex justify-center">
          {localViewMode === 'html' ? (
            <div
              className="bg-gray-100 p-4 rounded-lg transition-all"
              style={{ width: getDeviceWidth() }}
            >
              <div className="bg-white rounded shadow-lg overflow-hidden">
                <iframe
                  ref={iframeRef}
                  title="Email Preview"
                  className="w-full border-0"
                  style={{ height: getDeviceHeight() }}
                  sandbox="allow-same-origin"
                />
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">
                {localDeviceMode === 'mobile' && '375px × 667px (iPhone)'}
                {localDeviceMode === 'tablet' && '768px × 1024px (iPad)'}
                {localDeviceMode === 'desktop' && 'Full width'}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                {plainText || 'No plain text version available'}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

