import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CampaignSendClient } from './CampaignSendClient';

// 🔥 CRITICAL: Disable Next.js caching for dynamic campaign data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SendPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CampaignSendPage({ params }: SendPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch campaign data (always fresh!)
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns_v3')
    .select('id, html_content, subject_line, preview_text, status')
    .eq('id', id)
    .single();

  if (campaignError || !campaign) {
    redirect('/dashboard/campaigns');
  }

  // Fetch contact lists with counts (use existing contact_count field)
  const { data: lists } = await supabase
    .from('lists')
    .select('id, name, description, contact_count')
    .order('name');

  const listsWithCounts = lists || [];

  // Fetch sender address directly from Supabase (no API call needed)
  let sender = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: senderData } = await supabase
        .from('sender_addresses')
        .select('id, email, name, is_verified')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();
        
      sender = senderData;
    }
  } catch (error) {
    console.error('Failed to fetch sender:', error);
  }

  return (
    <DashboardLayout>
      <CampaignSendClient 
        campaign={campaign}
        lists={listsWithCounts}
        sender={sender}
      />
    </DashboardLayout>
  );
}

