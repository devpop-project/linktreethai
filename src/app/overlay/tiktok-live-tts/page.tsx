'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Volume2, VolumeX, Sparkles, Radio, MessageSquare, Gift, Heart, Send, Settings, CheckCircle2, Play } from 'lucide-react'

interface CommentItem {
  id: string
  uniqueId: string
  nickname: string
  comment: string
  type: 'comment' | 'gift' | 'like'
  giftName?: string
  count?: number
  timestamp: number
}

export default function TikTokLiveTTSOverlay() {
  const searchParams = useSearchParams()
  const rawUser = searchParams.get('username') || searchParams.get('user') || ''
  const username = rawUser.replace('@', '').trim() || 'streamer'
  const speed = parseFloat(searchParams.get('speed') || '1.0')
  const pitch = parseFloat(searchParams.get('pitch') || '1.0')
  const volume = parseFloat(searchParams.get('volume') || '1.0')
  const thaiOnly = searchParams.get('thai_only') !== 'false'

  const formatDisplayHandle = (input: string) => {
    let cleaned = input.trim()
    if (cleaned.includes('tiktok.com')) {
      const m = cleaned.match(/@([a-zA-Z0-9_.-]+)/)
      if (m) return m[1].toLowerCase()
      const mRoom = cleaned.match(/room_id=(\d+)/) || cleaned.match(/\/live\/(\d+)/)
      if (mRoom) return `Room ${mRoom[1].substring(0, 8)}...`
      return 'TikTok Live'
    }
    return cleaned.replace('@', '').trim()
  }

  const displayHandle = formatDisplayHandle(username)
  const filterProfanity = searchParams.get('filter') !== 'false'

  const [connected, setConnected] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [comments, setComments] = useState<CommentItem[]>([])
  const [speakingText, setSpeakingText] = useState<string | null>(null)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [customCommentInput, setCustomCommentInput] = useState('')
  const [showControls, setShowControls] = useState(false)
  const [thaiVoiceFound, setThaiVoiceFound] = useState(false)

  const queueRef = useRef<CommentItem[]>([])
  const isSpeakingRef = useRef(false)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  // 1. Thai Language Filter & Clean Text
  const formatThaiSpeech = (nickname: string, comment: string, type: string, giftName?: string, count?: number): string | null => {
    // If gift
    if (type === 'gift') {
      return `ขอบคุณคุณ ${nickname} สำหรับ ${giftName || 'ของขวัญ'} ${count || 1} ชิ้นครับ`
    }

    // Filter profanity
    let text = comment
    if (filterProfanity) {
      const badWords = ['ควย', 'เย็ด', 'เหี้ย', 'สัส', 'มึง', 'กู', 'ไอ้เวร', 'ห่า', 'ดาก']
      badWords.forEach(w => {
        text = text.split(w).join('')
      })
    }

    text = text.trim()
    if (!text) return null

    // Thai numbers/words conversion
    text = text.replace(/5555+/g, ' ฮ่าๆๆๆ ').replace(/555/g, ' ฮ่าๆ ').replace(/55/g, ' ฮ่าๆ ')
    text = text.replace(/fb/gi, 'เฟซบุ๊ก').replace(/ig/gi, 'ไอจี').replace(/line/gi, 'ไลน์')

    return `${nickname} พูดว่า ${text}`
  }

  // 2. Play Audio via Web Speech API or Fallback Audio
  const speakText = (text: string, onEnd: () => void) => {
    if (typeof window === 'undefined') {
      onEnd()
      return
    }

    // Method 1: Web Speech API (with Thai Voice)
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'th-TH'
        utterance.rate = Math.max(0.6, Math.min(1.8, speed))
        utterance.pitch = Math.max(0.6, Math.min(1.4, pitch))
        utterance.volume = Math.max(0.2, Math.min(1.0, volume))

        const voices = window.speechSynthesis.getVoices()
        const thaiVoice = voices.find(v => v.lang.includes('th') || v.lang.includes('TH') || v.name.includes('Thai') || v.name.includes('Narisa') || v.name.includes('Premwadee'))
        if (thaiVoice) {
          utterance.voice = thaiVoice
        }

        utterance.onend = () => onEnd()
        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error, switching to Fallback Audio:', e)
          playFallbackAudio(text, onEnd)
        }

        window.speechSynthesis.speak(utterance)
        return
      } catch (e) {
        console.warn('SpeechSynthesis exception, using fallback:', e)
        playFallbackAudio(text, onEnd)
      }
    } else {
      playFallbackAudio(text, onEnd)
    }
  }

  // Method 2: Google Thai TTS Audio Stream Fallback (100% Reliable Thai Pronunciation)
  const playFallbackAudio = (text: string, onEnd: () => void) => {
    try {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=${encodeURIComponent(text)}`
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio()
      }
      audioPlayerRef.current.src = audioUrl
      audioPlayerRef.current.volume = volume
      audioPlayerRef.current.onended = () => onEnd()
      audioPlayerRef.current.onerror = () => onEnd()
      audioPlayerRef.current.play().catch((err) => {
        console.warn('Autoplay error:', err)
        onEnd()
      })
    } catch (e) {
      onEnd()
    }
  }

  // 3. Queue Processor
  const processNextInQueue = () => {
    if (queueRef.current.length === 0 || isSpeakingRef.current) return

    const item = queueRef.current.shift()
    if (!item) return

    const speechLine = formatThaiSpeech(item.nickname, item.comment, item.type, item.giftName, item.count)
    if (!speechLine) {
      processNextInQueue()
      return
    }

    isSpeakingRef.current = true
    setSpeakingText(speechLine)

    speakText(speechLine, () => {
      isSpeakingRef.current = false
      setSpeakingText(null)
      setTimeout(processNextInQueue, 200)
    })
  }

  // 4. Add Comment / Event to Stream
  const handleIncomingEvent = (item: CommentItem) => {
    setComments(prev => [item, ...prev.slice(0, 5)])
    queueRef.current.push(item)
    processNextInQueue()
  }

  // 5. Initial Audio Unlocker & Voice Loader
  const unlockAudio = () => {
    setAudioUnlocked(true)
    speakText('ระบบเสียงอ่านภาษาไทยพร้อมทำงานแล้วค่ะ', () => {})
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        const found = voices.some(v => v.lang.includes('th') || v.lang.includes('TH'))
        setThaiVoiceFound(found)
      }
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    // Auto unlock if user interacts
    const handleFirstClick = () => {
      setAudioUnlocked(true)
      window.removeEventListener('click', handleFirstClick)
    }
    window.addEventListener('click', handleFirstClick)

    return () => {
      window.removeEventListener('click', handleFirstClick)
    }
  }, [])

  // 6. Connect Real-time Live Stream via Server-Sent Events (SSE)
  useEffect(() => {
    if (!username) return
    setConnected(true)

    let sse: EventSource | null = null
    try {
      sse = new EventSource(`/api/tiktok-live/sse?username=${encodeURIComponent(username)}`)

      sse.addEventListener('status', (e: any) => {
        try {
          const data = JSON.parse(e.data)
          setIsLive(Boolean(data.isLive || data.status === 'LIVE'))
          if (data.viewerCount) setViewerCount(data.viewerCount)
        } catch (err) {}
      })

      sse.addEventListener('chat', (e: any) => {
        try {
          const data = JSON.parse(e.data)
          handleIncomingEvent({
            id: data.id || 'live_' + Date.now(),
            uniqueId: data.uniqueId || 'viewer',
            nickname: data.nickname || 'คนดูในไลฟ์',
            comment: data.comment || '',
            type: 'comment',
            timestamp: Date.now()
          })
        } catch (err) {}
      })

      sse.addEventListener('gift', (e: any) => {
        try {
          const data = JSON.parse(e.data)
          handleIncomingEvent({
            id: data.id || 'gift_' + Date.now(),
            uniqueId: data.uniqueId || 'viewer',
            nickname: data.nickname || 'คนดูในไลฟ์',
            comment: `ส่งของขวัญ ${data.giftName} ${data.count || 1} ชิ้น`,
            type: 'gift',
            giftName: data.giftName,
            count: data.count,
            timestamp: Date.now()
          })
        } catch (err) {}
      })

      sse.addEventListener('roomUser', (e: any) => {
        try {
          const data = JSON.parse(e.data)
          if (data.viewerCount) setViewerCount(data.viewerCount)
        } catch (err) {}
      })
    } catch (err) {
      console.warn('[Overlay SSE] Connection error:', err)
    }

    return () => {
      if (sse) sse.close()
    }
  }, [username])

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* Audio Unlock Banner (If opened in standard browser without click) */}
      {!audioUnlocked && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full font-black text-xs shadow-2xl flex items-center gap-2 cursor-pointer animate-bounce" onClick={unlockAudio}>
          <Volume2 className="w-4 h-4" />
          <span>แตะที่นี่ 1 ครั้งเพื่อเปิดเสียงพูดภาษาไทย (Click to Enable Audio)</span>
        </div>
      )}

      {/* Top Floating Status & Speaker Wave Visualizer */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className={`px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-xl shadow-2xl flex items-center gap-2 text-white border ${
            isLive ? 'border-emerald-500/80 ring-2 ring-emerald-500/20' : 'border-slate-700/60'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`}></span>
            <Radio className={`w-4 h-4 ${isLive ? 'text-pink-400' : 'text-slate-400'}`} />
            <span className="text-xs font-black font-mono">
              @{displayHandle} {isLive ? `🔴 LIVE (${viewerCount || 1} คนดู)` : '⚪ OFFLINE'}
            </span>
          </div>

          {speakingText && (
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 backdrop-blur-xl shadow-2xl flex items-center gap-2 animate-bounce">
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-extrabold truncate max-w-xs">{speakingText}</span>
            </div>
          )}
        </div>

        {/* Floating Settings & Test Toggle for Streamer */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-700/60 backdrop-blur-md transition shadow cursor-pointer"
          title="ตั้งค่า & ทดสอบส่งคอมเมนต์"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Streamer Quick Control Drawer */}
      {showControls && (
        <div className="fixed top-16 right-4 z-50 bg-slate-950/95 border border-slate-800 p-4 rounded-3xl max-w-xs w-full shadow-2xl text-white space-y-3 backdrop-blur-2xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-purple-400">
              <Sparkles className="w-3.5 h-3.5" /> ทดสอบระบบเสียงภาษาไทย
            </span>
            <button onClick={() => setShowControls(false)} className="text-xs text-slate-500 hover:text-white font-mono cursor-pointer">
              ✕ ปิด
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 block font-bold">พิมพ์คอมเมนต์ภาษาไทยเพื่อทดสอบ:</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="เช่น สวัสดีครับ มีสินค้ามั้ย"
                value={customCommentInput}
                onChange={(e) => setCustomCommentInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => {
                  if (!customCommentInput) return
                  handleIncomingEvent({
                    id: 'custom-' + Date.now(),
                    uniqueId: 'tester',
                    nickname: 'คนดูในไลฟ์',
                    comment: customCommentInput,
                    type: 'comment',
                    timestamp: Date.now()
                  })
                  setCustomCommentInput('')
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
              >
                ส่ง
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['สวัสดีครับ', 'สวัสดีค่ะ สอบถามสินค้าหน่อย', 'ส่งของขวัญ ดอกกุหลาบ 1 ดอก'].map((txt, i) => (
              <button
                key={i}
                onClick={() => {
                  handleIncomingEvent({
                    id: 'quick-' + Date.now() + i,
                    uniqueId: 'user_' + i,
                    nickname: 'ผู้ชมในไลฟ์',
                    comment: txt,
                    type: txt.includes('ของขวัญ') ? 'gift' : 'comment',
                    giftName: 'ดอกกุหลาบ',
                    count: 1,
                    timestamp: Date.now()
                  })
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-300 transition cursor-pointer"
              >
                + "{txt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Floating Animated Comments Stack for OBS Stream Display */}
      <div className="space-y-3 max-w-md w-full pb-2">
        {comments.map((c, index) => {
          const isLatest = index === 0
          return (
            <div
              key={c.id}
              className={`border rounded-3xl p-3.5 shadow-2xl backdrop-blur-2xl flex items-start gap-3 transition-all duration-300 ${
                isLatest
                  ? 'bg-slate-950/95 border-pink-500/70 ring-2 ring-pink-500/20 scale-102 animate-in slide-in-from-bottom duration-300'
                  : 'bg-slate-950/80 border-slate-800/80 opacity-85'
              }`}
            >
              {/* User Avatar with Color Gradient */}
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg ${
                c.type === 'gift' 
                  ? 'bg-gradient-to-tr from-amber-400 via-pink-500 to-rose-500 ring-2 ring-amber-400/50' 
                  : 'bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500'
              }`}>
                {c.type === 'gift' ? <Gift className="w-5 h-5" /> : c.nickname.charAt(0)}
              </div>

              {/* Comment Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs font-black text-pink-300 truncate">@{c.nickname}</span>
                    {c.type === 'gift' ? (
                      <span className="text-[9px] font-black bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 px-2 py-0.2 rounded-full shadow font-mono">
                        🎁 GIFT x{c.count || 1}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-purple-500/20 text-purple-200 border border-purple-500/30 px-1.5 py-0.2 rounded font-mono">
                        LIVE
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">สด</span>
                </div>

                <p className="text-xs sm:text-sm text-white font-bold leading-snug mt-1 break-words">
                  {c.comment}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
