import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const campaignId = formData.get('campaignId') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed types: jpg, jpeg, png, gif, webp' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Generate file path: {userId}/{campaignId}/{timestamp}-{filename}
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = campaignId 
      ? `${user.id}/${campaignId}/${timestamp}-${sanitizedFilename}`
      : `${user.id}/${timestamp}-${sanitizedFilename}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('email-assets')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('❌ [UPLOAD-API] Storage error:', error);
      
      // Check for bucket not found error
      if (error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Storage bucket "email-assets" not found. Please create it in your Supabase dashboard under Storage.',
            code: 'BUCKET_NOT_FOUND'
          },
          { status: 500 }
        );
      }
      
      // Check for RLS policy violation
      if (error.statusCode === '403' || error.message?.includes('row-level security policy') || error.message?.includes('violates row-level security')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Storage bucket RLS policy violation. Please create a policy in Supabase Storage that allows authenticated users to upload files to the "email-assets" bucket.',
            code: 'RLS_POLICY_VIOLATION'
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('email-assets')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { success: false, error: 'Failed to get public URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url: urlData.publicUrl,
        path: filePath,
      },
    });

  } catch (error: any) {
    console.error('❌ [UPLOAD-API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

