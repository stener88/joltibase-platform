import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// POST /api/webhooks/resend - Handle Resend Webhooks
// ============================================

export async function POST(request: Request) {
  try {
    // Verify webhook signature (optional but recommended)
    // Resend uses Svix for webhook signatures
    const signature = request.headers.get('svix-signature');
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // If webhook secret is configured, verify signature
    if (webhookSecret && signature) {
      // For production: implement full Svix signature verification
      // For now, we'll log it
      console.log('🔐 [WEBHOOK] Signature present:', signature ? 'yes' : 'no');
    }

    const payload = await request.json();
    
    console.log('📥 [WEBHOOK] Received Resend event:', payload.type);

    // Get the Resend message ID from the webhook
    const messageId = payload.data?.email_id;
    
    if (!messageId) {
      console.warn('⚠️ [WEBHOOK] No message ID in webhook payload');
      return NextResponse.json({ received: true });
    }

    // Initialize Supabase admin client (webhooks don't have auth context)
    const supabase = await createClient();

    // Find the email record by Resend message ID
    const { data: email, error: fetchError } = await supabase
      .from('emails')
      .select('*')
      .eq('resend_message_id', messageId)
      .single();

    if (fetchError || !email) {
      console.warn('⚠️ [WEBHOOK] Email not found for message ID:', messageId);
      return NextResponse.json({ received: true });
    }

    // Update email status based on event type
    let updates: any = {};
    const eventType = payload.type;
    const timestamp = new Date().toISOString();

    switch (eventType) {
      case 'email.delivered':
        updates = {
          status: 'delivered',
          delivered_at: timestamp,
        };
        break;

      case 'email.opened':
        updates = {
          status: 'opened',
          opened_at: timestamp,
        };
        break;

      case 'email.clicked':
        updates = {
          status: 'clicked',
          clicked_at: timestamp,
        };
        break;

      case 'email.bounced':
        updates = {
          status: 'bounced',
          bounced_at: timestamp,
          bounce_reason: payload.data?.reason || 'Unknown',
        };
        
        // Also update contact status
        await supabase
          .from('contacts')
          .update({ status: 'bounced' })
          .eq('id', email.contact_id);
        break;

      case 'email.complained':
        updates = {
          status: 'complained',
        };
        
        // Update contact status
        await supabase
          .from('contacts')
          .update({ status: 'complained' })
          .eq('id', email.contact_id);
        break;

      case 'email.unsubscribed':
        updates = {
          status: 'unsubscribed',
        };
        
        // Update contact status
        await supabase
          .from('contacts')
          .update({
            status: 'unsubscribed',
            unsubscribed_at: timestamp,
          })
          .eq('id', email.contact_id);
        break;

      default:
        console.log('ℹ️ [WEBHOOK] Unhandled event type:', eventType);
        return NextResponse.json({ received: true });
    }

    // Update email record
    const { error: updateError } = await supabase
      .from('emails')
      .update(updates)
      .eq('id', email.id);

    if (updateError) {
      console.error('❌ [WEBHOOK] Error updating email:', updateError);
      throw updateError;
    }

    // Update campaign stats using the database function
    await supabase.rpc('update_campaign_stats', { campaign_uuid: email.campaign_id });

    console.log('✅ [WEBHOOK] Processed event:', eventType, 'for email:', email.id);

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('❌ [WEBHOOK] Error processing webhook:', error);
    // Return 200 to prevent Resend from retrying
    return NextResponse.json({ received: true, error: error.message });
  }
}

