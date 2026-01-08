import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.string(), // ISO string
});

const ChatHistorySchema = z.array(ChatMessageSchema);

// ============================================
// GET /api/campaigns/[id]/chat-history - Get chat history
// ============================================

export async function GET(
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

    // Get campaign with chat history
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('chat_history')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Return chat history or empty array
    const chatHistory = campaign.chat_history || [];

    return NextResponse.json({
      success: true,
      data: chatHistory,
    });

  } catch (error: any) {
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/campaigns/[id]/chat-history - Save chat history
// ============================================

export async function PUT(
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

    // Validate chat history structure
    const validationResult = ChatHistorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const chatHistory = validationResult.data;

    // Update campaign chat history
    const { data: campaign, error: updateError } = await supabase
      .from('campaigns')
      .update({
        chat_history: chatHistory,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .select('chat_history')
      .single();

    if (updateError) {
      throw updateError;
    }return NextResponse.json({
      success: true,
      data: campaign.chat_history,
    });

  } catch (error: any) {
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save chat history' },
      { status: 500 }
    );
  }
}

