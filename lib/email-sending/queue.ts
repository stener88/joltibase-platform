import { createClient } from '@/lib/supabase/server';
import { sendEmail, replaceMergeTags, htmlToPlainText } from './sender';
import { getDefaultSender } from './sender-address';

interface QueueEmailParams {
  campaignId: string;
  contactId: string;
  userId: string;
}

/**
 * Queue an email for a specific contact in a campaign
 */
export async function queueEmail({ campaignId, contactId, userId }: QueueEmailParams) {
  const supabase = await createClient();

  try {
    // Insert email record with 'queued' status
    const { data: email, error: insertError } = await supabase
      .from('emails')
      .insert({
        campaign_id: campaignId,
        contact_id: contactId,
        user_id: userId,
        status: 'queued',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log(`✅ [QUEUE] Email queued: ${email.id}`);
    return { success: true, emailId: email.id };
  } catch (error: any) {
    console.error('❌ [QUEUE] Error queuing email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Process queued emails for a campaign
 */
export async function processCampaignQueue(campaignId: string) {
  const supabase = await createClient();

  try {
    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError) throw campaignError;

    // Get user's sender address
    const sender = await getDefaultSender(campaign.user_id);
    if (!sender) {
      console.error(`❌ [QUEUE] No sender address found for user ${campaign.user_id}`);
      throw new Error('No sender address configured');
    }

    // Get user's email for reply-to
    const { data: { user } } = await supabase.auth.admin.getUserById(campaign.user_id);
    const replyToEmail = user?.email || sender.email;

    // Get all queued emails for this campaign
    const { data: queuedEmails, error: emailsError } = await supabase
      .from('emails')
      .select('*, contacts(*)')
      .eq('campaign_id', campaignId)
      .eq('status', 'queued')
      .limit(100); // Process in batches

    if (emailsError) throw emailsError;

    if (!queuedEmails || queuedEmails.length === 0) {
      console.log(`ℹ️ [QUEUE] No queued emails for campaign ${campaignId}`);
      return { success: true, processed: 0 };
    }

    console.log(`📧 [QUEUE] Processing ${queuedEmails.length} emails for campaign ${campaignId}`);

    let successCount = 0;
    let failureCount = 0;

    // Process each email
    for (const emailRecord of queuedEmails) {
      const contact = emailRecord.contacts;

      if (!contact || contact.status !== 'subscribed') {
        // Skip unsubscribed/bounced contacts
        await supabase
          .from('emails')
          .update({ status: 'cancelled' })
          .eq('id', emailRecord.id);
        continue;
      }

      // Replace merge tags
      const htmlContent = replaceMergeTags(campaign.html_content || '', contact);
      const plainText = campaign.plain_text 
        ? replaceMergeTags(campaign.plain_text, contact)
        : htmlToPlainText(htmlContent);
      const subject = replaceMergeTags(campaign.subject_line || '', contact);

      // Send email via Resend using sender address
      const result = await sendEmail({
        from: `${sender.name} <${sender.email}>`,
        to: contact.email,
        subject,
        html: htmlContent,
        text: plainText,
        replyTo: replyToEmail,
      });

      if (result.success) {
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
      } else {
        // Mark as bounced/failed
        await supabase
          .from('emails')
          .update({
            status: 'bounced',
            bounced_at: new Date().toISOString(),
            bounce_reason: result.error,
          })
          .eq('id', emailRecord.id);

        failureCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Update campaign stats
    const { data: stats } = await supabase
      .from('emails')
      .select('status')
      .eq('campaign_id', campaignId);

    if (stats) {
      const sent = stats.filter(e => e.status === 'sent').length;
      const bounced = stats.filter(e => e.status === 'bounced').length;
      const opened = stats.filter(e => e.status === 'opened').length;
      const clicked = stats.filter(e => e.status === 'clicked').length;

      await supabase
        .from('campaigns')
        .update({
          stats: { sent, bounced, opened, clicked, delivered: sent },
        })
        .eq('id', campaignId);
    }

    console.log(`✅ [QUEUE] Processed ${successCount} emails, ${failureCount} failures`);
    return { success: true, processed: successCount, failed: failureCount };
  } catch (error: any) {
    console.error('❌ [QUEUE] Error processing queue:', error);
    return { success: false, error: error.message };
  }
}

