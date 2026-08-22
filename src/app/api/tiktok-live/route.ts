import { NextRequest, NextResponse } from 'next/server'

// In-memory cache for live connections, events and room metadata
declare global {
  var __tiktokConnections: Map<string, any> | undefined
  var __tiktokEventsQueue: Map<string, any[]> | undefined
  var __tiktokRoomInfo: Map<string, any> | undefined
}

if (!global.__tiktokConnections) {
  global.__tiktokConnections = new Map()
}
if (!global.__tiktokEventsQueue) {
  global.__tiktokEventsQueue = new Map()
}
if (!global.__tiktokRoomInfo) {
  global.__tiktokRoomInfo = new Map()
}

const connections = global.__tiktokConnections
const eventsQueue = global.__tiktokEventsQueue
const roomInfoMap = global.__tiktokRoomInfo

// Helper to sanitize username
function formatUsername(user: string): string {
  return user.replace('@', '').trim().toLowerCase()
}

// Fetch public TikTok Live status via HTTP as secondary check
async function checkTikTokLiveHTTP(username: string) {
  try {
    const res = await fetch(`https://www.tiktok.com/@${username}/live`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'th-TH,th;q=0.9'
      },
      next: { revalidate: 3 }
    })
    const html = await res.text()
    // Check if page contains live indicators
    const isLive = html.includes('room_id') || html.includes('"status":2') || html.includes('liveRoom') || html.includes('webapp.live-detail')
    const matchRoomId = html.match(/"roomId":"(\d+)"/) || html.match(/room_id=(\d+)/)
    const roomId = matchRoomId ? matchRoomId[1] : null

    return {
      isLive: Boolean(isLive && roomId),
      roomId: roomId
    }
  } catch (e) {
    return { isLive: false, roomId: null }
  }
}

