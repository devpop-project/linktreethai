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

    const orderRef = order_code ? String(order_code).trim() : `LEAD-${Date.now().toString().slice(-6)}`

    const insertPayload = {
      user_id,
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : null,
      email: email ? String(email).trim() : null,
      line_id: line_id ? String(line_id).trim() : null,
      amount: amount ? parseFloat(String(amount)) : null,
      address: address ? String(address).trim() : null,
      order_code: orderRef,
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

    // Record conversion event in analytics_events
    try {
      await supabase.from('analytics_events').insert([{
        user_id,
        event_type: 'lead_submission',
        target_id: data[0]?.id || null,
        referrer: 'bio_or_landing_page',
        created_at: new Date().toISOString()
      }])
    } catch (e) {}

    // REAL-TIME LINE NOTIFICATION (MASTER VIP & ADMIN EXCLUSIVE)
    try {
      const { data: owner } = await supabase
        .from('profiles')
        .select('id, username, full_name, role, master_expires_at, line_notify_token, line_webhook_url')
        .eq('id', user_id)
        .single()

      const isMaster = owner?.role === 'admin' || Boolean(
        owner?.master_expires_at && new Date(owner.master_expires_at).getTime() > Date.now()
      )

      if (isMaster && (owner?.line_notify_token || owner?.line_webhook_url)) {
        const isOrder = Boolean(address || (note && note.includes('COD')) || amount)
        const headerTitle = isOrder ? '🛒 มีออเดอร์สั่งซื้อ (COD) ใหม่!' : '💬 มีข้อความติดต่อ/ลีดใหม่!'
        
        const lineMsg = `\n${headerTitle}\n` +
          `------------------------------\n` +
          `👤 ลูกค้า: ${String(name).trim()}\n` +
          `📱 เบอร์โทร: ${phone ? String(phone).trim() : '-'}\n` +
          `🟢 LINE ID: ${line_id ? String(line_id).trim() : '-'}\n` +
          (email ? `✉️ อีเมล: ${String(email).trim()}\n` : '') +
          (address ? `🏠 ที่อยู่จัดส่ง: ${String(address).trim()}\n` : '') +
          (amount ? `💰 ยอดเงิน: ฿${parseFloat(String(amount)).toLocaleString()} บาท\n` : '') +
          (note ? `📝 รายละเอียด: ${String(note).trim()}\n` : '') +
          `🏷️ รหัสอ้างอิง: #${orderRef}\n` +
          `------------------------------\n` +
          `🔗 เข้าดูในแดชบอร์ด: https://linktreethai.com/dashboard`

        // 1. Send via LINE Notify Token
        if (owner?.line_notify_token) {
          try {
            await fetch('https://notify-api.line.me/api/notify', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${owner.line_notify_token.trim()}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams({ message: lineMsg }).toString()
            })
          } catch (lineErr) {
            console.error('Error sending LINE Notify message:', lineErr)
          }
        }

        // 2. Send via LINE OA Webhook / Custom Webhook
        if (owner?.line_webhook_url) {
          try {
            await fetch(owner.line_webhook_url.trim(), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: 'lead_submission',
                timestamp: new Date().toISOString(),
                owner_username: owner.username,
                is_order: isOrder,
                lead: insertPayload
              })
            })
          } catch (webhookErr) {
            console.error('Error sending Webhook:', webhookErr)
          }
        }
      }
    } catch (notifErr) {
      console.error('Error processing LINE notification:', notifErr)
    }

    return NextResponse.json({ success: true, lead: data[0] })
  } catch (e: any) {
    console.error('Unhandled lead API exception:', e)
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 })
  }
}
