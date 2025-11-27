import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderTsxWithIds } from '@/lib/email-v3/renderer';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { tsxCode } = await request.json();

    if (!tsxCode) {
      return NextResponse.json(
        { error: 'Missing TSX code' },
        { status: 400 }
      );
    }

    console.log(`🎨 [RENDER-API] Rendering TSX with component IDs...`);

    // Render TSX directly with ID injection
    const result = await renderTsxWithIds(tsxCode, {
      props: {},
      plainText: false,
    });

    if (result.error) {
      return NextResponse.json(
        { 
          error: result.error, 
          html: result.html,
          componentMap: result.componentMap,
        },
        { status: 500 }
      );
    }

    console.log(`✅ [RENDER-API] Rendered successfully with ${Object.keys(result.componentMap).length} components`);

    return NextResponse.json({
      html: result.html,
      componentMap: result.componentMap,
      success: true,
    });

  } catch (error: any) {
    console.error('[RENDER-API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to render email' },
      { status: 500 }
    );
  }
}

