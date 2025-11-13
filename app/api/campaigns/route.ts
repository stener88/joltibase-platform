import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const CreateCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  type: z.enum(['one-time', 'sequence', 'automation']).default('one-time'),
  from_name: z.string().min(1, 'From name is required'),
  from_email: z.string().email('Invalid email format'),
  reply_to_email: z.string().email().optional(),
  subject_line: z.string().optional(),
  preview_text: z.string().optional(),
  html_content: z.string().optional(),
  plain_text: z.string().optional(),
  list_ids: z.array(z.string()).default([]),
  blocks: z.array(z.any()).optional(),
  design_config: z.any().optional(), // Use z.any() to avoid nested validation issues
});

// ============================================
// GET /api/campaigns - List campaigns
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('campaigns')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: campaigns, error: fetchError, count } = await query;

    if (fetchError) {
      console.error('❌ [CAMPAIGNS-API] Fetch error:', fetchError);
      throw fetchError;
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      success: true,
      data: {
        campaigns: campaigns || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      },
    });

  } catch (error: any) {
    console.error('❌ [CAMPAIGNS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/campaigns - Create campaign
// ============================================

export async function POST(request: Request) {
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = CreateCampaignSchema.safeParse(body);

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

    const data = validationResult.data;

    // Create campaign
    const { data: campaign, error: insertError } = await supabase
      .from('campaigns')
      .insert({
        user_id: user.id,
        name: data.name,
        type: data.type,
        status: 'draft',
        ai_generated: false,
        from_name: data.from_name,
        from_email: data.from_email,
        reply_to_email: data.reply_to_email || null,
        subject_line: data.subject_line || null,
        preview_text: data.preview_text || null,
        html_content: data.html_content || null,
        plain_text: data.plain_text || null,
        list_ids: data.list_ids,
        blocks: data.blocks || [],
        design_config: data.design_config || null,
        send_config: {},
        stats: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ [CAMPAIGNS-API] Insert error:', insertError);
      throw insertError;
    }

    console.log('✅ [CAMPAIGNS-API] Campaign created:', campaign.id);

    return NextResponse.json({
      success: true,
      data: campaign,
    });

  } catch (error: any) {
    console.error('❌ [CAMPAIGNS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

