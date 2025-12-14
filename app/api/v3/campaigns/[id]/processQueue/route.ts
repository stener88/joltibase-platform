import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEmail, replaceMergeTags, htmlToPlainText } from '@/lib/email-sending/sender';

// ============================================
// POST /api/v3/campaigns/[id]/processQueue
// Process queued emails for a V3 campaign
// ============================================

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const campaignId = (await params).id;

    console.log(`🔄 [QUEUE-V3] Processing queue for campaign ${campaignId}`);

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns_v3')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Get sender address
    const { data: sender, error: senderError } = await supabase
      .from('sender_addresses')
      .select('*')
      .eq('id', campaign.sender_address_id)
      .single();

    if (senderError || !sender) {
      console.error(`❌ [QUEUE-V3] No sender address found for campaign ${campaignId}`);
      return NextResponse.json(
        { success: false, error: 'Sender address not found' },
        { status: 400 }
      );
    }

    // Use sender's email for reply-to
    const replyToEmail = sender.email;

    // Get all queued emails for this campaign (batch of 100 to avoid timeouts)
    const { data: queuedEmails, error: emailsError } = await supabase
      .from('emails')
      .select(`
        *,
        contacts (
          id,
          email,
          first_name,
          last_name,
          status,
          metadata
        )
      `)
      .eq('campaign_id', campaignId)
      .eq('status', 'queued')
      .limit(100);

    if (emailsError) {
      console.error('❌ [QUEUE-V3] Error fetching emails:', emailsError);
      throw emailsError;
    }

    if (!queuedEmails || queuedEmails.length === 0) {
      console.log(`ℹ️ [QUEUE-V3] No queued emails for campaign ${campaignId}`);
      
      // Update campaign status to 'sent' if no more queued emails
      await supabase
        .from('campaigns_v3')
        .update({ status: 'sent' })
        .eq('id', campaignId);

      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No emails in queue',
      });
    }

    console.log(`📧 [QUEUE-V3] Processing ${queuedEmails.length} emails`);

    let successCount = 0;
    let failureCount = 0;

    // Process each email
    for (const emailRecord of queuedEmails) {
      const contact = emailRecord.contacts;

      // Skip if contact is not subscribed or doesn't exist
      if (!contact || contact.status !== 'subscribed') {
        await supabase
          .from('emails')
          .update({ status: 'cancelled' })
          .eq('id', emailRecord.id);
        continue;
      }

      try {
        // Replace merge tags in content
        const htmlContent = replaceMergeTags(campaign.html_content || '', contact);
        const plainText = htmlToPlainText(htmlContent);
        const subject = replaceMergeTags(campaign.subject_line || '', contact);

        // Add unsubscribe link to content
        const unsubscribeLink = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe/${contact.id}`;
        const htmlWithUnsubscribe = htmlContent.replace(
          '</body>',
          `<div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <a href="${unsubscribeLink}" style="color: #666; text-decoration: underline;">Unsubscribe</a>
          </div></body>`
        );

        // Send email via Resend
        const result = await sendEmail({
          from: `${sender.name} <${sender.email}>`,
          to: contact.email,
          subject,
          html: htmlWithUnsubscribe,
          text: plainText,
          replyTo: replyToEmail,
        });

        if (result.success && result.messageId) {
          // Update email record as sent
          await supabase
            .from('emails')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              resend_message_id: result.messageId,
            })
            .eq('id', emailRecord.id);

          successCount++;
          console.log(`✅ [QUEUE-V3] Sent to ${contact.email}`);
        } else {
          // Mark as bounced/failed
          await supabase
            .from('emails')
            .update({
              status: 'bounced',
              bounced_at: new Date().toISOString(),
              bounce_reason: result.error || 'Unknown error',
            })
            .eq('id', emailRecord.id);

          failureCount++;
          console.error(`❌ [QUEUE-V3] Failed to send to ${contact.email}:`, result.error);
        }
      } catch (error: any) {
        console.error(`❌ [QUEUE-V3] Error processing email ${emailRecord.id}:`, error);
        
        // Mark as bounced
        await supabase
          .from('emails')
          .update({
            status: 'bounced',
            bounced_at: new Date().toISOString(),
            bounce_reason: error.message,
          })
          .eq('id', emailRecord.id);

        failureCount++;
      }

      // Small delay to avoid rate limiting (100ms between emails)
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Update campaign stats
    await supabase.rpc('update_campaign_stats', { campaign_uuid: campaignId });

    // Check if there are more emails in queue
    const { count: remainingCount } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaignId)
      .eq('status', 'queued');

    // Update campaign status
    if (!remainingCount || remainingCount === 0) {
      await supabase
        .from('campaigns_v3')
        .update({ status: 'sent' })
        .eq('id', campaignId);
      
      console.log(`✅ [QUEUE-V3] Campaign ${campaignId} completed`);
    } else {
      console.log(`🔄 [QUEUE-V3] ${remainingCount} emails still in queue`);
    }

    console.log(`✅ [QUEUE-V3] Processed ${successCount} emails, ${failureCount} failures`);

    return NextResponse.json({
      success: true,
      processed: successCount,
      failed: failureCount,
      remaining: remainingCount || 0,
    });

  } catch (error: any) {
    console.error('❌ [QUEUE-V3] Error processing queue:', error);
    
    // Reset campaign status on critical error
    try {
      const supabase = await createClient();
      await supabase
        .from('campaigns_v3')
        .update({ status: 'ready' })
        .eq('id', (await params).id);
    } catch (resetError) {
      console.error('❌ [QUEUE-V3] Failed to reset campaign status:', resetError);
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/v3/campaigns/[id]/processQueue
// Check queue status
// ============================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const campaignId = (await params).id;

    const { count: queuedCount } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaignId)
      .eq('status', 'queued');

    const { count: sentCount } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaignId)
      .eq('status', 'sent');

    return NextResponse.json({
      success: true,
      queued: queuedCount || 0,
      sent: sentCount || 0,
    });

  } catch (error: any) {
    console.error('❌ [QUEUE-V3] Error checking queue:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
