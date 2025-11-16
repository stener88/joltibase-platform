import { requireAuth } from '@/lib/api/auth';
import { successResponse, errorResponse } from '@/lib/api/responses';

// ============================================
// GET /api/analytics/campaigns - Campaign Analytics
// ============================================

export async function GET(request: Request) {
  try {
    // Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    
    const { user, supabase } = authResult;

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const sortBy = searchParams.get('sortBy') || 'sent_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build query
    let query = supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString());

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
    }

    // Execute query
    const { data: campaigns, error: campaignsError } = await query;

    if (campaignsError) throw campaignsError;

    // Calculate engagement scores and enrich data
    const enrichedCampaigns = campaigns?.map(campaign => {
      const stats = campaign.stats || {};
      const sent = stats.sent || 0;
      const opened = stats.opened || 0;
      const clicked = stats.clicked || 0;
      const bounced = stats.bounced || 0;
      const delivered = stats.delivered || 0;

      const openRate = sent > 0 ? (opened / sent) * 100 : 0;
      const clickRate = sent > 0 ? (clicked / sent) * 100 : 0;
      const bounceRate = sent > 0 ? (bounced / sent) * 100 : 0;
      const deliveryRate = sent > 0 ? (delivered / sent) * 100 : 0;

      const engagementScore = sent > 0 
        ? (openRate * 0.5) + (clickRate * 0.5)
        : 0;

      return {
        ...campaign,
        metrics: {
          sent,
          opened,
          clicked,
          bounced,
          delivered,
          openRate,
          clickRate,
          bounceRate,
          deliveryRate,
          engagementScore,
        },
      };
    }) || [];

    // Sort campaigns
    const sortedCampaigns = enrichedCampaigns.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'sent':
          aVal = a.metrics.sent;
          bVal = b.metrics.sent;
          break;
        case 'openRate':
          aVal = a.metrics.openRate;
          bVal = b.metrics.openRate;
          break;
        case 'clickRate':
          aVal = a.metrics.clickRate;
          bVal = b.metrics.clickRate;
          break;
        case 'engagement':
          aVal = a.metrics.engagementScore;
          bVal = b.metrics.engagementScore;
          break;
        case 'sent_at':
        default:
          aVal = a.sent_at || a.created_at;
          bVal = b.sent_at || b.created_at;
          break;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return NextResponse.json({
      success: true,
      data: sortedCampaigns,
    });

  } catch (error: any) {
    console.error('❌ [ANALYTICS-CAMPAIGNS] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch campaign analytics' },
      { status: 500 }
    );
  }
}

