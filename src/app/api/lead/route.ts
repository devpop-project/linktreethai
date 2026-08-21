import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      name, 
      phone, 
      email, 
      line_id, 
      note, 
      amount, 
      address, 
      order_code, 
      status,
      line_channel_access_token,
      line_user_id,
      line_webhook_url,
      line_notify_token
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Missing required fields (name)' }, { status: 400 })
    }

    const orderRef = order_code ? String(order_code).trim() : `MSG-${Date.now().toString().slice(-6)}`
    const isOrder = Boolean(address || (note && (note.includes('COD') || note.includes('สั่งซื้อ') || note.includes('ออเดอร์'))) || amount)
    const headerTitle = isOrder ? '🛒 มีออเดอร์สั่งซื้อ (COD) ใหม่!' : '💬 มีข้อความติดต่อ/ลีดใหม่!'

    // Construct Clean Human-Readable Notification Message
    const linePushMessage = `${headerTitle}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `👤 ลูกค้า: ${String(name).trim()}\n` +
      `📱 เบอร์โทร: ${phone ? String(phone).trim() : '-'}\n` +
      `🟢 LINE ID: ${line_id ? String(line_id).trim() : '-'}\n` +
      (email ? `✉️ อีเมล: ${String(email).trim()}\n` : '') +
      (address ? `🏠 ที่อยู่จัดส่ง: ${String(address).trim()}\n` : '') +
      (amount ? `💰 ยอดเงิน: ฿${parseFloat(String(amount)).toLocaleString()} บาท\n` : '') +
      (note ? `📝 รายละเอียด: ${String(note).trim()}\n` : '') +
      `🏷️ รหัสอ้างอิง: #${orderRef}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `🔗 เข้าดูในแดชบอร์ด: https://linktreethai.com/dashboard`

    // =========================================================================
    // 1. REAL-TIME LINE NOTIFICATION (DISPATCHED IMMEDIATELY)
    // =========================================================================
    let channelToken = (line_channel_access_token || '').trim()
    let targetUserId = (line_user_id || '').trim()
    let webhookUrl = (line_webhook_url || '').trim()
    let notifyToken = (line_notify_token || '').trim()

    // Initialize Supabase Client for DB & Profile lookup
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // If tokens were not passed directly from client, query owner profile
    if ((!channelToken || !targetUserId) && !webhookUrl && !notifyToken && user_id) {
      try {
        const { data: owner } = await supabase
          .from('profiles')
          .select('id, username, full_name, role, master_expires_at, line_channel_access_token, line_user_id, line_webhook_url, line_notify_token')
          .eq('id', user_id)
          .single()

        if (owner) {
          channelToken = (owner.line_channel_access_token || '').trim()
          targetUserId = (owner.line_user_id || '').trim()
          webhookUrl = (owner.line_webhook_url || '').trim()
          notifyToken = (owner.line_notify_token || '').trim()
        }
      } catch (profErr) {
        console.warn('Notice: Could not fetch owner profile from DB:', profErr)
      }
    }

    // Execute LINE Messaging API Push
    if (channelToken && targetUserId) {
      try {
        const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${channelToken}`
          },
          body: JSON.stringify({
            to: targetUserId,
            messages: [
              {
                type: 'text',
                text: linePushMessage
              }
            ]
          })
        })
        if (!lineRes.ok) {
          const errText = await lineRes.text()
          console.error('LINE Messaging API error response:', lineRes.status, errText)
        } else {
          console.log('✅ LINE Messaging API push sent successfully!')
        }
      } catch (lineErr) {
        console.error('Error executing LINE Messaging API push:', lineErr)
      }
    }

    // Execute Custom Webhook / LINE OA Webhook
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: isOrder ? 'new_order' : 'new_lead',
            timestamp: new Date().toISOString(),
            order_code: orderRef,
            lead: {
              name,
              phone,
              email,
              line_id,
              address,
              amount,
              note
            }
          })
        })
        console.log('✅ Webhook sent successfully!')
      } catch (wErr) {
        console.error('Error executing Webhook push:', wErr)
      }
    }

    // Execute Legacy LINE Notify (Fallback)
    if (notifyToken && (!channelToken || !targetUserId)) {
      try {
        await fetch('https://notify-api.line.me/api/notify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${notifyToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({ message: `\n${linePushMessage}` }).toString()
        })
        console.log('✅ Legacy LINE Notify sent successfully!')
      } catch (nErr) {
        console.error('Error executing LINE Notify push:', nErr)
      }
    }

    // =========================================================================
    // 2. SAVE LEAD TO SUPABASE DATABASE (RESILIENT WITH FALLBACKS)
    // =========================================================================
    if (user_id) {
      try {
        const fullPayload: any = {
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

        const { error: insertErr } = await supabase.from('leads').insert([fullPayload])
        if (insertErr) {
          // Minimal fallback
          const minPayload = {
            user_id,
            name: String(name).trim(),
            phone: phone ? String(phone).trim() : null,
            line_id: line_id ? String(line_id).trim() : null,
            email: email ? String(email).trim() : null,
            note: note ? String(note).trim() : null
          }
          await supabase.from('leads').insert([minPayload])
        }

        // Record conversion event asynchronously
        try {
          await supabase.from('analytics_events').insert([{
            user_id,
            event_type: 'lead_submission',
            referrer: isOrder ? 'sales_landing_page' : 'bio_contact_form',
            created_at: new Date().toISOString()
          }])
        } catch (aErr) {}
      } catch (dbErr) {
        console.warn('Notice: Supabase lead insert notice:', dbErr)
      }
    }

    // Always return HTTP 200 Success
    return NextResponse.json({ 
      success: true, 
      message: 'ส่งข้อมูลและแจ้งเตือนเข้า LINE เรียบร้อยแล้ว',
      order_code: orderRef 
    })
  } catch (e: any) {
    console.error('Unhandled lead API exception:', e)
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 })
  }
}
