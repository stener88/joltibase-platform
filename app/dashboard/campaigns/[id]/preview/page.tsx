'use client';

import { useCampaign } from '@/lib/hooks/useCampaign';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useDynamicEmailComponent } from '@/lib/hooks/useDynamicEmailComponent';

export default function EmailPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const campaignId = params.id as string;
  const { data: campaign } = useCampaign(campaignId);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Compile TSX to React component (same as edit page)
  const { Component, error, loading } = useDynamicEmailComponent(
    campaign?.component_code || '',
    campaign?.instance_props || {}
  );
  
  // Render to static HTML and inject into iframe (same as edit page)
  useEffect(() => {
    if (!Component || error || !iframeRef.current || !campaign) return;
    
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    try {
      // Render React component to static HTML
      const htmlContent = ReactDOMServer.renderToStaticMarkup(
        React.createElement(Component, campaign.instance_props || {})
      );
      
      console.log('[Preview] Rendered HTML length:', htmlContent.length);

      // Write to iframe
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="margin: 0;">
            ${htmlContent}
          </body>
        </html>
      `);
      iframeDoc.close();
    } catch (err) {
      console.error('[Preview] Render error:', err);
    }
  }, [Component, campaign, error]);
  
  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="mt-4">Loading campaign...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Button 
            onClick={() => router.push(`/dashboard/campaigns/${campaignId}/edit`)}
            variant="ghost"
          >
            ← Back to Edit
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant={deviceMode === 'desktop' ? 'default' : 'outline'}
              onClick={() => setDeviceMode('desktop')}
            >
              Desktop
            </Button>
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'outline'}
              onClick={() => setDeviceMode('mobile')}
            >
              Mobile
            </Button>
          </div>
          
          <Button onClick={() => router.push(`/dashboard/campaigns/${campaignId}/send`)}>
            Send Email →
          </Button>
        </div>
        
        {/* Email HTML Preview */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Compiling email...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center">
              <p className="text-red-600 mb-4">Error compiling email</p>
              <p className="text-sm text-gray-500">{error.message}</p>
            </div>
          )}
          
          {Component && !error && (
            <iframe
              ref={iframeRef}
              className={cn(
                'bg-white shadow-lg border-0',
                deviceMode === 'desktop' 
                  ? 'w-full h-full' 
                  : 'w-[375px] h-[667px]'
              )}
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

