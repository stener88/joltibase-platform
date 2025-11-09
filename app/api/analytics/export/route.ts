import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// GET /api/analytics/export - Export Campaign Data to CSV
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

    // Fetch campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('sent_at', { ascending: false });

    if (campaignsError) throw campaignsError;

    // Format data for CSV
    const csvData = (campaigns || []).map(campaign => {
      const stats = campaign.stats || {};
      const sent = stats.sent || 0;
      const delivered = stats.delivered || 0;
      const opened = stats.opened || 0;
      const clicked = stats.clicked || 0;
      const bounced = stats.bounced || 0;

      const openRate = sent > 0 ? ((opened / sent) * 100).toFixed(1) : '0.0';
      const clickRate = sent > 0 ? ((clicked / sent) * 100).toFixed(1) : '0.0';
      const bounceRate = sent > 0 ? ((bounced / sent) * 100).toFixed(1) : '0.0';
      const deliveryRate = sent > 0 ? ((delivered / sent) * 100).toFixed(1) : '0.0';

      return {
        'Campaign Name': campaign.name,
        'Type': campaign.type,
        'Status': campaign.status,
        'Subject Line': campaign.subject_line || '',
        'From Name': campaign.from_name,
        'From Email': campaign.from_email,
        'Sent': sent,
        'Delivered': delivered,
        'Opened': opened,
        'Clicked': clicked,
        'Bounced': bounced,
        'Open Rate (%)': openRate,
        'Click Rate (%)': clickRate,
        'Bounce Rate (%)': bounceRate,
        'Delivery Rate (%)': deliveryRate,
        'Sent At': campaign.sent_at ? new Date(campaign.sent_at).toISOString().split('T')[0] : '',
        'Created At': new Date(campaign.created_at).toISOString().split('T')[0],
      };
    });

    // Convert to CSV
    const headers = Object.keys(csvData[0] || {});
    const csvRows = [
      headers.join(','),
      ...csvData.map(row =>
        headers.map(header => {
          const value = row[header as keyof typeof row];
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if contains comma
          if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ];

    const csv = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="campaigns-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error: any) {
    console.error('❌ [ANALYTICS-EXPORT] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to export data' },
      { status: 500 }
    );
  }
}

