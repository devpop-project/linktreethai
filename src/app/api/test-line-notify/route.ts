import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { token, webhook_url } = await request.json()

    if (!token && !webhook_url) {
      return NextResponse.json({ error: 'กรุณากรอก LINE Notify Token หรือ Webhook URL' }, { status: 400 })
    }

    let notifySuccess = false
    let webhookSuccess = false
    let errorMsg = ''

    if (token) {
      const testMsg = `\n🔔 ทดสอบการเชื่อมต่อ LINE Notify สำเร็จ!\n------------------------------\nระบบ LinkTreeThai เชื่อมต่อกับ LINE ของคุณเรียบร้อยแล้ว\nเมื่อมีลูกค้ากรอกข้อมูลหรือสั่งซื้อ COD ระบบจะแจ้งเตือนมาที่นี่แบบ Real-time ทันทีครับ 🎉`
      
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
        notifySuccess = true
      } else {
        errorMsg = data.message || 'Token LINE Notify ไม่ถูกต้อง'
      }
    }

    if (webhook_url) {
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
        webhookSuccess = true
      } else {
        if (!errorMsg) errorMsg = 'Webhook URL ตอบกลับสถานะไม่สำเร็จ'
      }
    }

    if (notifySuccess || webhookSuccess) {
      return NextResponse.json({ success: true, message: 'ส่งข้อความทดสอบเข้า LINE เรียบร้อยแล้ว!' })
    } else {
      return NextResponse.json({ error: errorMsg || 'ไม่สามารถส่งข้อความได้ กรุณาตรวจสอบ Token' }, { status: 400 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'เกิดข้อผิดพลาดในการส่งข้อความ' }, { status: 500 })
  }
}
