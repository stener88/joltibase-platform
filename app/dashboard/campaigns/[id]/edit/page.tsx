'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { EmailEditorV3 } from '@/components/email-v3/EmailEditorV3';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CampaignEditPage({ params }: EditPageProps) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const supabase = createClient();
        const { id } = await params;

        const { data, error } = await supabase
          .from('campaigns_v3')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          console.error('[EDIT-PAGE] Database error:', error);
          setError('Campaign not found');
          router.push('/dashboard/campaigns');
          return;
        }

        console.log('[EDIT-PAGE] Campaign loaded:', data.name);
        setCampaign(data);
      } catch (err) {
        console.error('[EDIT-PAGE] Error:', err);
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    }

    loadCampaign();
  }, [params, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-muted-foreground">Loading campaign...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !campaign) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-600">{error || 'Campaign not found'}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <EmailEditorV3
      campaignId={campaign.id}
      initialTsxCode={campaign.component_code}
      initialHtmlContent={campaign.html_content}
      campaignName={campaign.name || 'Untitled Campaign'}
      generationPrompt={campaign.generation_prompt}
    />
  );
}

