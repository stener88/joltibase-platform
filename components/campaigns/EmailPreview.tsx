'use client';

import { useState, useRef, useEffect } from 'react';

interface EmailPreviewProps {
  html: string;
  mode: 'desktop' | 'mobile';
}

export function EmailPreview({ html, mode }: EmailPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy HTML:', err);
    }
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={copyHtml}
          className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy HTML
            </>
          )}
        </button>
        <button
          onClick={downloadHtml}
          className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>

      {/* Email Preview Iframe */}
      <div className="flex justify-center">
        <div
          className={`bg-gray-100 p-4 rounded-lg transition-all ${
            mode === 'mobile' ? 'w-[375px]' : 'w-full'
          }`}
        >
          <div className="bg-white rounded shadow-lg overflow-hidden">
            <iframe
              ref={iframeRef}
              title="Email Preview"
              className={`w-full border-0 ${
                mode === 'mobile' ? 'h-[667px]' : 'h-[800px]'
              }`}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        {mode === 'mobile' ? (
          <p>Mobile view (375px × 667px)</p>
        ) : (
          <p>Desktop view - Email clients may render differently</p>
        )}
      </div>
    </div>
  );
}

