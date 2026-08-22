import { NextRequest, NextResponse } from 'next/server'

// In-memory cache for live connections, events, room metadata and connection locks
declare global {
  var __tiktokConnections: Map<string, any> | undefined
  var __tiktokEventsQueue: Map<string, any[]> | undefined
  var __tiktokRoomInfo: Map<string, any> | undefined
  var __tiktokConnectingLocks: Map<string, Promise<any>> | undefined
  var __tiktokDemoModes: Map<string, boolean> | undefined
}

if (!global.__tiktokConnections) global.__tiktokConnections = new Map()
if (!global.__tiktokEventsQueue) global.__tiktokEventsQueue = new Map()
if (!global.__tiktokRoomInfo) global.__tiktokRoomInfo = new Map()
if (!global.__tiktokConnectingLocks) global.__tiktokConnectingLocks = new Map()
if (!global.__tiktokDemoModes) global.__tiktokDemoModes = new Map()

const connections = global.__tiktokConnections
const eventsQueue = global.__tiktokEventsQueue
const roomInfoMap = global.__tiktokRoomInfo
const connectingLocks = global.__tiktokConnectingLocks
const demoModes = global.__tiktokDemoModes

// Sample live stream comments in Thai for testing
const SAMPLE_LIVE_COMMENTS = [
  { nickname: 'น้องมายด์', comment: 'สวัสดีค่ะพี่ สอบถามชาเห็ดหน่อยค่ะ' },
  { nickname: 'บอส ธนากร', comment: 'ส่งของวันนี้ทันมั้ยครับ สั่งใน Bio Link แล้ว' },
  { nickname: 'คุณก้อย สายแคมป์', comment: 'มีโปรโมชั่นส่งฟรีมั้ยคะ' },
  { nickname: 'พี่ตั้ม พลังบวก', comment: 'สวัสดีครับ เข้ามาให้กำลังใจครับ สู้ๆ' },
  { nickname: 'แอนนา รีวิว', comment: 'ตัวนี้ทานง่ายมั้ยคะ รสชาติเป็นยังไงบ้าง' },
  { nickname: 'หมอโอ๊ต', comment: 'ทานก่อนนอนได้มั้ยครับ' },
  { nickname: 'ช่างเอก ปราจีน', comment: 'สนใจสั่งซื้อสินค้าตัวท็อปครับ' }
]

// Extract Room ID and Username from any input format (URL, Share link, @username, or direct Room ID)
async function resolveTikTokTarget(rawInput: string): Promise<{ username: string; roomId: string | null; targetKey: string }> {
  let cleaned = rawInput.trim()

  // 1. Direct 15-22 digit numeric Room ID
  if (/^\d{15,22}$/.test(cleaned)) {
    return { username: cleaned, roomId: cleaned, targetKey: cleaned }
  }

  // 2. TikTok URL (vt.tiktok.com or tiktok.com/@username/live)
  if (cleaned.includes('tiktok.com')) {
    try {
      // If it is a short link (vt.tiktok.com), follow redirect to get final destination
      if (cleaned.includes('vt.tiktok.com')) {
        const res = await fetch(cleaned, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        })
        cleaned = res.url || cleaned
      }

      // Check for room_id in URL params or path
      const matchRoom = cleaned.match(/room_id=(\d{15,22})/) || cleaned.match(/\/live\/(\d{15,22})/)
      const roomId = matchRoom ? matchRoom[1] : null

      // Check for username in URL
      const matchUser = cleaned.match(/@([a-zA-Z0-9_.-]+)/)
      const username = matchUser ? matchUser[1].toLowerCase() : (roomId || 'streamer')

      const targetKey = roomId || username
      return { username, roomId, targetKey }
    } catch (e) {
      console.warn('[TikTok Live] URL resolution error:', e)
    }
  }

  // 3. Regular username (@amth)
  const username = cleaned.replace('@', '').trim().toLowerCase()
  return { username, roomId: null, targetKey: username }
}

