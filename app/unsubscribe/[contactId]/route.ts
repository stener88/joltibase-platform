import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

// ============================================
// GET /unsubscribe/[contactId] - Unsubscribe a contact
// ============================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    const supabase = await createClient();
    const contactId = (await params).contactId;

    console.log(`🔕 [UNSUBSCRIBE] Processing unsubscribe for contact ${contactId}`);

    // Get contact
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (contactError || !contact) {
      // Redirect to a generic unsubscribe page even if contact not found
      return NextResponse.redirect(new URL('/unsubscribe/success', request.url));
    }

    // Check if already unsubscribed
    if (contact.status === 'unsubscribed') {
      console.log(`ℹ️ [UNSUBSCRIBE] Contact ${contactId} already unsubscribed`);
      return NextResponse.redirect(new URL('/unsubscribe/success', request.url));
    }

    // Update contact status to unsubscribed
    const { error: updateError } = await supabase
      .from('contacts')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('id', contactId);

    if (updateError) {
      console.error('❌ [UNSUBSCRIBE] Error updating contact:', updateError);
      throw updateError;
    }

    console.log(`✅ [UNSUBSCRIBE] Successfully unsubscribed contact ${contactId}`);

    // Redirect to success page
    return NextResponse.redirect(new URL('/unsubscribe/success', request.url));

  } catch (error: any) {
    console.error('❌ [UNSUBSCRIBE] Error:', error);
    // Still redirect to success to avoid revealing system information
    return NextResponse.redirect(new URL('/unsubscribe/success', new URL(request.url).origin));
  }
}

