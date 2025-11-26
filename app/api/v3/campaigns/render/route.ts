import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderEmail } from '@/lib/email-v3/renderer';
import fs from 'fs';
import path from 'path';

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

    console.log(`🎨 [RENDER-API] Rendering TSX to HTML...`);

    // Save TSX to temporary file
    const tempDir = path.join(process.cwd(), 'emails/generated');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilename = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.tsx`;
    const tempFilepath = path.join(tempDir, tempFilename);
    
    fs.writeFileSync(tempFilepath, tsxCode, 'utf-8');

    try {
      // Render email using existing renderer
      const result = await renderEmail(tempFilename, {
        props: {},
        plainText: false,
      });

      // Clean up temp file
      if (fs.existsSync(tempFilepath)) {
        fs.unlinkSync(tempFilepath);
      }

      if (result.error) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        html: result.html,
      });

    } catch (renderError: any) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilepath)) {
        fs.unlinkSync(tempFilepath);
      }
      throw renderError;
    }

  } catch (error: any) {
    console.error('[RENDER-API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to render email' },
      { status: 500 }
    );
  }
}

