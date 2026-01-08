import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { queueEmail } from '@/lib/email-sending/queue';

// ============================================
// POST /api/campaigns/[id]/send - Send Campaign
// ============================================

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const campaignId = (await params).id;

    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Validate campaign is ready to send
    if (!campaign.subject_line || !campaign.html_content || !campaign.list_ids || campaign.list_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign is not complete' },
        { status: 400 }
      );
    }

    // Update campaign status to 'sending'
    await supabase
      .from('campaigns')
      .update({
        status: 'sending',
        sent_at: new Date().toISOString(),
      })
      .eq('id', campaignId);

    // Get all contacts from selected lists
    const { data: contactLists, error: contactsError } = await supabase
      .from('contact_lists')
      .select('contact_id, contacts(*)')
      .in('list_id', campaign.list_ids);

    if (contactsError) throw contactsError;

    const contacts = contactLists
      ?.map(cl => cl.contacts)
      .filter((contact: any) => contact && contact.status === 'subscribed') || [];// Queue emails for all contacts
    const queuePromises = contacts.map((contact: any) =>
      queueEmail({
        campaignId,
        contactId: contact.id,
        userId: user.id,
      })
    );

    await Promise.all(queuePromises);

    // Update campaign status to 'sent' (queue processing will happen separately)
    await supabase
      .from('campaigns')
      .update({ status: 'sent' })
      .eq('id', campaignId);

    // Trigger background queue processing
    // In production, this would be a background job/queue system
    // For now, we'll just return success and process in another request
    
    return NextResponse.json({
      success: true,
      message: `Campaign queued for ${contacts.length} recipients`,
      data: {
        campaignId,
        recipientCount: contacts.length,
      },
    });

  } catch (error: any) {
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send campaign' },
      { status: 500 }
    );
  }
}

