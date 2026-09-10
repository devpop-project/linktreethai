'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { createClient } from '@/lib/supabase/client'
import {
  Link2,
  LogIn,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  X,
  Eye,
  EyeOff,
  Star,
  Zap,
  Globe,
  Crown,
  FileCode,
  QrCode
} from 'lucide-react'

function hasLocalSupabaseSession(): boolean {
  if (typeof window === 'undefined') return false
  try {
    // 1. Check cookies (where @supabase/ssr stores auth tokens)
    if (document.cookie) {
      const cookies = document.cookie.split(';')
      for (const c of cookies) {
        const trimmed = c.trim()
        if (trimmed.startsWith('sb-') && trimmed.includes('-auth-token') && trimmed.length > 25) {
          return true
        }
        if (trimmed.startsWith('supabase-auth-token=') && trimmed.length > 25) {
          return true
        }
      }
    }
    // 2. Check localStorage (where standard supabase-js stores auth tokens)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || ''
      if ((key.startsWith('sb-') && key.includes('token')) || key.includes('supabase.auth.token')) {
        const raw = localStorage.getItem(key) || ''
        if (raw.length > 20) return true
      }
    }
  } catch (e) {}
  return false
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Password Reset Modal
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMsg, setResetMsg] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const [checkingAuth, setCheckingAuth] = useState(true)

  // Redirect to /dashboard immediately if user is already logged in
  useEffect(() => {
    if (hasLocalSupabaseSession()) {
      window.location.replace('/dashboard')
      return
    }

    let isMounted = true

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          window.location.replace('/dashboard')
          return
        }
        if (isMounted) {
          setCheckingAuth(false)
        }
      } catch (err) {
        console.error('Session check note:', err)
        if (isMounted) {
          setCheckingAuth(false)
        }
      }
    }

    checkSession()

    // Listen to bfcache restore (browser back/forward button)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (hasLocalSupabaseSession() || event.persisted) {
        window.location.replace('/dashboard')
        return
      }
      checkSession()
    }
    window.addEventListener('pageshow', handlePageShow)

    const handlePopState = () => {
      if (hasLocalSupabaseSession()) {
        window.location.replace('/dashboard')
      }
    }
    window.addEventListener('popstate', handlePopState)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        window.location.replace('/dashboard')
      }
    })

    return () => {
      isMounted = false
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('popstate', handlePopState)
      subscription.unsubscribe()
    }
  }, [router, supabase])


  const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/auth/callback`
    }
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'https://linktreethai.in.th')
    return `${siteUrl}/auth/callback`
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setErrorMsg('')
    try {
      const redirectUrl = getRedirectUrl()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })
      if (error) throw error
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google')
      setGoogleLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        throw error
      }

      if (data?.session) {
        window.location.replace('/dashboard')
      }
    } catch (err: any) {
      let msg = err.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล'
      if (msg.includes('Invalid login credentials')) {
        msg = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
      } else if (msg.includes('Email not confirmed')) {
        msg = 'กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ (ตรวจสอบในกล่องจดหมาย)'
      }
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim()) {
      setResetMsg('❌ กรุณาระบุอีเมลสำหรับรีเซ็ตรหัสผ่าน')
      return
    }

    setResetLoading(true)
    setResetMsg('')

    const redirectUrl = getRedirectUrl()
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${redirectUrl}?next=/dashboard/profile`
    })

    if (error) {
      setResetMsg('❌ เกิดข้อผิดพลาด: ' + error.message)
    } else {
      setResetMsg('✅ ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลเรียบร้อยแล้ว กรุณาตรวจสอบกล่องจดหมาย')
    }
    setResetLoading(false)
  }
  if (checkingAuth || (typeof window !== 'undefined' && hasLocalSupabaseSession())) {
    return (
      <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <SiteLogo textClassName="text-xl font-black tracking-tight text-slate-900 dark:text-white" />
        </Link>
        <Link
          href="/register"
          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition"
        >
          ยังไม่มีบัญชี? <span className="underline">สมัครสมาชิกฟรี ↗</span>
        </Link>
      </header>

      {/* Main Split Layout: Left Showcase (Desktop 50%) + Right Form (50%) */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          
          {/* LEFT 50%: Visual Showcase & Social Proof (Hidden on Mobile, Visible on lg+) */}
          <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-10 flex-col justify-between h-full min-h-[580px] text-white relative overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>All-in-One Bio Link & Sales Automation</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                ศูนย์กลางรวมทุกลิงก์ <br />
                และปิดการขายด้วย <br />
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 bg-clip-text text-transparent">
                  PromptPay QR ยอดตรง
                </span>
              </h1>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>9 ธีมสไตล์ Mobile App หรูหรา พร้อมระบบวางขายสินค้า 0% GP</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span>เซลเพจ Flash Sale ปิดการขาย + เก็บเงินปลายทาง (COD)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span>โฮสต์หน้า index.html ส่วนตัว (/u/[slug]) พร้อมฝัง Meta CAPI</span>
                </div>
              </div>
            </div>

            {/* Social Proof Quote Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 relative z-10 mt-6">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                “สร้างหน้ารวมลิงก์และเซลเพจปิดการขายเสร็จในไม่กี่นาที ลูกค้าสแกนจ่ายพร้อมเพย์ยอดตรง แจ้งเตือนเข้า LINE สะดวกมากครับ”
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="font-bold text-white">ผู้ใช้งานจริง • ร้านค้าออนไลน์ 🇹🇭</span>
                <span>Verified Creator</span>
              </div>
            </div>
          </div>

          {/* RIGHT 50%: Clean Minimalist Auth Form (Mobile Focused) */}
          <div className="lg:col-span-6 p-6 sm:p-10 w-full max-w-md mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                เข้าสู่ระบบ
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่แดชบอร์ดจัดการระบบของคุณ
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs leading-relaxed flex items-start gap-2">
                <span className="font-bold">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google OAuth Login Button (Min height 48px for touch) */}
            <div className="space-y-4 mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
                className="w-full min-h-[48px] py-3 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 transition shadow-sm flex items-center justify-center gap-3 text-sm disabled:opacity-50 active:scale-98 cursor-pointer"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>เข้าสู่ระบบด้วย Google</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-[#131B2A] px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                  หรือเข้าสู่ระบบด้วยอีเมล
                </span>
              </div>
            </div>

            {/* Email & Password Form (Touch-Friendly >= 48px height) */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  อีเมล (Email)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[48px] pl-10 pr-3.5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-950 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    รหัสผ่าน (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email)
                      setResetModalOpen(true)
                    }}
                    className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full min-h-[48px] pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-950 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full min-h-[48px] py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl text-sm transition shadow-lg shadow-purple-600/25 active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>เข้าสู่ระบบ</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              ยังไม่มีบัญชีผู้ใช้งาน?{' '}
              <Link
                href="/register"
                className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                สมัครสมาชิกฟรีที่นี่
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-400">
        © 2026 LinkTreeThai. All rights reserved. • ปลอดภัยด้วยระบบ Supabase Auth
      </footer>

      {/* PASSWORD RESET MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base">
                <KeyRound className="w-5 h-5 text-purple-500" />
                <span>รีเซ็ตรหัสผ่าน</span>
              </div>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              กรอกอีเมลที่คุณใช้ลงทะเบียน เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้คุณทางอีเมล
            </p>

            {resetMsg && (
              <div className={`p-3 rounded-2xl text-xs ${resetMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                {resetMsg}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  อีเมลของคุณ
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full min-h-[46px] px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ปิด
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {resetLoading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ต'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