// Connect to TikTok Live stream using tiktok-live-connector
async function connectToTikTokLive(username: string) {
  if (connections.has(username)) {
    return connections.get(username)
  }

  try {
    // Safe dynamic loader to prevent Webpack build-time bundling issues with .proto files
    let WebcastPushConnection = null
    try {
      // @ts-ignore
      const tiktokModule = typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__('tiktok-live-connector') : eval('require')('tiktok-live-connector')
      WebcastPushConnection = tiktokModule?.WebcastPushConnection || tiktokModule
    } catch (e) {
      console.warn('[TikTok Live] Connector dynamic load warning:', e)
    }

    if (!WebcastPushConnection) {
      throw new Error('tiktok-live-connector module could not be loaded at runtime')
    }
    const tiktokLiveConnection = new WebcastPushConnection(username, {
      processInitialData: false,
      enableExtendedGiftInfo: true,
      requestPollingIntervalMs: 1200,
      clientParams: {
        app_language: 'th-TH',
        webcast_language: 'th'
      }
    })

    const state = await tiktokLiveConnection.connect()
    console.log(`[TikTok Live] Successfully connected to room: ${state.roomId} for user: @${username}`)

    // Update Room Info
    roomInfoMap.set(username, {
      isLive: true,
      roomId: state.roomId,
      title: state.roomInfo?.title || `ไลฟ์สดของ @${username}`,
      viewerCount: state.roomInfo?.user_count || 1,
      likeCount: 0,
      connectedAt: new Date().toISOString(),
      statusText: 'กำลังถ่ายทอดสด (LIVE)'
    })

    // Initialize queue for this user
    if (!eventsQueue.has(username)) {
      eventsQueue.set(username, [])
    }

    // 1. Listen for Chat Comments
    tiktokLiveConnection.on('chat', (data: any) => {
      const q = eventsQueue.get(username) || []
      const eventItem = {
        id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        uniqueId: data.uniqueId,
        nickname: data.nickname || data.uniqueId,
        comment: data.comment,
        type: 'comment',
        timestamp: Date.now()
      }
      q.push(eventItem)
      if (q.length > 50) q.shift()
      eventsQueue.set(username, q)
    })

    // 2. Listen for Gifts
    tiktokLiveConnection.on('gift', (data: any) => {
      if (data.giftType === 1 && !data.repeatEnd) return
      const q = eventsQueue.get(username) || []
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
      q.push(eventItem)
      if (q.length > 50) q.shift()
      eventsQueue.set(username, q)
    })

    // 3. Listen for Viewer Count & Likes
    tiktokLiveConnection.on('roomUser', (data: any) => {
      const curr = roomInfoMap.get(username) || {}
      roomInfoMap.set(username, {
        ...curr,
        viewerCount: data.viewerCount || curr.viewerCount || 1
      })
    })

    tiktokLiveConnection.on('like', (data: any) => {
      const curr = roomInfoMap.get(username) || {}
      roomInfoMap.set(username, {
        ...curr,
        likeCount: data.totalLikeCount || curr.likeCount || 0
      })
    })

    // 4. Handle Disconnect & Stream End
    tiktokLiveConnection.on('disconnected', () => {
      console.log(`[TikTok Live] Disconnected from @${username}`)
      connections.delete(username)
      const curr = roomInfoMap.get(username) || {}
      roomInfoMap.set(username, { ...curr, isLive: false, statusText: 'ตัดการเชื่อมต่อ' })
    })

    tiktokLiveConnection.on('streamEnd', () => {
      console.log(`[TikTok Live] Stream ended for @${username}`)
      connections.delete(username)
      roomInfoMap.set(username, {
        isLive: false,
        roomId: null,
        statusText: 'ไลฟ์สดจบลงแล้ว (Offline)'
      })
    })

    connections.set(username, tiktokLiveConnection)
    return tiktokLiveConnection
  } catch (err: any) {
    console.log(`[TikTok Live] Connection attempt for @${username}:`, err.message || err)
    
    // Check if user is offline
    roomInfoMap.set(username, {
      isLive: false,
      roomId: null,
      title: null,
      viewerCount: 0,
      likeCount: 0,
      statusText: 'ออฟไลน์ (ยังไม่ได้เปิดไลฟ์สด)',
      error: err.message || 'User is offline'
    })
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawUsername = searchParams.get('username') || searchParams.get('user') || ''
  const username = formatUsername(rawUsername)
  const action = searchParams.get('action') // 'connect' | 'disconnect' | 'status'

  if (!username) {
    return NextResponse.json({ success: false, message: 'กรุณาระบุ TikTok Username' }, { status: 400 })
  }

  // Handle Disconnect action
  if (action === 'disconnect') {
    const conn = connections.get(username)
    if (conn) {
      try { conn.disconnect() } catch (e) {}
      connections.delete(username)
    }
    eventsQueue.delete(username)
    roomInfoMap.set(username, { isLive: false, roomId: null, statusText: 'ออฟไลน์ (ตัดการเชื่อมต่อแล้ว)' })
    return NextResponse.json({ success: true, message: `ตัดการเชื่อมต่อกับ @${username} เรียบร้อยแล้ว`, isLive: false })
  }

  // Connect or Check Live Status
  let isConnected = connections.has(username)
  if (!isConnected) {
    const conn = await connectToTikTokLive(username)
    isConnected = Boolean(conn)
  }

  // Retrieve current room info
  const roomData = roomInfoMap.get(username) || {
    isLive: isConnected,
    roomId: null,
    statusText: isConnected ? 'กำลังเชื่อมต่อห้องไลฟ์สด' : 'ออฟไลน์ (ยังไม่เริ่มไลฟ์)'
  }

  // Get pending events from queue for this username
  const queue = eventsQueue.get(username) || []
  const newEvents = [...queue]
  eventsQueue.set(username, [])

  return NextResponse.json({
    success: true,
    connected: isConnected,
    isLive: Boolean(roomData.isLive),
    username: `@${username}`,
    room: {
      roomId: roomData.roomId || null,
      title: roomData.title || null,
      viewerCount: roomData.viewerCount || 0,
      likeCount: roomData.likeCount || 0,
      statusText: roomData.statusText || (roomData.isLive ? 'กำลังถ่ายทอดสด (LIVE)' : 'ออฟไลน์ (Offline)')
    },
    eventsCount: newEvents.length,
    events: newEvents,
    timestamp: Date.now()
  })
}

// POST endpoint for manual testing & injecting simulated comments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rawUsername = body.username || 'amth'
    const username = formatUsername(rawUsername)
    const { comment, nickname, type, giftName, count } = body

    if (!comment) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุข้อความคอมเมนต์' }, { status: 400 })
    }

    if (!eventsQueue.has(username)) {
      eventsQueue.set(username, [])
    }

    const q = eventsQueue.get(username) || []
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
    q.push(newEvent)
    eventsQueue.set(username, q)

    return NextResponse.json({
      success: true,
      message: 'ส่งคอมเมนต์ทดสอบเข้าสู่คิวอ่านเสียงเรียบร้อยแล้ว',
      event: newEvent
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