// Scrape / Fetch Room ID from TikTok Web Page as fallback
async function fetchRoomIdFromWeb(username: string): Promise<string | null> {
  if (/^\d{15,22}$/.test(username)) return username

  try {
    const res = await fetch(`https://www.tiktok.com/@${username}/live`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'th-TH,th;q=0.9',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 2 }
    })
    const html = await res.text()

    const patterns = [
      /"roomId":"(\d{16,22})"/,
      /"liveRoomId":"(\d{16,22})"/,
      /room_id=(\d{16,22})/,
      /"room":\{[^}]*"id":"(\d{16,22})"/,
      /"id":"(\d{16,22})"[^{}]*"status":2/
    ]

    for (const p of patterns) {
      const match = html.match(p)
      if (match && match[1]) {
        return match[1]
      }
    }
  } catch (e) {}

  return null
}

// Connect to TikTok Live Stream
async function connectToTikTokLive(rawInput: string) {
  const { username, roomId: parsedRoomId, targetKey } = await resolveTikTokTarget(rawInput)

  if (connections.has(targetKey)) {
    const existing = connections.get(targetKey)
    if (existing && (existing.isConnected || existing.roomId)) {
      return existing
    }
  }

  if (connectingLocks.has(targetKey)) {
    return await connectingLocks.get(targetKey)
  }

  const connectPromise = (async () => {
    try {
      let WebcastPushConnection = null
      try {
        // @ts-ignore
        const tiktokModule = typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__('tiktok-live-connector') : eval('require')('tiktok-live-connector')
        WebcastPushConnection = tiktokModule?.WebcastPushConnection || tiktokModule
      } catch (e) {
        console.warn('[TikTok Live] Dynamic require error:', e)
      }

      if (!WebcastPushConnection) {
        throw new Error('กรุณารันคำสั่ง npm install tiktok-live-connector')
      }

      // Try to find Room ID
      const finalRoomId = parsedRoomId || await fetchRoomIdFromWeb(username)
      const connectTarget = finalRoomId || username

      const clientOptions: any = {
        processInitialData: false,
        enableExtendedGiftInfo: true,
        requestPollingIntervalMs: 1000,
        clientParams: {
          app_language: 'th-TH',
          webcast_language: 'th'
        }
      }

      const tiktokLiveConnection = new WebcastPushConnection(connectTarget, clientOptions)

      let state: any
      if (finalRoomId) {
        state = await tiktokLiveConnection.connect(finalRoomId)
      } else {
        state = await tiktokLiveConnection.connect()
      }

      const actualRoomId = state?.roomId || finalRoomId || 'CONNECTED'
      console.log(`[TikTok Live] Connected successfully! Room: ${actualRoomId} for @${username}`)

      const infoObj = {
        isLive: true,
        roomId: actualRoomId,
        username: `@${username}`,
        title: state?.roomInfo?.title || `ไลฟ์สดของ @${username}`,
        viewerCount: state?.roomInfo?.user_count || 1,
        likeCount: 0,
        connectedAt: new Date().toISOString(),
        statusText: 'กำลังถ่ายทอดสด (LIVE)'
      }

      // Cache info under all alias keys
      roomInfoMap.set(targetKey, infoObj)
      roomInfoMap.set(username, infoObj)
      roomInfoMap.set(rawInput, infoObj)
      if (actualRoomId) roomInfoMap.set(actualRoomId, infoObj)

      if (!eventsQueue.has(targetKey)) eventsQueue.set(targetKey, [])
      if (!eventsQueue.has(username)) eventsQueue.set(username, [])

      // 1. Listen for Chat Comments
      tiktokLiveConnection.on('chat', (data: any) => {
        console.log(`[TikTok Live @${username}] Chat:`, data.nickname, data.comment)
        const eventItem = {
          id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          uniqueId: data.uniqueId,
          nickname: data.nickname || data.uniqueId,
          comment: data.comment,
          type: 'comment',
          timestamp: Date.now()
        }
        
        const q1 = eventsQueue.get(targetKey) || []
        q1.push(eventItem)
        if (q1.length > 50) q1.shift()
        eventsQueue.set(targetKey, q1)

        const q2 = eventsQueue.get(username) || []
        q2.push(eventItem)
        if (q2.length > 50) q2.shift()
        eventsQueue.set(username, q2)
      })

      // 2. Listen for Gifts
      tiktokLiveConnection.on('gift', (data: any) => {
        if (data.giftType === 1 && !data.repeatEnd) return
        const eventItem = {
          id: 'gift_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          uniqueId: data.uniqueId,
          nickname: data.nickname || data.uniqueId,
          comment: `ส่งของขวัญ ${data.giftName} จำนวน ${data.repeatCount || data.diamondCount || 1} ชิ้น`,
          type: 'gift',
          giftName: data.giftName,
          count: data.repeatCount || data.diamondCount || 1,
          timestamp: Date.now()
        }

        const q1 = eventsQueue.get(targetKey) || []
        q1.push(eventItem)
        eventsQueue.set(targetKey, q1)

        const q2 = eventsQueue.get(username) || []
        q2.push(eventItem)
        eventsQueue.set(username, q2)
      })

      // 3. Listen for Viewers and Likes
      tiktokLiveConnection.on('roomUser', (data: any) => {
        const curr = roomInfoMap.get(targetKey) || {}
        const updated = { ...curr, viewerCount: data.viewerCount || curr.viewerCount || 1 }
        roomInfoMap.set(targetKey, updated)
        roomInfoMap.set(username, updated)
      })

      tiktokLiveConnection.on('like', (data: any) => {
        const curr = roomInfoMap.get(targetKey) || {}
        const updated = { ...curr, likeCount: data.totalLikeCount || curr.likeCount || 0 }
        roomInfoMap.set(targetKey, updated)
        roomInfoMap.set(username, updated)
      })

      // 4. Handle Disconnect
      tiktokLiveConnection.on('disconnected', () => {
        console.log(`[TikTok Live] Disconnected from @${username}`)
        connections.delete(targetKey)
        connections.delete(username)
      })

      tiktokLiveConnection.on('streamEnd', () => {
        console.log(`[TikTok Live] Stream ended for @${username}`)
        connections.delete(targetKey)
        connections.delete(username)
        const offlineInfo = { isLive: false, roomId: null, statusText: 'ไลฟ์สดจบลงแล้ว (Offline)' }
        roomInfoMap.set(targetKey, offlineInfo)
        roomInfoMap.set(username, offlineInfo)
      })

      connections.set(targetKey, tiktokLiveConnection)
      connections.set(username, tiktokLiveConnection)
      return tiktokLiveConnection
    } catch (err: any) {
      console.log(`[TikTok Live] Connect error for @${username}:`, err.message || err)
      const offlineInfo = {
        isLive: false,
        roomId: null,
        title: null,
        viewerCount: 0,
        likeCount: 0,
        statusText: 'ออฟไลน์ (ยังไม่ได้เปิดไลฟ์สด หรือ Username ไม่ถูกต้อง)',
        errorDetails: err.message || 'Live room offline'
      }
      roomInfoMap.set(targetKey, offlineInfo)
      roomInfoMap.set(username, offlineInfo)
      roomInfoMap.set(rawInput, offlineInfo)
      return null
    } finally {
      connectingLocks.delete(targetKey)
    }
  })()

  connectingLocks.set(targetKey, connectPromise)
  return await connectPromise
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawInput = searchParams.get('username') || searchParams.get('user') || ''
  const action = searchParams.get('action') // 'connect' | 'disconnect' | 'toggle_demo'

  const { username, roomId, targetKey } = await resolveTikTokTarget(rawInput)

  if (!username && !roomId) {
    return NextResponse.json({ success: false, message: 'กรุณาระบุ TikTok Username หรือลิงก์แชร์ห้องไลฟ์' }, { status: 400 })
  }

  // Disconnect handler
  if (action === 'disconnect') {
    const conn = connections.get(targetKey) || connections.get(username)
    if (conn) {
      try { conn.disconnect() } catch (e) {}
      connections.delete(targetKey)
      connections.delete(username)
    }
    eventsQueue.delete(targetKey)
    eventsQueue.delete(username)
    demoModes.delete(targetKey)
    const off = { isLive: false, roomId: null, statusText: 'ออฟไลน์ (ตัดการเชื่อมต่อแล้ว)' }
    roomInfoMap.set(targetKey, off)
    roomInfoMap.set(username, off)
    return NextResponse.json({ success: true, message: 'ตัดการเชื่อมต่อเรียบร้อยแล้ว', isLive: false })
  }

  // Toggle Demo Mode
  if (action === 'toggle_demo') {
    const currentDemo = demoModes.get(targetKey) || demoModes.get(username) || false
    const nextDemo = !currentDemo
    demoModes.set(targetKey, nextDemo)
    demoModes.set(username, nextDemo)
    return NextResponse.json({ success: true, demoMode: nextDemo, message: nextDemo ? 'เปิดโหมดจำลองคอมเมนต์สด' : 'ปิดโหมดจำลอง' })
  }

  // Connect or Check Live Status
  let isConnected = connections.has(targetKey) || connections.has(username)
  if (!isConnected || action === 'connect') {
    const conn = await connectToTikTokLive(rawInput)
    isConnected = Boolean(conn)
  }

  // Check Demo Mode
  const isDemo = demoModes.get(targetKey) || demoModes.get(username) || false
  if (isDemo && Math.random() < 0.35) {
    const randComment = SAMPLE_LIVE_COMMENTS[Math.floor(Math.random() * SAMPLE_LIVE_COMMENTS.length)]
    const q = eventsQueue.get(targetKey) || eventsQueue.get(username) || []
    q.push({
      id: 'demo_' + Date.now(),
      uniqueId: 'viewer_demo',
      nickname: randComment.nickname,
      comment: randComment.comment,
      type: 'comment',
      timestamp: Date.now()
    })
    eventsQueue.set(targetKey, q)
    eventsQueue.set(username, q)
  }

  const roomData = roomInfoMap.get(targetKey) || roomInfoMap.get(username) || roomInfoMap.get(rawInput) || {
    isLive: isConnected,
    roomId: roomId || null,
    statusText: isConnected ? 'กำลังเชื่อมต่อห้องไลฟ์สด' : 'ออฟไลน์ (ยังไม่เริ่มไลฟ์)'
  }

  // Retrieve pending events
  const q1 = eventsQueue.get(targetKey) || []
  const q2 = eventsQueue.get(username) || []
  const combined = [...q1, ...q2]
  const uniqueEvents = Array.from(new Map(combined.map(item => [item.id, item])).values())

  eventsQueue.set(targetKey, [])
  eventsQueue.set(username, [])

  return NextResponse.json({
    success: true,
    connected: isConnected || isDemo,
    isLive: isDemo ? true : Boolean(roomData.isLive),
    isDemoMode: isDemo,
    username: `@${username}`,
    room: {
      roomId: isDemo ? 'DEMO-ROOM-LIVE' : (roomData.roomId || roomId || null),
      title: isDemo ? `[โหมดจำลองทดสอบ] ไลฟ์สดของ @${username}` : (roomData.title || null),
      viewerCount: isDemo ? 58 : (roomData.viewerCount || 0),
      likeCount: isDemo ? 180 : (roomData.likeCount || 0),
      statusText: isDemo ? 'กำลังจำลองคอมเมนต์สด (Demo Active) 🔴' : (roomData.statusText || (roomData.isLive ? 'กำลังถ่ายทอดสด (LIVE)' : 'ออฟไลน์ (Offline)')),
      errorDetails: roomData.errorDetails || null
    },
    eventsCount: uniqueEvents.length,
    events: uniqueEvents,
    timestamp: Date.now()
  })
}

// POST endpoint for manual test injection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rawInput = body.username || 'amth'
    const { username, targetKey } = await resolveTikTokTarget(rawInput)
    const { comment, nickname, type, giftName, count } = body

    if (!comment) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุข้อความคอมเมนต์' }, { status: 400 })
    }

    const newEvent = {
      id: 'test_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      uniqueId: 'tester',
      nickname: nickname || 'คนดูในไลฟ์',
      comment: comment.trim(),
      type: type || 'comment',
      giftName: giftName || null,
      count: count || 1,
      timestamp: Date.now()
    }

    const q1 = eventsQueue.get(targetKey) || []
    q1.push(newEvent)
    eventsQueue.set(targetKey, q1)

    const q2 = eventsQueue.get(username) || []
    q2.push(newEvent)
    eventsQueue.set(username, q2)

    return NextResponse.json({
      success: true,
      message: 'ส่งคอมเมนต์ทดสอบเข้าสู่คิวอ่านเสียงเรียบร้อยแล้ว',
      event: newEvent
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
