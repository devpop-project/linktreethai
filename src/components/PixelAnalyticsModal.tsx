'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  X, Activity, CheckCircle, AlertCircle, TrendingUp, 
  ShoppingBag, Eye, Users, RefreshCw, Sparkles, ExternalLink, ShieldCheck, Flame, Rocket, Globe
} from 'lucide-react'

interface PixelAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  profile: any
  landingPages?: any[]
}

export default function PixelAnalyticsModal({
  isOpen,
  onClose,
  profile,
  landingPages = [],
}: PixelAnalyticsModalProps) {
  const [loading, setLoading] = useState(true)
  const [allEvents, setAllEvents] = useState<any[]>([])
  
  // Selected Scope: 'all' | 'bio' | landing_page_id
  const [selectedScope, setSelectedScope] = useState<string>('all')

  const supabase = createClient()

  useEffect(() => {
    if (isOpen && profile?.id) {
      loadPixelStats()
    }
  }, [isOpen, profile?.id])

  const loadPixelStats = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pixel_events')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(200)

      if (!error && data) {
        setAllEvents(data)
      }
    } catch (e) {}
    setLoading(false)
  }

  if (!isOpen) return null

  // 1. Resolve selected landing page object if selected
  const selectedLp = landingPages.find(p => p.id === selectedScope)

  // 2. Resolve Active Pixel IDs for the selected Scope
  let currentFb = profile?.fb_pixel_id
  let currentTt = profile?.tiktok_pixel_id
  let currentGoogle = profile?.google_pixel_id
  let currentLine = profile?.line_tag_id
  let isCustomLpPixel = false

  if (selectedLp) {
    currentFb = selectedLp.fb_pixel_id || profile?.fb_pixel_id
    currentTt = selectedLp.tiktok_pixel_id || profile?.tiktok_pixel_id
    currentGoogle = selectedLp.google_pixel_id || profile?.google_pixel_id
    currentLine = selectedLp.line_tag_id || profile?.line_tag_id
    isCustomLpPixel = Boolean(selectedLp.fb_pixel_id || selectedLp.tiktok_pixel_id || selectedLp.google_pixel_id || selectedLp.line_tag_id)
  }

  // 3. Filter Events based on Selected Scope
  const filteredEvents = allEvents.filter(ev => {
    if (selectedScope === 'all') return true
    if (selectedScope === 'bio') {
      return !ev.landing_page_id || ev.url?.includes(`/${profile?.username}`)
    }
    return ev.landing_page_id === selectedScope || (selectedLp?.slug && ev.url?.includes(`/p/${selectedLp.slug}`))
  })

  // 4. Compute Metrics for Filtered Events
  const pv = filteredEvents.filter(e => e.event_name === 'PageView').length
  const co = filteredEvents.filter(e => e.event_name === 'InitiateCheckout').length
  const pu = filteredEvents.filter(e => e.event_name === 'Purchase' || e.event_name === 'Lead').length
  const totalViews = Math.max(pv, 1)
  const cvRate = ((pu / totalViews) * 100).toFixed(1) + '%'

  // 5. Evaluate Live Status per Pixel for the current view
  const pixels = [
    {
      name: 'Facebook Pixel (Meta)',
      id: currentFb,
      color: '#1877F2',
      badge: 'Meta Ads',
      active: Boolean(currentFb && currentFb.trim().length >= 8),
      isOverride: Boolean(selectedLp && selectedLp.fb_pixel_id),
      events: ['PageView', 'InitiateCheckout', 'Purchase', 'Lead'],
      hint: 'ใช้ยิงแอด Conversion บน Facebook & Instagram'
    },
    {
      name: 'TikTok Pixel',
      id: currentTt,
      color: '#FE2C55',
      badge: 'TikTok Ads',
      active: Boolean(currentTt && currentTt.trim().length >= 6),
      isOverride: Boolean(selectedLp && selectedLp.tiktok_pixel_id),
      events: ['PageView', 'InitiateCheckout', 'PlaceAnOrder', 'SubmitForm'],
      hint: 'ใช้ยิงแอดบน TikTok Feed & TikTok Shop'
    },
    {
      name: 'Google Tag / GA4',
      id: currentGoogle,
      color: '#F59E0B',
      badge: 'Google Ads / GA4',
      active: Boolean(currentGoogle && currentGoogle.trim().length >= 4),
      isOverride: Boolean(selectedLp && selectedLp.google_pixel_id),
      events: ['page_view', 'begin_checkout', 'purchase'],
      hint: 'วัดผล Google Ads Search, Display & Performance Max'
    },
    {
      name: 'LINE Tag (LAP)',
      id: currentLine,
      color: '#06C755',
      badge: 'LINE Ads',
      active: Boolean(currentLine && currentLine.trim().length >= 4),
      isOverride: Boolean(selectedLp && selectedLp.line_tag_id),
      events: ['pv (PageView)', 'cv (Conversion)'],
      hint: 'ใช้ยิงแอดบน LINE Ads Platform (LAP)'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[36px] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-black shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#1E1B4B] dark:text-white flex items-center gap-2">
                <span>ศูนย์ตรวจสอบสถานะ Pixel & สถิติคอนเวอร์ชัน</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  ● Live Health
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">ตรวจสอบสถานะการทำงานจริง สถิติ PageViews, Checkouts และสถิติแยกตาม Pixel ID</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadPixelStats}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
              title="รีเฟรชสถิติ"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ========================================================================= */}
          {/* MULTI-PAGE & PIXEL SELECTOR DROPDOWN (เลือกดู Pixel และสถิติแยกรายหน้า) */}
          {/* ========================================================================= */}
          <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/50 rounded-2xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-black text-[#1E1B4B] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>เลือกดูสถิติและสถานะ Pixel ของหน้า:</span>
              </label>

              {selectedLp && (
                <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                  URL: /p/{selectedLp.slug} {isCustomLpPixel ? '(🎯 มี Pixel เฉพาะสินค้า)' : '(🌐 ใช้ Pixel หลัก)'}
                </span>
              )}
            </div>

            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold text-[#1E1B4B] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 shadow-sm"
            >
              <option value="all">🌐 ภาพรวมทั้งหมด (Global Bio Link + ทุกหน้าเซลเพจ)</option>
              <option value="bio">🔗 หน้า Bio Link หลัก (@{profile?.username})</option>
              {landingPages.map((lp) => (
                <option key={lp.id} value={lp.id}>
                  🚀 เซลเพจ: {lp.title} (/p/{lp.slug}) {lp.fb_pixel_id ? `— [FB Pixel: ${lp.fb_pixel_id}]` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 1. Quick Metrics Funnel for Selected Scope */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>PageViews</span>
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#1E1B4B] dark:text-white font-mono">{pv}</p>
              <span className="text-[10px] text-slate-400">จำนวนการเปิดชมหน้าเว็บ</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                <span>InitiateCheckout</span>
              </span>
              <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{co}</p>
              <span className="text-[10px] text-slate-400">จำนวนคนกดสั่งซื้อ/แอด</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Purchases / Leads</span>
              </span>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{pu}</p>
              <span className="text-[10px] text-slate-400">สั่งซื้อสำเร็จ / กรอกฟอร์ม</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                <span>Conversion Rate</span>
              </span>
              <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">{cvRate}</p>
              <span className="text-[10px] text-slate-400">อัตราการปิดการขาย</span>
            </div>
          </div>

          {/* 2. Pixel Health Monitor Cards (4 Platforms) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-[#1E1B4B] dark:text-slate-300 uppercase tracking-wider">
                สถานะการทำงานของ Pixel สำหรับหน้านี้
              </h4>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                {selectedScope === 'all' ? 'แสดง Pixel หลักของบัญชี' : `กำลังแสดง Pixel ของ: ${selectedLp?.title || 'Bio Link'}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pixels.map((px) => (
                <div
                  key={px.name}
                  className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: px.color }}></span>
                      <h5 className="font-extrabold text-xs text-[#1E1B4B] dark:text-white">{px.name}</h5>
                    </div>

                    <div className="flex items-center gap-1">
                      {px.isOverride && (
                        <span className="text-[9px] bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-bold">
                          เฉพาะสินค้า
                        </span>
                      )}

                      {px.active ? (
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          <span>กำลังทำงาน</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                          ยังไม่เปิดใช้
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800 truncate">
                    ID: {px.id ? px.id : 'ยังไม่ได้ระบุ Pixel ID'}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <p className="line-clamp-1">{px.hint}</p>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                      <span className="text-[10px] font-bold text-slate-400">Events:</span>
                      {px.events.map(ev => (
                        <span key={ev} className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Recent Real-time Pixel Activity Logs for Selected Scope */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-[#1E1B4B] dark:text-slate-300 uppercase tracking-wider">
                ประวัติการจับสัญญาณ Pixel ล่าสุด ({filteredEvents.length})
              </h4>
              <span className="text-[10px] text-slate-400">อัปเดตเรียลไทม์อัตโนมัติ</span>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                ยังไม่มีข้อมูล Event สำหรับหน้านี้ เมื่อมีคนเปิดหน้าเว็บหรือกดสั่งซื้อ ข้อมูลจะปรากฏที่นี่ทันที
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto text-xs">
                {filteredEvents.map((ev) => (
                  <div key={ev.id} className="p-3 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-900/60 transition">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                          ev.event_name === 'Purchase' ? 'bg-emerald-500 text-slate-950' :
                          ev.event_name === 'InitiateCheckout' ? 'bg-amber-500 text-slate-950' :
                          ev.event_name === 'PageView' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {ev.event_name}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 font-bold truncate max-w-xs">{ev.url || '/'}</span>
                      </div>
                      {ev.event_data?.value && (
                        <p className="text-[10px] text-emerald-600 font-mono">มูลค่า: ฿{ev.event_data.value}</p>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                      {new Date(ev.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">เลือกดู Pixel และสถิติแยกตามสินค้าหรือดูภาพรวมทั้งบัญชีได้ตลอดเวลา</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1E1B4B] dark:bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition shadow"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  )
}
