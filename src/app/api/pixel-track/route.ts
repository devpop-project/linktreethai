import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const { user_id, landing_page_id, pixel_type, pixel_id, event_name, event_data, url } = await request.json()

    if (!user_id || !event_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()
    await supabase.from('pixel_events').insert([{
      user_id,
      landing_page_id: landing_page_id || null,
      pixel_type: pixel_type || 'all',
      pixel_id: pixel_id || null,
      event_name,
      event_data: event_data || {},
      url: url || null,
      created_at: new Date().toISOString()
    }])

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
