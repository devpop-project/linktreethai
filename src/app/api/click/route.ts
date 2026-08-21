import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { linkId, userId, referrer } = await request.json()
    if (!linkId) return NextResponse.json({ error: 'Missing linkId' }, { status: 400 })

    const { error } = await supabase.rpc('increment_link_clicks', { link_id: linkId })
    
    // Also record in analytics_events
    if (userId) {
      try {
        await supabase.from('analytics_events').insert([{
          user_id: userId,
          event_type: 'link_click',
          target_id: linkId,
          referrer: referrer || null,
          created_at: new Date().toISOString()
        }])
      } catch (e) {}
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
