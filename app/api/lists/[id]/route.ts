import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================
// GET /api/lists/[id] - Get single list with contacts
// ============================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const listId = (await params).id;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch list
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('*')
      .eq('id', listId)
      .eq('user_id', user.id)
      .single();

    if (listError || !list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      );
    }

    // Fetch contacts in list
    const { data: contactListRecords, error: contactsError } = await supabase
      .from('contact_lists')
      .select(`
        id,
        contact_id,
        created_at,
        contacts (
          id,
          email,
          first_name,
          last_name,
          status,
          metadata
        )
      `)
      .eq('list_id', listId);

    if (contactsError) {
      console.error('Error fetching list contacts:', contactsError);
      throw contactsError;
    }

    // Format response
    const contacts = contactListRecords?.map((record: any) => ({
      ...record.contacts,
      list_join_id: record.id,
      added_at: record.created_at,
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        list,
        contacts,
      },
    });

  } catch (error: any) {
    console.error('Error in GET /api/lists/[id]:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH /api/lists/[id] - Update list
// ============================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const listId = (await params).id;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (name && name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'List name cannot be empty' },
        { status: 400 }
      );
    }

    // Update list
    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;

    const { data: list, error: updateError } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', listId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating list:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      data: list,
    });

  } catch (error: any) {
    console.error('Error in PATCH /api/lists/[id]:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/lists/[id] - Delete list
// ============================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const listId = (await params).id;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete list (cascades to contact_lists due to ON DELETE CASCADE)
    const { error: deleteError } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting list:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'List deleted successfully',
    });

  } catch (error: any) {
    console.error('Error in DELETE /api/lists/[id]:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
