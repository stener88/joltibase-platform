import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/email/client'
import { redis } from '@/lib/redis/client'

export async function GET() {
  const results = {
    supabase: 'Not tested',
    resend: 'Not tested',
    redis: 'Not tested',
  }

  // Test Supabase
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    
    // Connection works if we can query (even if no user logged in)
    results.supabase = '✅ Connected'
  } catch (e: any) {
    results.supabase = `❌ Error: ${e.message}`
  }

  // Test Resend
  try {
    results.resend = resend ? '✅ Client initialized' : '❌ Failed'
  } catch (e: any) {
    results.resend = `❌ Error: ${e.message}`
  }

  // Test Redis
  try {
    await redis.set('test-connection', 'success', { ex: 10 })
    const value = await redis.get('test-connection')
    results.redis = value === 'success' ? '✅ Connected' : '❌ Failed to read/write'
  } catch (e: any) {
    results.redis = `❌ Error: ${e.message}`
  }

  return NextResponse.json(results)
}