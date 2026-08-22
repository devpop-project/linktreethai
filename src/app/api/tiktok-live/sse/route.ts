import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Helper to resolve TikTok target (Room ID, Username, sec_user_id, user_id)
async function resolveTikTokTarget(rawInput: string): Promise<{ username: string; roomId: string | null; secUserId: string | null; userId: string | null; displayName: string }> {
  let cleaned = rawInput.trim()

  // 1. Direct numeric room id (15-22 digits)
  if (/^\d{15,22}$/.test(cleaned)) {
    return { username: cleaned, roomId: cleaned, secUserId: null, userId: null, displayName: `Room ${cleaned}` }
  }

  // 2. Direct TikTok URL (including full share links with parameters)
  if (cleaned.includes('tiktok.com')) {
    try {
      let finalUrl = cleaned
      if (cleaned.includes('vt.tiktok.com')) {
        const res = await fetch(cleaned, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        })
        finalUrl = res.url || cleaned
      }

      // Check for room_id in URL query or path
      const matchRoom = finalUrl.match(/room_id=(\d{15,22})/) || finalUrl.match(/\/live\/(\d{15,22})/)
      const roomId = matchRoom ? matchRoom[1] : null

      // Check for username in URL
      const matchUser = finalUrl.match(/@([a-zA-Z0-9_.-]+)/)
      const username = matchUser ? matchUser[1].toLowerCase() : ''

      // Check for sec_user_id and user_id in URL params
      const matchSecUser = finalUrl.match(/sec_user_id=([^&]+)/)
      const secUserId = matchSecUser ? decodeURIComponent(matchSecUser[1]) : null

      const matchUserId = finalUrl.match(/user_id=(\d{15,22})/) || finalUrl.match(/share_from_user_id=(\d{15,22})/)
      const userId = matchUserId ? matchUserId[1] : null

      const resolvedName = username || (roomId ? `Room ${roomId}` : 'streamer')
      return {
        username: resolvedName,
        roomId,
        secUserId,
        userId,
        displayName: username ? `@${username}` : (roomId ? `Room ${roomId}` : 'TikTok Live')
      }
    } catch (e) {}
  }

  // 3. Plain username (@amanitathailand)
  const username = cleaned.replace('@', '').trim().toLowerCase()
  return { username, roomId: null, secUserId: null, userId: null, displayName: `@${username}` }
}

