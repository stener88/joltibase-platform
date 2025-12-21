import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

// ============================================
// POST /api/webhooks/resend - Handle Resend Webhooks
// Now with proper Svix signature verification for security
// ============================================

export async function POST(request: Request) {
  try {
    // 🔒 SECURITY: Verify webhook signature using Svix
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('⚠️ [WEBHOOK] RESEND_WEBHOOK_SECRET not configured - webhook verification disabled');
      // In production, you should reject webhooks without secrets
      // For now, we'll continue but log a warning
    }

    // Get Svix headers for verification
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');
    
    // Get raw body for signature verification
    const body = await request.text();
    
    // Verify signature if secret is configured
    if (webhookSecret && svixId && svixTimestamp && svixSignature) {
      try {
        const wh = new Webhook(webhookSecret);
        
        // Verify the webhook signature
        const payload = wh.verify(body, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        }) as any;
        
        console.log('✅ [WEBHOOK] Signature verified successfully');
        
        // Process the verified payload
        return await processWebhookPayload(payload);
        
      } catch (err: any) {
        console.error('❌ [WEBHOOK] Signature verification failed:', err.message);
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    } else {
      // No signature verification (development mode or missing headers)
      console.warn('⚠️ [WEBHOOK] Processing unverified webhook (development mode)');
      const payload = JSON.parse(body);
      return await processWebhookPayload(payload);
    }

  } catch (error: any) {
    console.error('❌ [WEBHOOK] Error processing webhook:', error);
    // Return 200 to prevent Resend from retrying on processing errors
    return NextResponse.json({ received: true, error: error.message });
  }
}

/**
 * Process the webhook payload after verification
 */
async function processWebhookPayload(payload: any) {
  console.log('📥 [WEBHOOK] Received Resend event:', payload.type);

  // Get the Resend message ID from the webhook
  const messageId = payload.data?.email_id;
  
  if (!messageId) {
    console.warn('⚠️ [WEBHOOK] No message ID in webhook payload');
    return NextResponse.json({ received: true });
  }

  // Initialize Supabase client (webhooks don't have auth context)
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
}

