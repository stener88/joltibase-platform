'use client';

import { useParams } from 'next/navigation';
import { useCampaignQuery } from '@/hooks/use-campaign-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { V2ChatEditor } from '@/components/email-editor/V2ChatEditor';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';

export default function DashboardCampaignEditorPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const { data: campaign, isLoading, error: queryError } = useCampaignQuery(campaignId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e9a589] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading campaign...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (queryError || !campaign) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load campaign</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <V2ChatEditor
            initialRootComponent={(campaign as any).root_component as EmailComponent | undefined}
            htmlContent={(campaign as any).html_content}
            semanticBlocks={(campaign as any).semantic_blocks?.blocks}
            previewText={(campaign as any).semantic_blocks?.previewText}
            initialGlobalSettings={
              (campaign as any).global_settings || {
                fontFamily: 'system-ui, sans-serif',
                primaryColor: '#7c3aed',
                maxWidth: '600px',
              }
            }
            campaignId={campaignId}
            deviceMode="desktop"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
