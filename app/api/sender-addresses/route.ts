import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getUserSenders, ensureDefaultSender } from '@/lib/email-sending/sender-address';

// ============================================
// GET /api/sender-addresses - Get user's sender addresses
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

    // Get all sender addresses for this user
    const senders = await getUserSenders(user.id);
    
    // If no senders exist, create default one
    if (senders.length === 0) {
      console.log(`📧 [SENDER-API] No senders found, creating default for ${user.email}`);
      const fullName = user.user_metadata?.full_name || 
                      user.user_metadata?.name ||
                      null;
      
      const defaultSender = await ensureDefaultSender(
        user.id,
        user.email!,
        fullName
      );
      
      return NextResponse.json({
        success: true,
        data: {
          senders: [defaultSender],
          default: defaultSender,
        },
      });
    }

    // Find default sender
    const defaultSender = senders.find(s => s.is_default);

    return NextResponse.json({
      success: true,
      data: {
        senders,
        default: defaultSender || senders[0],
      },
    });

  } catch (error: any) {
    console.error('❌ [SENDER-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch sender addresses' },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH /api/sender-addresses - Update sender name
// ============================================

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { senderId, name } = body;

    if (!senderId || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing senderId or name' },
        { status: 400 }
      );
    }

    // Update sender name
    const { data, error } = await supabase
      .from('sender_addresses')
      .update({ name })
      .eq('id', senderId)
      .eq('user_id', user.id) // Ensure user owns this sender
      .select()
      .single();

    if (error) {
      console.error('❌ [SENDER-API] Update error:', error);
      throw error;
    }

    console.log(`✅ [SENDER-API] Updated sender ${senderId} name to: ${name}`);

    return NextResponse.json({
      success: true,
      data: data,
    });

  } catch (error: any) {
    console.error('❌ [SENDER-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update sender address' },
      { status: 500 }
    );
  }
}
