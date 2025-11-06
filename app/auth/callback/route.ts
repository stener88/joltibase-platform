import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
      
      // Redirect to dashboard after successful auth
      return NextResponse.redirect(`${origin}/dashboard`)
    } catch (err) {
      console.error('❌ Callback error:', err)
      return NextResponse.redirect(`${origin}/login?error=callback_failed`)
    }
  }

  // No code provided
  console.log('⚠️ No code in callback')
  return NextResponse.redirect(`${origin}/login`)
}