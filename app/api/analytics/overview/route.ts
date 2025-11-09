import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// GET /api/analytics/overview - Overview Analytics
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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all campaigns in date range
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, name, stats, sent_at, created_at')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (campaignsError) throw campaignsError;

    // Calculate aggregate stats
    let totalSent = 0;
    let totalDelivered = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    let totalBounced = 0;

    campaigns?.forEach(campaign => {
      const stats = campaign.stats || {};
      totalSent += stats.sent || 0;
      totalDelivered += stats.delivered || 0;
      totalOpened += stats.opened || 0;
      totalClicked += stats.clicked || 0;
      totalBounced += stats.bounced || 0;
    });

    const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const clickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;
    const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;

    // Generate time-series data (daily aggregates)
    const timeSeriesMap = new Map<string, any>();
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      timeSeriesMap.set(dateKey, {
        date: dateKey,
        sent: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
      });
    }

    // Aggregate campaigns by sent date
    campaigns?.forEach(campaign => {
      if (campaign.sent_at) {
        const dateKey = new Date(campaign.sent_at).toISOString().split('T')[0];
        if (timeSeriesMap.has(dateKey)) {
          const day = timeSeriesMap.get(dateKey);
          const stats = campaign.stats || {};
          day.sent += stats.sent || 0;
          day.opened += stats.opened || 0;
          day.clicked += stats.clicked || 0;
          day.bounced += stats.bounced || 0;
        }
      }
    });

    const timeSeries = Array.from(timeSeriesMap.values());

    // Calculate rates for time series
    const timeSeriesWithRates = timeSeries.map(day => ({
      ...day,
      openRate: day.sent > 0 ? (day.opened / day.sent) * 100 : 0,
      clickRate: day.sent > 0 ? (day.clicked / day.sent) * 100 : 0,
    }));

    // Get top performing campaigns
    const campaignsWithEngagement = campaigns?.map(c => {
      const stats = c.stats || {};
      const sent = stats.sent || 0;
      const opened = stats.opened || 0;
      const clicked = stats.clicked || 0;
      
      const engagementScore = sent > 0 
        ? ((opened / sent) * 50) + ((clicked / sent) * 50)
        : 0;

      return {
        id: c.id,
        name: c.name,
        stats: c.stats,
        sent_at: c.sent_at,
        engagement_score: engagementScore,
      };
    }) || [];

    const topCampaigns = campaignsWithEngagement
      .filter(c => (c.stats?.sent || 0) > 0)
      .sort((a, b) => b.engagement_score - a.engagement_score)
      .slice(0, 5);

    const worstCampaigns = campaignsWithEngagement
      .filter(c => (c.stats?.sent || 0) > 0)
      .sort((a, b) => a.engagement_score - b.engagement_score)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalSent,
          totalDelivered,
          totalOpened,
          totalClicked,
          totalBounced,
          openRate,
          clickRate,
          bounceRate,
          deliveryRate,
          campaignCount: campaigns?.length || 0,
        },
        timeSeries: timeSeriesWithRates,
        topCampaigns,
        worstCampaigns,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          days,
        },
      },
    });

  } catch (error: any) {
    console.error('❌ [ANALYTICS-OVERVIEW] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

