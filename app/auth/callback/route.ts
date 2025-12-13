import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ensureDefaultSender } from '@/lib/email-sending/sender-address'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('🔍 Callback received:', { code: code?.substring(0, 10) + '...', origin })

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Auth exchange error:', error)
        return NextResponse.redirect(`${origin}/login?error=${error.message}`)
      }

      console.log('✅ Auth successful, user:', data.user?.email)
      
      // Create default sender address for new users
      try {
        if (data.user) {
          const fullName = data.user.user_metadata?.full_name || 
                          data.user.user_metadata?.name ||
                          null;
          
          await ensureDefaultSender(
            data.user.id,
            data.user.email!,
            fullName
          );
        }
      } catch (senderError) {
        // Log but don't block auth flow
        console.error('⚠️ [SENDER] Failed to create default sender:', senderError);
      }
      
      // Check if this is a popup window (OAuth flow)
      // If so, return HTML that closes the popup instead of redirecting
      const isPopup = requestUrl.searchParams.get('popup') === 'true'
      
      if (isPopup) {
        return new NextResponse(
          `<!DOCTYPE html>
          <html>
            <head><title>Authentication Successful</title></head>
            <body>
              <p>Authentication successful! Closing window...</p>
              <script>
                if (window.opener && !window.opener.closed) {
                  window.opener.postMessage({ type: 'auth-success' }, window.location.origin);
                }
                window.close();
                setTimeout(() => window.close(), 100);
              </script>
            </body>
          </html>`,
          {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          }
        )
      }
      
      // Regular flow: redirect to home page (campaign generator)
      // Form state restoration and auto-generation handled client-side
      return NextResponse.redirect(`${origin}/`)
    } catch (err) {
      console.error('❌ Callback error:', err)
      return NextResponse.redirect(`${origin}/login?error=callback_failed`)
    }
  }

  // No code provided
  console.log('⚠️ No code in callback')
  return NextResponse.redirect(`${origin}/login`)
}