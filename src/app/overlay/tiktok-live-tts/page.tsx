'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Volume2, VolumeX, Sparkles, Radio, MessageSquare, Gift, Heart, Send, Settings, CheckCircle2 } from 'lucide-react'

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
  const readGifts = searchParams.get('read_gifts') !== 'false'
  const filterProfanity = searchParams.get('filter') !== 'false'

  const [connected, setConnected] = useState(false)
  const [comments, setComments] = useState<CommentItem[]>([])
  const [speakingText, setSpeakingText] = useState<string | null>(null)
  const [audioUnlocked, setAudioUnlocked] = useState(true)
  const [customCommentInput, setCustomCommentInput] = useState('')
  const [showControls, setShowControls] = useState(false)

  const queueRef = useRef<CommentItem[]>([])
  const isSpeakingRef = useRef(false)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  // 1. Filter Bad Words
  const cleanComment = (text: string) => {
    if (!filterProfanity) return text
    const badWords = ['ควย', 'เย็ด', 'เหี้ย', 'สัส', 'มึง', 'กู', 'ไอ้เวร']
    let cleaned = text
    badWords.forEach(w => {
      cleaned = cleaned.split(w).join('***')
    })
    return cleaned
  }

  // 2. Play Audio via Web Speech API or Fallback Audio
  const speakText = (text: string, onEnd: () => void) => {
    if (typeof window === 'undefined') {
      onEnd()
      return
    }

    // Try Web Speech API
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'th-TH'
        utterance.rate = Math.max(0.5, Math.min(2.0, speed))
        utterance.pitch = Math.max(0.5, Math.min(1.5, pitch))
        utterance.volume = Math.max(0.1, Math.min(1.0, volume))

        const voices = window.speechSynthesis.getVoices()
        const thaiVoice = voices.find(v => v.lang.includes('th') || v.lang.includes('TH'))
        if (thaiVoice) utterance.voice = thaiVoice

        utterance.onend = () => onEnd()
        utterance.onerror = () => {
          // Fallback to Google TTS audio
          playFallbackAudio(text, onEnd)
        }

        window.speechSynthesis.speak(utterance)
        return
      } catch (e) {
        playFallbackAudio(text, onEnd)
      }
    } else {
      playFallbackAudio(text, onEnd)
    }
  }

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
      audioPlayerRef.current.play().catch(() => onEnd())
    } catch (e) {
      onEnd()
    }
  }

  // 3. Queue Processor
  const processNextInQueue = () => {
    if (queueRef.current.length === 0 || isSpeakingRef.current) return

    const item = queueRef.current.shift()
    if (!item) return

    isSpeakingRef.current = true

    let speechLine = ''
    if (item.type === 'gift') {
      speechLine = `ขอบคุณคุณ ${item.nickname} สำหรับ ${item.giftName || 'ของขวัญ'} ${item.count || 1} ชิ้นครับ`
    } else {
      speechLine = `${item.nickname} พูดว่า ${cleanComment(item.comment)}`
    }

    setSpeakingText(speechLine)

    speakText(speechLine, () => {
      isSpeakingRef.current = false
      setSpeakingText(null)
      setTimeout(processNextInQueue, 250)
    })
  }

  // 4. Add Comment / Event to Stream
  const handleIncomingEvent = (item: CommentItem) => {
    setComments(prev => [item, ...prev.slice(0, 5)])
    queueRef.current.push(item)
    processNextInQueue()
  }

  // 5. Connect and Poll or Simulate Live Stream
  useEffect(() => {
    setConnected(true)

    // Initial greeting announcement
    setTimeout(() => {
      handleIncomingEvent({
        id: 'init-1',
        uniqueId: 'system',
        nickname: 'ระบบไลฟ์สด',
        comment: `เชื่อมต่อห้องไลฟ์สด @${username} สำเร็จแล้วค่ะ พร้อมอ่านคอมเมนต์สด`,
        type: 'comment',
        timestamp: Date.now()
      })
    }, 1000)

    // Polling Live Event Stream API every 7-10 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tiktok-live?username=${encodeURIComponent(username)}`)
        const data = await res.json()
        if (data && data.success && data.event) {
          handleIncomingEvent({
            id: data.event.id,
            uniqueId: 'live_user_' + Math.random().toString(36).substring(2, 6),
            nickname: data.event.nickname,
            comment: data.event.comment,
            type: data.event.type || 'comment',
            giftName: data.event.giftName,
            count: data.event.count,
            timestamp: Date.now()
          })
        }
      } catch (e) {}
    }, 8500)

    return () => clearInterval(interval)
  }, [username])

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* Top Floating Status & Speaker Wave Visualizer */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-slate-950/85 border border-pink-500/50 backdrop-blur-xl shadow-2xl flex items-center gap-2 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
            <Radio className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-black font-mono">TIKTOK LIVE: @{username}</span>
          </div>

          {speakingText && (
            <div className="px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 backdrop-blur-xl shadow-xl flex items-center gap-2 animate-bounce">
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-extrabold truncate max-w-xs">{speakingText}</span>
            </div>
          )}
        </div>

        {/* Floating Settings & Test Toggle for Streamer */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-700/60 backdrop-blur-md transition shadow"
          title="ตั้งค่า & ทดสอบส่งคอมเมนต์"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Streamer Quick Control Drawer (Can be hidden during live stream) */}
      {showControls && (
        <div className="fixed top-16 right-4 z-50 bg-slate-950/95 border border-slate-800 p-4 rounded-3xl max-w-xs w-full shadow-2xl text-white space-y-3 backdrop-blur-2xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-purple-400">
              <Sparkles className="w-3.5 h-3.5" /> ทดสอบระบบเสียงใน OBS
            </span>
            <button onClick={() => setShowControls(false)} className="text-xs text-slate-500 hover:text-white font-mono">
              ✕ ปิด
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 block font-bold">พิมพ์คอมเมนต์เพื่อจำลองเสียง:</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="เช่น สินค้าพร้อมส่งมั้ยคะ"
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
                    nickname: 'คนดูทดสอบ',
                    comment: customCommentInput,
                    type: 'comment',
                    timestamp: Date.now()
                  })
                  setCustomCommentInput('')
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shrink-0"
              >
                ส่ง
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['สวัสดีครับ ขอโปรโมชั่นหน่อย', 'ส่งของขวัญ ดอกกุหลาบ 1 ดอก', 'สั่งซื้อใน Bio Link แล้วครับ'].map((txt, i) => (
              <button
                key={i}
                onClick={() => {
                  handleIncomingEvent({
                    id: 'quick-' + Date.now() + i,
                    uniqueId: 'user_' + i,
                    nickname: 'ผู้ชม VIP ' + (i + 1),
                    comment: txt,
                    type: txt.includes('ของขวัญ') ? 'gift' : 'comment',
                    giftName: 'ดอกกุหลาบ',
                    count: 1,
                    timestamp: Date.now()
                  })
                }}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-300 transition"
              >
                + "{txt.substring(0, 15)}..."
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
                  ? 'bg-slate-950/95 border-pink-500/60 ring-2 ring-pink-500/20 scale-102 animate-in slide-in-from-bottom duration-300'
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
