import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { 
      token, 
      webhook_url, 
      channel_access_token, 
      user_id 
    } = await request.json()

    if (!channel_access_token && !user_id && !token && !webhook_url) {
      return NextResponse.json({ 
        error: 'กรุณาระบุ Channel Access Token & User ID ของ LINE Messaging API หรือ Webhook URL' 
      }, { status: 400 })
    }

    // Friendly pre-validation: If user accidentally inputs Channel Secret (32 hex characters)
    if (channel_access_token && channel_access_token.trim().length <= 40 && /^[a-f0-9]+$/i.test(channel_access_token.trim())) {
      return NextResponse.json({
        error: '⚠️ ค่าที่ใส่ในช่อง 1 คือ Channel Secret (32 ตัวอักษร) ไม่ใช่ Channel Access Token ครับ\n👉 วิธีแก้ไข: ไปที่แท็บ "Messaging API" ใน LINE Developers เลื่อนลงล่างสุด แล้วกดปุ่ม "Issue" ที่หัวข้อ Channel access token แล้วคัดลอก Token ตัวยาว (160+ ตัวอักษร) มาใส่แทนครับ'
      }, { status: 400 })
    }

    let success = false
    let errorMsg = ''

    // 1. Official LINE Messaging API (LINE OA / Developers)
    if (channel_access_token && user_id) {
      const testMsg = `🔔 ทดสอบการเชื่อมต่อ LINE Messaging API สำเร็จ! 🎉\n━━━━━━━━━━━━━━━━━\nระบบ LinkTreeThai เชื่อมต่อกับ LINE ของคุณเรียบร้อยแล้ว\nเมื่อมีลูกค้าสั่งซื้อ COD หรือกรอกแบบฟอร์ม ข้อความจะแจ้งเตือนเข้าห้องแชตนี้ทันทีแบบ Real-time ครับ!`

      try {
        const res = await fetch('https://api.line.me/v2/bot/message/push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${channel_access_token.trim()}`
          },
          body: JSON.stringify({
            to: user_id.trim(),
            messages: [
              {
                type: 'text',
                text: testMsg
              }
            ]
          })
        })

        if (res.ok) {
          success = true
        } else {
          const errData = await res.json()
          if (res.status === 401) {
            errorMsg = `LINE API Error (401): Token ไม่ถูกต้อง กรุณาไปที่แท็บ "Messaging API" ใน LINE Developers เลื่อนลงล่างสุดแล้วกด Issue เพื่อคัดลอก Channel Access Token (Long-lived) ตัวยาวมาใส่ครับ`
          } else {
            errorMsg = `LINE API Error (${res.status}): ${errData.message || 'Token หรือ User ID ไม่ถูกต้อง'}`
          }
        }
      } catch (lineErr: any) {
        errorMsg = `LINE API Error: ${lineErr.message}`
      }
    }

    // 2. Custom Webhook / LINE OA Webhook URL
    if (!success && webhook_url) {
      try {
        const res = await fetch(webhook_url.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'test_notification',
            timestamp: new Date().toISOString(),
            message: 'ทดสอบการเชื่อมต่อ Webhook LinkTreeThai สำเร็จ'
          })
        })
        if (res.ok) {
          success = true
        } else {
          if (!errorMsg) errorMsg = 'Webhook URL ตอบกลับสถานะไม่สำเร็จ'
        }
      } catch (wErr: any) {
        if (!errorMsg) errorMsg = `Webhook Error: ${wErr.message}`
      }
    }

    // 3. Legacy LINE Notify (Fallback)
    if (!success && token) {
      try {
        const testMsg = `\n🔔 ทดสอบการเชื่อมต่อ LINE Notify สำเร็จ!\n------------------------------\nระบบ LinkTreeThai เชื่อมต่อกับ LINE ของคุณเรียบร้อยแล้ว`
        const res = await fetch('https://notify-api.line.me/api/notify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.trim()}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({ message: testMsg }).toString()
        })
        const data = await res.json()
        if (res.ok && data.status === 200) {
          success = true
        } else {
          if (!errorMsg) errorMsg = data.message || 'Token LINE Notify ไม่ถูกต้อง'
        }
      } catch (nErr: any) {
        if (!errorMsg) errorMsg = `LINE Notify Error: ${nErr.message}`
      }
    }

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'ส่งข้อความทดสอบเข้า LINE เรียบร้อยแล้ว! ตรวจสอบที่ห้องแชต LINE ของคุณได้เลยครับ' 
      })
    } else {
      return NextResponse.json({ 
        error: errorMsg || 'ไม่สามารถส่งข้อความได้ กรุณาตรวจสอบ Channel Access Token และ User ID' 
      }, { status: 400 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'เกิดข้อผิดพลาดในการส่งข้อความ' }, { status: 500 })
  }
}