// Multi-endpoint Room ID Resolver using username, sec_user_id and user_id with official aid=1988
async function fetchRoomIdFromTikTokAPI(username: string, secUserId?: string | null, userId?: string | null): Promise<string | null> {
  // If input is directly an 18-20 digit Room ID
  if (/^\d{17,22}$/.test(username)) return username

  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/html, */*',
    'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
    'Referer': `https://www.tiktok.com/@${username}/live`,
    'Origin': 'https://www.tiktok.com',
    'Cache-Control': 'no-cache'
  }

  // Known fallback IDs for Amanita Thailand if username matches
  const resolvedUserId = userId || (username.includes('amanita') ? '7351139655784858625' : null)
  const resolvedSecUserId = secUserId || (username.includes('amanita') ? 'MS4wLjABAAAAfQk47-Uqfad40Y6QTYdBjrN9nY98oBSNw_M4TZDFNB5xzkC7Ys1esLB3MQQ788ZP' : null)

  // Strategy 1: Webcast Room Info with aid=1988 and sec_user_id / user_id
  if (secUserId || userId) {
    try {
      const url = `https://webcast.tiktok.com/webcast/room/info_by_user/?aid=1988&app_name=tiktok_web&device_platform=web&${secUserId ? `sec_user_id=${encodeURIComponent(secUserId)}` : ''}${userId ? `&user_id=${userId}` : ''}`
      const res = await fetch(url, { headers: browserHeaders, next: { revalidate: 2 } })
      const json = await res.json()
      if (json?.data?.room_id || json?.data?.id_str || json?.data?.roomId || json?.data?.liveRoom?.roomId) {
        const rid = String(json.data.room_id || json.data.id_str || json.data.roomId || json.data.liveRoom?.roomId)
        console.log(`[TikTok SSE] Resolved roomId via Webcast user_id for @${username}: ${rid}`)
        return rid
      }
    } catch (e) {}
  }

  // Strategy 2: TikTok API-Live user room with aid=1988
  try {
    const query = secUserId ? `sec_user_id=${encodeURIComponent(secUserId)}&aid=1988&app_name=tiktok_web&sourceType=54` : `uniqueId=${encodeURIComponent(username)}&aid=1988&app_name=tiktok_web&sourceType=54`
    const res = await fetch(`https://www.tiktok.com/api-live/user/room/?${query}`, {
      headers: browserHeaders,
      next: { revalidate: 2 }
    })
    const json = await res.json()
    if (json?.data?.liveRoom?.roomId || json?.data?.roomId) {
      const rid = String(json.data.liveRoom?.roomId || json.data.roomId)
      console.log(`[TikTok SSE] Resolved roomId via API-Live for @${username}: ${rid}`)
      return rid
    }
  } catch (e) {}

  // Strategy 3: Webcast Room Info by unique_id
  try {
    const res = await fetch(`https://webcast.tiktok.com/webcast/room/info_by_user/?unique_id=${encodeURIComponent(username)}`, {
      headers: browserHeaders,
      next: { revalidate: 2 }
    })
    const json = await res.json()
    if (json?.data?.room_id || json?.data?.id_str) {
      const rid = String(json.data.room_id || json.data.id_str)
      console.log(`[TikTok SSE] Resolved roomId via Webcast unique_id for @${username}: ${rid}`)
      return rid
    }
  } catch (e) {}

  // Strategy 4: Scrape HTML with realistic headers
  try {
    const res = await fetch(`https://www.tiktok.com/@${username}/live`, {
      headers: browserHeaders,
      next: { revalidate: 2 }
    })
    const html = await res.text()
    const match = html.match(/"roomId":"(\d{16,22})"/) || html.match(/"liveRoomId":"(\d{16,22})"/) || html.match(/room_id=(\d{16,22})/)
    if (match && match[1]) {
      console.log(`[TikTok SSE] Resolved roomId via HTML regex for @${username}: ${match[1]}`)
      return match[1]
    }
  } catch (e) {}

  return null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawInput = searchParams.get('username') || searchParams.get('user') || ''
  const explicitRoomId = searchParams.get('room_id') || null
  const sessionId = searchParams.get('session_id') || undefined
  
  const { username, roomId: parsedRoomId, secUserId, userId, displayName } = await resolveTikTokTarget(rawInput)

  if (!username) {
    return new Response('Missing username parameter', { status: 400 })
  }

  let isClosed = false
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendSSE = (eventName: string, data: any) => {
        if (isClosed) return
        try {
          const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(payload))
        } catch (e) {}
      }

      sendSSE('status', {
        status: 'CONNECTING',
        isLive: false,
        username: displayName,
        message: `กำลังค้นหาและเชื่อมต่อไปยังห้องไลฟ์สด ${displayName}...`
      })

      let tiktokLiveConnection: any = null

      try {
        let WebcastPushConnection = null
        try {
          // @ts-ignore
          const tiktokModule = typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__('tiktok-live-connector') : eval('require')('tiktok-live-connector')
          WebcastPushConnection = tiktokModule?.WebcastPushConnection || tiktokModule
        } catch (e) {
          console.warn('[TikTok SSE] Module load error:', e)
        }

        if (!WebcastPushConnection) {
          sendSSE('status', {
            status: 'ERROR',
            isLive: false,
            message: 'กรุณารันคำสั่ง npm install tiktok-live-connector ในเทอร์มินัล'
          })
          return
        }

        // Try to resolve Room ID using full credentials
        const finalRoomId = explicitRoomId || parsedRoomId || await fetchRoomIdFromTikTokAPI(username, secUserId, userId)
        const connectTarget = finalRoomId || username

        const clientOptions: any = {
          processInitialData: false,
          enableExtendedGiftInfo: true,
          requestPollingIntervalMs: 1000,
          clientParams: {
            app_language: 'th-TH',
            webcast_language: 'th-TH',
            aid: '1988',
            app_name: 'tiktok_web',
            device_platform: 'web'
          }
        }

        if (sessionId && sessionId.trim() !== '') {
          clientOptions.sessionId = sessionId.trim()
        }

        if (finalRoomId) {
          clientOptions.isRoomId = true
        }

        tiktokLiveConnection = new WebcastPushConnection(connectTarget, clientOptions)

        let state: any
        if (finalRoomId) {
          state = await tiktokLiveConnection.connect(finalRoomId)
        } else {
          state = await tiktokLiveConnection.connect()
        }

        const actualRoomId = state?.roomId || finalRoomId || 'CONNECTED'
        console.log(`[TikTok SSE] Successfully connected! Room ID: ${actualRoomId} for target: ${displayName}`)

        sendSSE('status', {
          status: 'LIVE',
          isLive: true,
          username: displayName,
          roomId: actualRoomId,
          title: state.roomInfo?.title || `ไลฟ์สดของ ${displayName}`,
          viewerCount: state.roomInfo?.user_count || 1,
          message: 'เชื่อมต่อห้องไลฟ์สดสำเร็จ พร้อมอ่านคอมเมนต์สดภาษาไทย'
        })

        // 1. Chat Event Listener
        tiktokLiveConnection.on('chat', (data: any) => {
          console.log(`[TikTok SSE Chat ${displayName}]`, data.nickname, data.comment)
          sendSSE('chat', {
            id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            uniqueId: data.uniqueId,
            nickname: data.nickname || data.uniqueId,
            comment: data.comment,
            type: 'comment',
            timestamp: Date.now()
          })
        })

        // 2. Gift Event Listener
        tiktokLiveConnection.on('gift', (data: any) => {
          if (data.giftType === 1 && !data.repeatEnd) return
          sendSSE('gift', {
            id: 'gift_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            uniqueId: data.uniqueId,
            nickname: data.nickname || data.uniqueId,
            comment: `ส่งของขวัญ ${data.giftName} จำนวน ${data.repeatCount || data.diamondCount || 1} ชิ้น`,
            type: 'gift',
            giftName: data.giftName,
            count: data.repeatCount || data.diamondCount || 1,
            timestamp: Date.now()
          })
        })

        // 3. Room info update listeners
        tiktokLiveConnection.on('roomUser', (data: any) => {
          sendSSE('roomUser', { viewerCount: data.viewerCount || 1 })
        })

        tiktokLiveConnection.on('like', (data: any) => {
          sendSSE('like', { likeCount: data.totalLikeCount || 0 })
        })

        tiktokLiveConnection.on('disconnected', () => {
          sendSSE('status', {
            status: 'DISCONNECTED',
            isLive: false,
            message: 'ตัดการเชื่อมต่อกับห้องไลฟ์สดแล้ว'
          })
        })

        tiktokLiveConnection.on('streamEnd', () => {
          sendSSE('status', {
            status: 'OFFLINE',
            isLive: false,
            message: 'การถ่ายทอดสดจบลงแล้ว (Stream Ended)'
          })
        })

      } catch (err: any) {
        console.error(`[TikTok SSE Error for ${displayName}]:`, err.message || err)
        sendSSE('status', {
          status: 'OFFLINE',
          isLive: false,
          username: displayName,
          error: err.message,
          message: 'ยังไม่พบสัญญาณการเปิดไลฟ์สดในบัญชีนี้ หรือเซิร์ฟเวอร์ TikTok กำลังรอสัญญาณสด'
        })
      }
    },
    cancel() {
      isClosed = true
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  })
}
