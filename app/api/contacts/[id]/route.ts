import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const UpdateContactSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  status: z.enum(['subscribed', 'unsubscribed', 'bounced', 'complained']).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  listIds: z.array(z.string()).optional(),
});

// ============================================
// GET /api/contacts/[id] - Get single contact
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

    const { id: contactId } = await params;

    // Fetch contact with list memberships
    const { data: contact, error: fetchError } = await supabase
      .from('contacts')
      .select(`
        *,
        contact_lists(list_id, lists(id, name))
      `)
      .eq('id', contactId)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Contact not found' },
          { status: 404 }
        );
      }
      console.error('❌ [CONTACTS-API] Fetch error:', fetchError);
      throw fetchError;
    }

    // Fetch email history for this contact
    const { data: emails, error: emailsError } = await supabase
      .from('emails')
      .select('id, subject, status, sent_at, opened_at, clicked_at, campaign_id, campaigns(name)')
      .eq('contact_id', contactId)
      .order('sent_at', { ascending: false })
      .limit(50);

    if (emailsError) {
      console.error('❌ [CONTACTS-API] Email history error:', emailsError);
      // Don't fail, just log
    }

    // Transform contact data
    const transformedContact = {
      ...contact,
      lists: contact.contact_lists?.map((cl: any) => cl.lists).filter(Boolean) || [],
      emailHistory: emails || [],
      contact_lists: undefined, // Remove the raw join data
    };

    return NextResponse.json({
      success: true,
      data: transformedContact,
    });

  } catch (error: any) {
    console.error('❌ [CONTACTS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/contacts/[id] - Update contact
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

    const { id: contactId } = await params;

    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdateContactSchema.safeParse(body);

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

    // Check if contact exists and belongs to user
    const { data: existing, error: checkError } = await supabase
      .from('contacts')
      .select('id, email, status')
      .eq('id', contactId)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    // If email is being changed, check for duplicates
    if (email && email.toLowerCase() !== existing.email.toLowerCase()) {
      const { data: duplicate, error: dupError } = await supabase
        .from('contacts')
        .select('id')
        .eq('user_id', user.id)
        .eq('email', email.toLowerCase())
        .neq('id', contactId)
        .maybeSingle();

      if (dupError) {
        console.error('❌ [CONTACTS-API] Duplicate check error:', dupError);
        throw dupError;
      }

      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Another contact with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Build update object
    const updates: any = {};
    if (email !== undefined) updates.email = email.toLowerCase();
    if (firstName !== undefined) updates.first_name = firstName || null;
    if (lastName !== undefined) updates.last_name = lastName || null;
    if (status !== undefined) {
      updates.status = status;
      // Track status changes
      if (status === 'subscribed' && existing.status !== 'subscribed') {
        updates.subscribed_at = new Date().toISOString();
        updates.unsubscribed_at = null;
      } else if (status === 'unsubscribed' && existing.status !== 'unsubscribed') {
        updates.unsubscribed_at = new Date().toISOString();
      }
    }
    if (tags !== undefined) updates.tags = tags;
    if (metadata !== undefined) updates.metadata = metadata;

    // Update contact
    const { data: contact, error: updateError } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', contactId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ [CONTACTS-API] Update error:', updateError);
      throw updateError;
    }

    // Update list memberships if specified
    if (listIds !== undefined) {
      // Remove existing memberships
      await supabase
        .from('contact_lists')
        .delete()
        .eq('contact_id', contactId);

      // Add new memberships
      if (listIds.length > 0) {
        const listMemberships = listIds.map(listId => ({
          contact_id: contactId,
          list_id: listId,
        }));

        const { error: listError } = await supabase
          .from('contact_lists')
          .insert(listMemberships);

        if (listError) {
          console.error('❌ [CONTACTS-API] List membership error:', listError);
        }
      }
    }

    console.log('✅ [CONTACTS-API] Contact updated:', contactId);

    return NextResponse.json({
      success: true,
      data: contact,
    });

  } catch (error: any) {
    console.error('❌ [CONTACTS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/contacts/[id] - Delete contact
// ============================================

export async function DELETE(
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

    const { id: contactId } = await params;

    // Delete contact (cascade will handle contact_lists and emails)
    const { error: deleteError } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('❌ [CONTACTS-API] Delete error:', deleteError);
      throw deleteError;
    }

    console.log('✅ [CONTACTS-API] Contact deleted:', contactId);

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });

  } catch (error: any) {
    console.error('❌ [CONTACTS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete contact' },
      { status: 500 }
    );
  }
}

