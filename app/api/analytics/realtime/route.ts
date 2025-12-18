import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// GET /api/analytics/realtime - Real-Time Analytics
// ============================================

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    // Get campaigns currently sending
    const { data: sendingCampaigns, error: campaignsError } = await supabase
      .from('campaigns_v3')
      .select('id, name, stats')
      .eq('user_id', user.id)
      .eq('status', 'sending');

    if (campaignsError) throw campaignsError;

    // Get queue depth for each sending campaign
    const queueData = await Promise.all(
      (sendingCampaigns || []).map(async (campaign) => {
        const { count: queuedCount, error: queueError } = await supabase
          .from('emails')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .eq('status', 'queued');

        if (queueError) throw queueError;

        const { count: sentCount, error: sentError } = await supabase
          .from('emails')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .in('status', ['sent', 'delivered', 'opened', 'clicked']);

        if (sentError) throw sentError;

        return {
          id: campaign.id,
          name: campaign.name,
          queued: queuedCount || 0,
          sent: sentCount || 0,
          total: (queuedCount || 0) + (sentCount || 0),
        };
      })
    );

    // Get recent email events (last hour)
    const { data: recentEmails, error: emailsError } = await supabase
      .from('emails')
      .select(`
        id,
        status,
        sent_at,
        delivered_at,
        opened_at,
        clicked_at,
        bounced_at,
        contact_id,
        campaign_id,
        contacts (
          email,
          first_name,
          last_name
        ),
        campaigns_v3 (
          name
        )
      `)
      .eq('user_id', user.id)
      .or(`sent_at.gte.${oneHourAgo.toISOString()},delivered_at.gte.${oneHourAgo.toISOString()},opened_at.gte.${oneHourAgo.toISOString()},clicked_at.gte.${oneHourAgo.toISOString()},bounced_at.gte.${oneHourAgo.toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (emailsError) throw emailsError;

    // Format recent activity
    const recentActivity = (recentEmails || []).flatMap((email: any) => {
      const events: any[] = [];
      const contact = email.contacts;
      const campaign = email.campaigns_v3;

      if (!contact || !campaign) return [];

      const contactName = contact.first_name || contact.last_name
        ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
        : contact.email;

      if (email.opened_at) {
        events.push({
          type: 'opened',
          timestamp: email.opened_at,
          contact_name: contactName,
          campaign_name: campaign.name,
        });
      }

      if (email.clicked_at) {
        events.push({
          type: 'clicked',
          timestamp: email.clicked_at,
          contact_name: contactName,
          campaign_name: campaign.name,
        });
      }

      if (email.bounced_at) {
        events.push({
          type: 'bounced',
          timestamp: email.bounced_at,
          contact_name: contactName,
          campaign_name: campaign.name,
        });
      }

      if (email.delivered_at) {
        events.push({
          type: 'delivered',
          timestamp: email.delivered_at,
          contact_name: contactName,
          campaign_name: campaign.name,
        });
      }

      return events;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15);

    // Calculate last hour stats
    let lastHourOpens = 0;
    let lastHourClicks = 0;
    let lastHourBounces = 0;

    recentEmails?.forEach((email: any) => {
      if (email.opened_at && new Date(email.opened_at) >= oneHourAgo) {
        lastHourOpens++;
      }
      if (email.clicked_at && new Date(email.clicked_at) >= oneHourAgo) {
        lastHourClicks++;
      }
      if (email.bounced_at && new Date(email.bounced_at) >= oneHourAgo) {
        lastHourBounces++;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        sendingCampaigns: queueData,
        recentActivity,
        lastHourStats: {
          opens: lastHourOpens,
          clicks: lastHourClicks,
          bounces: lastHourBounces,
        },
      },
    });

  } catch (error: any) {
    console.error('❌ [ANALYTICS-REALTIME] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch real-time analytics' },
      { status: 500 }
    );
  }
}

