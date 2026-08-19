import { NextResponse } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const { user_id, name, phone, email, note } = await request.json()

    if (!user_id || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        user_id,
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        email: email ? email.trim() : null,
        note: note ? note.trim() : null
      }])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, lead: data[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
