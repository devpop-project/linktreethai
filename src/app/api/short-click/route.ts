import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { slug, shortLinkId, referrer, userAgent } = await request.json()
    
    let resolvedShortLinkId = shortLinkId

    if (!resolvedShortLinkId && slug) {
      const { data } = await supabase.from('short_links').select('id').ilike('slug', slug).single()
      if (data) resolvedShortLinkId = data.id
    }

    if (resolvedShortLinkId) {
      await supabase.rpc('increment_short_link_clicks', { link_id: resolvedShortLinkId })

      // Insert into short_link_analytics
      try {
        await supabase.from('short_link_analytics').insert([{
          short_link_id: resolvedShortLinkId,
          referrer: referrer || null,
          user_agent: userAgent || null,
          ip: null,
          created_at: new Date().toISOString()
        }])
      } catch (e) {}
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
