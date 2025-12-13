import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { EmailEditorV3 } from '@/components/email-v3/EmailEditorV3';

// 🔥 CRITICAL: Disable Next.js caching for dynamic campaign data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CampaignEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch campaign data (always fresh!)
  const { data: campaign, error } = await supabase
    .from('campaigns_v3')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !campaign) {
    console.error('[EDIT-PAGE] Database error:', error);
    redirect('/dashboard/campaigns');
  }

  console.log('[EDIT-PAGE] Campaign loaded:', campaign.name);
  console.log('[EDIT-PAGE] component_code length:', campaign.component_code?.length);

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
