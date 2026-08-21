import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    const body = await request.json()
    const { user_id, name, phone, email, line_id, note, amount, address, order_code, status } = body

    if (!user_id || !name) {
      return NextResponse.json({ error: 'Missing required fields (user_id, name)' }, { status: 400 })
    }

    const insertPayload = {
      user_id,
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : null,
      email: email ? String(email).trim() : null,
      line_id: line_id ? String(line_id).trim() : null,
      amount: amount ? parseFloat(String(amount)) : null,
      address: address ? String(address).trim() : null,
      order_code: order_code ? String(order_code).trim() : `LEAD-${Date.now().toString().slice(-6)}`,
      note: note ? String(note).trim() : null,
      status: status || 'pending'
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([insertPayload])
      .select()

    if (error) {
      console.error('Error inserting into leads table:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also record lead conversion in analytics_events
    try {
      await supabase.from('analytics_events').insert([{
        user_id,
        event_type: 'lead_submission',
        target_id: data[0]?.id || null,
        referrer: 'bio_or_landing_page',
        created_at: new Date().toISOString()
      }])
    } catch (e) {}

    return NextResponse.json({ success: true, lead: data[0] })
  } catch (e: any) {
    console.error('Unhandled lead API exception:', e)
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 })
  }
}
