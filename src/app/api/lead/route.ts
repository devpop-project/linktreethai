import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      landing_page_id,
      package_name,
      customer_name,
      customer_phone,
      customer_line,
      shipping_address,
      order_note,
      name, 
      phone, 
      email, 
      line_id, 
      note, 
      amount, 
      address, 
      order_code, 
      status,
      payment_method,
      slip_url,
      utm,
      line_channel_access_token,
      line_user_id,
      line_webhook_url,
      line_notify_token
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Missing required fields (name)' }, { status: 400 })
    }

    const orderRef = order_code ? String(order_code).trim() : `ORD-${Date.now().toString().slice(-6)}`
    const isPromptPay = payment_method === 'promptpay' || Boolean(slip_url)
    const isCOD = payment_method === 'cod'
    const isOrder = Boolean(address || isPromptPay || isCOD || amount)
    
    let headerTitle = '💬 มีข้อความติดต่อ/ลีดใหม่!'
    if (isPromptPay) headerTitle = '📱 มีออเดอร์โอนพร้อมเพย์ (แนบสลิปแล้ว)!'
    else if (isCOD) headerTitle = '🚚 มีออเดอร์เก็บเงินปลายทาง (COD) ใหม่!'
    else if (isOrder) headerTitle = '🛒 มีออเดอร์สั่งซื้อใหม่!'

    // =========================================================================
    // 1. SUPABASE CLIENT & ADMIN SETTINGS LOOKUP
    // =========================================================================
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // Convert Base64 slip to permanent public Storage URL if uploaded as Data URL
    let finalSlipUrl = slip_url ? String(slip_url).trim() : null
    if (finalSlipUrl && finalSlipUrl.startsWith('data:image/')) {
      try {
        const matches = finalSlipUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/)
        if (matches) {
          const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
          const buffer = Buffer.from(matches[2], 'base64')
          const fileName = `slips/order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`

          let uploadSuccess = false
          // Try bucket 'media' first (standard Supabase bucket)
          try {
            const { data: up1, error: err1 } = await supabase.storage
              .from('media')
              .upload(fileName, buffer, { contentType: `image/${matches[1]}`, upsert: true })
            if (!err1 && up1) {
              const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName)
              finalSlipUrl = publicUrl
              uploadSuccess = true
            }
          } catch (e1) {}

          // Fallback to bucket 'linktree-assets'
          if (!uploadSuccess) {
            try {
              const { data: up2, error: err2 } = await supabase.storage
                .from('linktree-assets')
                .upload(fileName, buffer, { contentType: `image/${matches[1]}`, upsert: true })
              if (!err2 && up2) {
                const { data: { publicUrl } } = supabase.storage.from('linktree-assets').getPublicUrl(fileName)
                finalSlipUrl = publicUrl
              }
            } catch (e2) {}
          }
        }
      } catch (uploadEx) {
        console.warn('Server slip upload notice:', uploadEx)
      }
    }

    // Construct Clean Human-Readable Notification Message
    const custName = String(name || customer_name || 'ลูกค้า').trim()
    const custPhone = String(phone || customer_phone || '-').trim()
    const custLine = String(line_id || customer_line || '-').trim()
    const custAddress = String(address || shipping_address || '').trim()
    const custNote = String(note || order_note || '').trim()
    const pkgName = package_name ? String(package_name).trim() : null

    let linePushMessage = `${headerTitle}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      (pkgName ? `📦 รายการ: ${pkgName}\n` : '') +
      `👤 ลูกค้า: ${custName}\n` +
      `📱 เบอร์โทร: ${custPhone}\n` +
      (custLine !== '-' ? `🟢 LINE ID: ${custLine}\n` : '') +
      (email ? `✉️ อีเมล: ${String(email).trim()}\n` : '') +
      (custAddress ? `🏠 ที่อยู่จัดส่ง: ${custAddress}\n` : '') +
      (amount ? `💰 ยอดชำระ: ฿${parseFloat(String(amount)).toLocaleString()} บาท\n` : '') +
      `💳 วิธีชำระเงิน: ${isPromptPay ? 'โอนเงินผ่านพร้อมเพย์ (แนบสลิปเรียบร้อย)' : (isCOD ? 'เก็บเงินปลายทาง (COD)' : 'ชำระเงินออนไลน์')}\n` +
      (finalSlipUrl ? `🧾 สลิปโอนเงิน: ${finalSlipUrl}\n` : '') +
      (utm?.utm_source ? `🎯 แหล่งที่มา: ${utm.utm_source}${utm.utm_campaign ? ` / ${utm.utm_campaign}` : ''}\n` : '') +
      (custNote ? `📝 บันทึกเพิ่มเติม: ${custNote}\n` : '') +
      `⏰ วันที่: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}\n` +
      `🏷️ รหัสอ้างอิง: #${orderRef}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `🔗 ดูรายการออเดอร์ในระบบ: https://linktreethai.in.th/admin`

    let channelToken = (line_channel_access_token || '').trim()
    let targetUserId = (line_user_id || '').trim()
    let webhookUrl = (line_webhook_url || '').trim()
    let notifyToken = (line_notify_token || '').trim()

    // 1.1 Check Owner Profile for credentials
    if ((!channelToken || !targetUserId) && user_id) {
      try {
        const { data: owner } = await supabase
          .from('profiles')
          .select('id, username, full_name, role, line_channel_access_token, line_user_id, line_webhook_url, line_notify_token')
          .eq('id', user_id)
          .single()

        if (owner) {
          if (!channelToken && owner.line_channel_access_token) channelToken = owner.line_channel_access_token.trim()
          if (!targetUserId && owner.line_user_id) targetUserId = owner.line_user_id.trim()
          if (!webhookUrl && owner.line_webhook_url) webhookUrl = owner.line_webhook_url.trim()
          if (!notifyToken && owner.line_notify_token) notifyToken = owner.line_notify_token.trim()
        }
      } catch (e) {}
    }

    // 1.2 Fallback: Check system_settings table (where Admin configures LINE Messaging API)
    if (!channelToken || !targetUserId) {
      try {
        const { data: sysData } = await supabase
          .from('system_settings')
          .select('key, value')
          .in('key', ['line_channel_access_token', 'line_user_id', 'line_webhook_url', 'line_notify_token'])

        if (sysData && sysData.length > 0) {
          sysData.forEach((row: any) => {
            if (row.key === 'line_channel_access_token' && row.value && !channelToken) channelToken = row.value.trim()
            if (row.key === 'line_user_id' && row.value && !targetUserId) targetUserId = row.value.trim()
            if (row.key === 'line_webhook_url' && row.value && !webhookUrl) webhookUrl = row.value.trim()
            if (row.key === 'line_notify_token' && row.value && !notifyToken) notifyToken = row.value.trim()
          })
        }
      } catch (e) {}
    }

    // 1.3 Fallback: Check Admin Profiles row
    if (!channelToken || !targetUserId) {
      try {
        const { data: adminProf } = await supabase
          .from('profiles')
          .select('line_channel_access_token, line_user_id, line_webhook_url, line_notify_token')
          .eq('role', 'admin')
          .limit(1)
          .single()

        if (adminProf) {
          if (!channelToken && adminProf.line_channel_access_token) channelToken = adminProf.line_channel_access_token.trim()
          if (!targetUserId && adminProf.line_user_id) targetUserId = adminProf.line_user_id.trim()
          if (!webhookUrl && adminProf.line_webhook_url) webhookUrl = adminProf.line_webhook_url.trim()
          if (!notifyToken && adminProf.line_notify_token) notifyToken = adminProf.line_notify_token.trim()
        }
      } catch (e) {}
    }

    // =========================================================================
    // 2. DISPATCH LINE MESSAGING API PUSH NOTIFICATION (WITH IMAGE IF SLIP)
    // =========================================================================
    if (channelToken && targetUserId) {
      try {
        const messagesPayload: any[] = [
          {
            type: 'text',
            text: linePushMessage
          }
        ]

        // If slip image URL exists, send slip image directly in LINE chat!
        if (finalSlipUrl && finalSlipUrl.startsWith('https://')) {
          messagesPayload.push({
            type: 'image',
            originalContentUrl: finalSlipUrl,
            previewImageUrl: finalSlipUrl
          })
        }

        let lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${channelToken}`
          },
          body: JSON.stringify({
            to: targetUserId,
            messages: messagesPayload
          })
        })

        // Fail-safe Retry: If sending with image fails (e.g. LINE rejects external image URL with 400),
        // immediately send the text notification so the admin NEVER misses the order!
        if (!lineRes.ok && messagesPayload.length > 1) {
          console.warn('[LINE API] Push with image was rejected, retrying text-only payload...')
          lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
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
        }

        if (!lineRes.ok) {
          const errText = await lineRes.text()
          console.error('[LINE API] Error response:', lineRes.status, errText)
        } else {
          console.log('✅ LINE Messaging API push delivered successfully!')
        }
      } catch (lineErr) {
        console.error('Error executing LINE Messaging API push:', lineErr)
      }
    }

    // Fallback Webhook
    if (webhookUrl) {
      try {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: isOrder ? 'new_order' : 'new_lead',
            timestamp: new Date().toISOString(),
            order_code: orderRef,
            payment_method: isPromptPay ? 'promptpay' : (isCOD ? 'cod' : 'online'),
            slip_url: finalSlipUrl || null,
            lead: { name, phone, email, line_id, address, amount, note, utm }
          })
        }).catch(() => {})
      } catch (e) {}
    }

    // Fallback LINE Notify
    if (notifyToken && (!channelToken || !targetUserId)) {
      try {
        fetch('https://notify-api.line.me/api/notify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${notifyToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({ message: `\n${linePushMessage}` }).toString()
        }).catch(() => {})
      } catch (e) {}
    }

    // =========================================================================
    // 3. SAVE ORDER / LEAD TO DATABASE
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
          note: (finalSlipUrl ? `[สลิป: ${finalSlipUrl}] ` : '') + (note ? String(note).trim() : ''),
          status: status || (isPromptPay ? 'paid' : 'pending'),
          created_at: new Date().toISOString()
        }

        await supabase.from('leads').insert([fullPayload])

        // Save into payment_transactions if promptpay slip uploaded
        if (finalSlipUrl && amount) {
          try {
            await supabase.from('payment_transactions').insert([{
              user_id,
              amount: parseFloat(String(amount)),
              payment_type: 'product_order',
              slip_url: finalSlipUrl,
              status: 'pending',
              created_at: new Date().toISOString()
            }])
          } catch (ptEx) {
            console.warn('Payment transaction insert warning:', ptEx)
          }
        }
      } catch (dbErr) {
        console.warn('DB lead insert notice:', dbErr)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'บันทึกออเดอร์และแจ้งเตือนเข้า LINE เรียบร้อยแล้ว',
      order_code: orderRef,
      slip_url: finalSlipUrl
    })
  } catch (e: any) {
    console.error('Unhandled lead API exception:', e)
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 })
  }
}
