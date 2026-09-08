"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ShieldCheck, X, Sliders, Lock, ExternalLink } from "lucide-react"

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: string
}

const STORAGE_KEY = "linktreethai_cookie_consent"

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(true)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        const timer = setTimeout(() => setShowBanner(true), 1200)
        return () => clearTimeout(timer)
      } else {
        const parsed: CookiePreferences = JSON.parse(saved)
        setAnalytics(parsed.analytics ?? true)
        setMarketing(parsed.marketing ?? true)
      }
    } catch (e) {
      setShowBanner(true)
    }
  }, [])

  useEffect(() => {
    const handleOpenSettings = () => {
      setShowModal(true)
      setShowBanner(false)
    }

    window.addEventListener("open-cookie-settings", handleOpenSettings)
    return () => window.removeEventListener("open-cookie-settings", handleOpenSettings)
  }, [])

  const saveConsent = (prefs: { necessary: boolean; analytics: boolean; marketing: boolean }) => {
    const data: CookiePreferences = {
      ...prefs,
      updatedAt: new Date().toISOString()
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      document.cookie = "cookie_consent=true; max-age=31536000; path=/; SameSite=Lax"
    } catch (e) {}

    setShowBanner(false)
    setShowModal(false)
  }

  const handleAcceptAll = () => {
    setAnalytics(true)
    setMarketing(true)
    saveConsent({ necessary: true, analytics: true, marketing: true })
  }

  const handleRejectOptional = () => {
    setAnalytics(false)
    setMarketing(false)
    saveConsent({ necessary: true, analytics: false, marketing: false })
  }

  const handleSaveCustom = () => {
    saveConsent({ necessary: true, analytics, marketing })
  }

  if (!mounted) return null

  return (
    <>
      {/* 1. FLOATING COOKIE BANNER */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#131B2A]/95 dark:bg-[#0F172A]/95 text-white border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                  <span className="text-base leading-none">🍪</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                    <span>การใช้คุกกี้และความเป็นส่วนตัว</span>
                  </h3>
                  <span className="text-[10px] text-purple-300 font-medium">PDPA & GDPR Compliance</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRejectOptional}
                className="text-slate-400 hover:text-white p-1 rounded-xl transition cursor-pointer"
                title="ปิดและปฏิเสธคุกกี้ที่ไม่จำเป็น"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              เว็บไซต์นี้ใช้คุกกี้เพื่อมอบประสบการณ์การใช้งานที่ดีที่สุด วิเคราะห์การเข้าชมเว็บไซต์ และเพิ่มประสิทธิภาพในการให้บริการ คุณสามารถศึกษารายละเอียดเพิ่มเติมได้ที่{" "}
              <Link href="/privacy" className="text-purple-400 hover:underline font-bold inline-flex items-center gap-0.5">
                <span>นโยบายความเป็นส่วนตัว</span>
                <ExternalLink className="w-3 h-3" />
              </Link>{" "}
              และ{" "}
              <Link href="/terms" className="text-purple-400 hover:underline font-bold inline-flex items-center gap-0.5">
                <span>ข้อกำหนดการใช้บริการ</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black transition active:scale-95 shadow-md shadow-purple-600/30 cursor-pointer text-center"
              >
                ยอมรับทั้งหมด
              </button>

              <button
                type="button"
                onClick={handleRejectOptional}
                className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition active:scale-95 border border-slate-700 cursor-pointer text-center"
              >
                ปฏิเสธที่ไม่จำเป็น
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowBanner(false)
                  setShowModal(true)
                }}
                className="w-full sm:w-auto py-2.5 px-3 rounded-xl text-slate-400 hover:text-purple-300 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>ตั้งค่า</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. COOKIE PREFERENCES MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#131B2A] text-white border border-purple-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">ศูนย์การตั้งค่าคุกกี้ (Cookie Settings)</h3>
                  <p className="text-[11px] text-slate-400">กำหนดความยินยอมการใช้งานคุกกี้ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              เราเคารพในสิทธิความเป็นส่วนตัวของคุณ คุณสามารถเลือกเปิดหรือปิดการทำงานของคุกกี้แต่ละประเภทได้ตามต้องการ ยกเว้นคุกกี้ที่จำเป็นอย่างยิ่งต่อการทำงานของระบบ
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">1. คุกกี้ที่จำเป็นอย่างยิ่ง (Strictly Necessary Cookies)</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-bold">
                      จำเป็น
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> เปิดใช้งานเสมอ
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  คุกกี้ประเภทนี้มีความจำเป็นต่อการทำงานพื้นฐานของเว็บไซต์ เช่น การเข้าสู่ระบบ การจดจำความปลอดภัย และการทำธุรกรรม ไม่สามารถปิดการใช้งานได้
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">2. คุกกี้เพื่อการวิเคราะห์และวัดผล (Analytics & Performance)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ช่วยให้เราเข้าใจพฤติกรรมการใช้งาน สถิติยอดคลิกลิงก์ และสถิติการเข้าชม เพื่อนำมาพัฒนาและปรับปรุงประสิทธิภาพของแพลตฟอร์ม
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">3. คุกกี้เพื่อการตลาดและการโฆษณา (Marketing & Targeting Pixels)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ใช้สำหรับการเชื่อมต่อระบบ Tracking Pixels (เช่น Meta Pixel, TikTok Pixel, Google Tag) เพื่อวัดผลการโฆษณาและนำเสนอแคมเปญที่เกี่ยวข้อง
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <Link
                href="/privacy"
                onClick={() => setShowModal(false)}
                className="text-xs text-purple-400 hover:underline font-bold"
              >
                อ่านนโยบายความเป็นส่วนตัวฉบับเต็ม ↗
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition cursor-pointer"
                >
                  ปฏิเสธทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white transition shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}