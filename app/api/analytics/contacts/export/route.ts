import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// GET /api/analytics/contacts/export - Export Contact Data to CSV
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

    // Fetch all contacts with their lists
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select(`
        *,
        contact_lists (
          lists (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (contactsError) throw contactsError;

    // Get email activity for each contact (last opened)
    const contactIds = contacts?.map(c => c.id) || [];
    const { data: emails, error: emailsError } = await supabase
      .from('emails')
      .select('contact_id, opened_at')
      .in('contact_id', contactIds)
      .not('opened_at', 'is', null)
      .order('opened_at', { ascending: false });

    if (emailsError) throw emailsError;

    // Create map of contact_id -> last_opened
    const lastOpenedMap = new Map<string, string>();
    emails?.forEach(email => {
      if (!lastOpenedMap.has(email.contact_id)) {
        lastOpenedMap.set(email.contact_id, email.opened_at);
      }
    });

    // Format data for CSV
    const csvData = (contacts || []).map((contact: any) => {
      // Extract list names
      const lists = contact.contact_lists?.map((cl: any) => cl.lists?.name).filter(Boolean).join('; ') || '';
      
      // Get tags
      const tags = contact.tags?.join('; ') || '';
      
      // Get last opened
      const lastOpened = lastOpenedMap.get(contact.id);
      const lastOpenedFormatted = lastOpened
        ? new Date(lastOpened).toISOString().split('T')[0]
        : '';

      return {
        'Email': contact.email,
        'First Name': contact.first_name || '',
        'Last Name': contact.last_name || '',
        'Status': contact.status,
        'Engagement Score': contact.engagement_score || 0,
        'Source': contact.source || '',
        'Lists': lists,
        'Tags': tags,
        'Last Opened': lastOpenedFormatted,
        'Subscribed At': contact.subscribed_at ? new Date(contact.subscribed_at).toISOString().split('T')[0] : '',
        'Unsubscribed At': contact.unsubscribed_at ? new Date(contact.unsubscribed_at).toISOString().split('T')[0] : '',
        'Created At': new Date(contact.created_at).toISOString().split('T')[0],
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
        'Content-Disposition': `attachment; filename="contacts-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to export contacts' },
      { status: 500 }
    );
  }
}

