import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// GET /api/analytics/contacts - Contact Analytics
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

    // Get all contacts
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('id, email, first_name, last_name, status, engagement_score, subscribed_at, unsubscribed_at, created_at')
      .eq('user_id', user.id);

    if (contactsError) throw contactsError;

    const totalContacts = contacts?.length || 0;
    const activeContacts = contacts?.filter(c => c.status === 'subscribed').length || 0;
    
    // Calculate date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // New contacts this month
    const newThisMonth = contacts?.filter(c => 
      new Date(c.created_at) >= startOfMonth
    ).length || 0;

    // Churned contacts this month
    const churnedThisMonth = contacts?.filter(c => 
      c.unsubscribed_at && new Date(c.unsubscribed_at) >= startOfMonth
    ).length || 0;

    // Active percentage
    const activePercentage = totalContacts > 0 ? (activeContacts / totalContacts) * 100 : 0;

    // Most engaged contacts (top 20)
    const mostEngaged = contacts
      ?.filter(c => c.status === 'subscribed')
      .sort((a, b) => (b.engagement_score || 0) - (a.engagement_score || 0))
      .slice(0, 20)
      .map(c => ({
        id: c.id,
        email: c.email,
        first_name: c.first_name,
        last_name: c.last_name,
        engagement_score: c.engagement_score || 0,
      })) || [];

    // Get emails for inactive contact detection
    const { data: emails, error: emailsError } = await supabase
      .from('emails')
      .select('contact_id, status, sent_at, opened_at')
      .eq('user_id', user.id)
      .gte('sent_at', thirtyDaysAgo.toISOString());

    if (emailsError) throw emailsError;

    // Calculate inactive contacts (no opens in 30+ days, received at least 3 emails)
    const contactEmailStats = new Map<string, { sent: number; opened: number; lastOpened: string | null }>();
    
    emails?.forEach(email => {
      if (!contactEmailStats.has(email.contact_id)) {
        contactEmailStats.set(email.contact_id, { sent: 0, opened: 0, lastOpened: null });
      }
      const stats = contactEmailStats.get(email.contact_id)!;
      stats.sent++;
      if (email.opened_at) {
        stats.opened++;
        if (!stats.lastOpened || new Date(email.opened_at) > new Date(stats.lastOpened)) {
          stats.lastOpened = email.opened_at;
        }
      }
    });

    const inactiveContacts = contacts
      ?.filter(c => {
        if (c.status !== 'subscribed') return false;
        const stats = contactEmailStats.get(c.id);
        if (!stats || stats.sent < 3) return false;
        // No opens in 30+ days
        if (!stats.lastOpened) return true;
        const lastOpen = new Date(stats.lastOpened);
        return lastOpen < thirtyDaysAgo;
      })
      .slice(0, 20)
      .map(c => ({
        id: c.id,
        email: c.email,
        first_name: c.first_name,
        last_name: c.last_name,
        engagement_score: c.engagement_score || 0,
        emails_sent: contactEmailStats.get(c.id)?.sent || 0,
        last_opened: contactEmailStats.get(c.id)?.lastOpened,
      })) || [];

    // Growth trends (last 90 days, daily)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const growthMap = new Map<string, { subscribes: number; unsubscribes: number }>();
    
    // Initialize all days
    for (let d = new Date(ninetyDaysAgo); d <= now; d = new Date(d.setDate(d.getDate() + 1))) {
      const dateKey = d.toISOString().split('T')[0];
      growthMap.set(dateKey, { subscribes: 0, unsubscribes: 0 });
    }

    // Count subscribes and unsubscribes in single loop
    contacts?.forEach(contact => {
      if (contact.subscribed_at) {
        const date = new Date(contact.subscribed_at);
        if (date >= ninetyDaysAgo) {
          const dateKey = date.toISOString().split('T')[0];
          if (growthMap.has(dateKey)) {
            growthMap.get(dateKey)!.subscribes++;
          }
        }
      }
      
      if (contact.unsubscribed_at) {
        const date = new Date(contact.unsubscribed_at);
        if (date >= ninetyDaysAgo) {
          const dateKey = date.toISOString().split('T')[0];
          if (growthMap.has(dateKey)) {
            growthMap.get(dateKey)!.unsubscribes++;
          }
        }
      }
    });

    // Calculate cumulative growth
    let cumulative = activeContacts;
    const growthTrend = Array.from(growthMap.entries())
      .map(([date, data]) => {
        cumulative = cumulative + data.subscribes - data.unsubscribes;
        return {
          date,
          subscribes: data.subscribes,
          unsubscribes: data.unsubscribes,
          net: data.subscribes - data.unsubscribes,
          total: cumulative,
        };
      })
      .reverse(); // Oldest first

    // Engagement score distribution
    const scoreRanges = [
      { label: '0-20', min: 0, max: 20, count: 0 },
      { label: '21-40', min: 21, max: 40, count: 0 },
      { label: '41-60', min: 41, max: 60, count: 0 },
      { label: '61-80', min: 61, max: 80, count: 0 },
      { label: '81-100', min: 81, max: 100, count: 0 },
    ];

    contacts?.forEach(contact => {
      const score = contact.engagement_score || 0;
      const range = scoreRanges.find(r => score >= r.min && score <= r.max);
      if (range) range.count++;
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalContacts,
          activeContacts,
          activePercentage,
          newThisMonth,
          churnedThisMonth,
        },
        mostEngaged,
        inactiveContacts,
        growthTrend,
        engagementDistribution: scoreRanges,
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch contact analytics' },
      { status: 500 }
    );
  }
}

