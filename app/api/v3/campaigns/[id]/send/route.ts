import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// POST /api/v3/campaigns/[id]/send - Send V3 Campaign
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
    const body = await request.json();
    const { senderName, senderAddressId, listIds } = body;

    console.log(`📧 [SEND-V3] Starting send for campaign ${campaignId}`);
    console.log(`📧 [SEND-V3] Lists: ${listIds?.length || 0}, Sender: ${senderAddressId}`);

    // Validate required fields
    if (!listIds || listIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No contact lists selected' },
        { status: 400 }
      );
    }

    if (!senderAddressId) {
      return NextResponse.json(
        { success: false, error: 'No sender address provided' },
        { status: 400 }
      );
    }

    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns_v3')
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
    if (!campaign.subject_line || !campaign.html_content) {
      return NextResponse.json(
        { success: false, error: 'Campaign is not complete (missing subject or content)' },
        { status: 400 }
      );
    }

    // Verify sender address belongs to user
    const { data: sender, error: senderError } = await supabase
      .from('sender_addresses')
      .select('*')
      .eq('id', senderAddressId)
      .eq('user_id', user.id)
      .single();

    if (senderError || !sender) {
      return NextResponse.json(
        { success: false, error: 'Invalid sender address' },
        { status: 400 }
      );
    }

    if (!sender.is_verified) {
      return NextResponse.json(
        { success: false, error: 'Sender email address is not verified' },
        { status: 400 }
      );
    }

    // Update campaign with sender info and list IDs
    const { error: updateError } = await supabase
      .from('campaigns_v3')
      .update({
        sender_address_id: senderAddressId,
        list_ids: listIds,
        status: 'sending',
        sent_at: new Date().toISOString(),
      })
      .eq('id', campaignId);

    if (updateError) {
      console.error('❌ [SEND-V3] Failed to update campaign:', updateError);
      throw updateError;
    }

    // Get all contacts from selected lists (only subscribed contacts)
    const { data: contactListRecords, error: contactsError } = await supabase
      .from('contact_lists')
      .select(`
        contact_id,
        contacts!inner (
          id,
          email,
          first_name,
          last_name,
          status,
          metadata
        )
      `)
      .in('list_id', listIds);

    if (contactsError) {
      console.error('❌ [SEND-V3] Failed to fetch contacts:', contactsError);
      throw contactsError;
    }

    // Filter for subscribed contacts only and deduplicate
    const uniqueContacts = new Map();
    contactListRecords?.forEach((record: any) => {
      const contact = record.contacts;
      if (contact && contact.status === 'subscribed') {
        uniqueContacts.set(contact.id, contact);
      }
    });

    const contacts = Array.from(uniqueContacts.values());

    if (contacts.length === 0) {
      // Update campaign status back to ready
      await supabase
        .from('campaigns_v3')
        .update({ status: 'ready' })
        .eq('id', campaignId);

      return NextResponse.json(
        { success: false, error: 'No subscribed contacts found in selected lists' },
        { status: 400 }
      );
    }

    console.log(`📧 [SEND-V3] Queueing ${contacts.length} emails for campaign ${campaignId}`);

    // Queue emails for all contacts
    const emailRecords = contacts.map((contact: any) => ({
      campaign_id: campaignId,
      contact_id: contact.id,
      user_id: user.id,
      status: 'queued',
    }));

    const { error: queueError } = await supabase
      .from('emails')
      .insert(emailRecords);

    if (queueError) {
      console.error('❌ [SEND-V3] Failed to queue emails:', queueError);
      throw queueError;
    }

    console.log(`✅ [SEND-V3] Queued ${contacts.length} emails successfully`);

    // Trigger background processing
    // For now, we'll call the processor directly
    // In production, this would be a background job/queue system
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v3/campaigns/${campaignId}/process-queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.warn('⚠️ [SEND-V3] Failed to trigger queue processor:', error);
      // Don't fail the request - queue will be processed on next cron run
    }
    
    return NextResponse.json({
      success: true,
      message: `Campaign queued for ${contacts.length} recipients`,
      data: {
        campaignId,
        recipientCount: contacts.length,
      },
    });

  } catch (error: any) {
    console.error('❌ [SEND-V3] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send campaign' },
      { status: 500 }
    );
  }
}
