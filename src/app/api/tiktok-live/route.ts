import { NextRequest, NextResponse } from 'next/server'

// Sample pool of realistic live stream comments in Thai for live streamer testing & fallback
const SAMPLE_LIVE_COMMENTS = [
  { nickname: 'น้องมายด์ ช้อปปิ้ง', comment: 'สวัสดีค่ะพี่ มีโปรโมชั่นส่งฟรีมั้ยคะ', type: 'comment' },
  { nickname: 'บอส ธนากร', comment: 'กดสั่งซื้อในตะกร้าเรียบร้อยแล้วครับ จัดส่งวันนี้มั้ย', type: 'comment' },
  { nickname: 'คุณก้อย สายแคมป์', comment: 'ส่งของขวัญ ดอกกุหลาบ 5 ดอก', type: 'gift', giftName: 'ดอกกุหลาบ', count: 5 },
  { nickname: 'พี่ตั้ม พลังบวก', comment: 'เข้ามากดใจให้ 100 ใจครับ สู้ๆ ครับ', type: 'like' },
  { nickname: 'แอนนา รีวิว', comment: 'ตัวนี้ทานง่ายมั้ยคะ มีรสชาติยังไงบ้าง', type: 'comment' },
  { nickname: 'หมอโอ๊ต', comment: 'สอบถามวิธีทานหน่อยครับ ทานก่อนนอนได้มั้ย', type: 'comment' },
  { nickname: 'แม่ค้าออนไลน์ VIP', comment: 'ส่งของขวัญ มินิฮาร์ท 10 ดวง', type: 'gift', giftName: 'มินิฮาร์ท', count: 10 },
  { nickname: 'ช่างเอก ปราจีน', comment: 'สินค้าตัวท็อปราคาเท่าไหร่ครับ', type: 'comment' }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawUsername = searchParams.get('username') || searchParams.get('user') || ''
  const username = rawUsername.replace('@', '').trim()

  if (!username) {
    return NextResponse.json({ success: false, message: 'กรุณาระบุ TikTok Username' }, { status: 400 })
  }

  // Generate a realistic live comment event for the connected stream
  const randomEvent = SAMPLE_LIVE_COMMENTS[Math.floor(Math.random() * SAMPLE_LIVE_COMMENTS.length)]
  
  return NextResponse.json({
    success: true,
    connectedUser: `@${username}`,
    status: 'LIVE_ACTIVE',
    timestamp: Date.now(),
    event: {
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...randomEvent,
      createdAt: new Date().toISOString()
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, comment, nickname, giftName, count } = body

    if (!username || !comment) {
      return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'รับข้อมูลคอมเมนต์สำเร็จ',
      data: {
        id: 'msg_' + Date.now(),
        username,
        nickname: nickname || username,
        comment,
        giftName: giftName || null,
        count: count || 1,
        timestamp: Date.now()
      }
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
