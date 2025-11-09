import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const CreateContactSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  status: z.enum(['subscribed', 'unsubscribed', 'bounced', 'complained']).default('subscribed'),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).default({}),
  listIds: z.array(z.string()).optional(),
});

// ============================================
// GET /api/contacts - List contacts
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const tags = searchParams.get('tags') || '';

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('contacts')
      .select('*, contact_lists(list_id, lists(id, name))', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (tags) {
      const tagArray = tags.split(',').filter(Boolean);
      if (tagArray.length > 0) {
        query = query.contains('tags', tagArray);
      }
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: contacts, error: fetchError, count } = await query;

    if (fetchError) {
      console.error('❌ [CONTACTS-API] Fetch error:', fetchError);
      throw fetchError;
    }

    // Transform data to include list info
    const transformedContacts = contacts?.map(contact => ({
      ...contact,
      lists: contact.contact_lists?.map((cl: any) => cl.lists).filter(Boolean) || [],
      contact_lists: undefined, // Remove the raw join data
    })) || [];

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      success: true,
      data: {
        contacts: transformedContacts,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      },
    });

  } catch (error: any) {
    console.error('❌ [CONTACTS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/contacts - Create contact
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
    const validationResult = CreateContactSchema.safeParse(body);

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

    const { email, firstName, lastName, status, tags, metadata, listIds } = validationResult.data;

    // Check for duplicate email
    const { data: existing, error: checkError } = await supabase
      .from('contacts')
      .select('id')
      .eq('user_id', user.id)
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error('❌ [CONTACTS-API] Duplicate check error:', checkError);
      throw checkError;
    }

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A contact with this email already exists' },
        { status: 409 }
      );
    }

    // Create contact
    const { data: contact, error: insertError } = await supabase
      .from('contacts')
      .insert({
        user_id: user.id,
        email: email.toLowerCase(),
        first_name: firstName || null,
        last_name: lastName || null,
        status,
        tags,
        metadata,
        source: 'manual',
        engagement_score: 0,
        subscribed_at: status === 'subscribed' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ [CONTACTS-API] Insert error:', insertError);
      throw insertError;
    }

    // Add to lists if specified
    if (listIds && listIds.length > 0) {
      const listMemberships = listIds.map(listId => ({
        contact_id: contact.id,
        list_id: listId,
      }));

      const { error: listError } = await supabase
        .from('contact_lists')
        .insert(listMemberships);

      if (listError) {
        console.error('❌ [CONTACTS-API] List membership error:', listError);
        // Don't fail the whole operation, just log the error
      }
    }

    console.log('✅ [CONTACTS-API] Contact created:', contact.id);

    return NextResponse.json({
      success: true,
      data: contact,
    });

  } catch (error: any) {
    console.error('❌ [CONTACTS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create contact' },
      { status: 500 }
    );
  }
}

