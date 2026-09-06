'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { createClient } from '@/lib/supabase/client'
import {
  Link2,
  UserPlus,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  AtSign,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  Zap,
  Globe,
  Star,
  Coins
} from 'lucide-react'

function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const prefill = searchParams.get('username')
    if (prefill) {
      setUsername(prefill.toLowerCase().replace(/[^a-z0-9_]/g, ''))
    }
  }, [searchParams])

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

  const handleGoogleSignUp = async () => {
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
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิกด้วย Google')
      setGoogleLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (!cleanUsername) {
      setErrorMsg('กรุณากรอก Username เป็นตัวอักษรภาษาอังกฤษ ตัวเลข หรือ _ เท่านั้น')
      setLoading(false)
      return
    }

    if (cleanUsername.length < 3) {
      setErrorMsg('Username ต้องมีความยาวอย่างน้อย 3 ตัวอักษร')
      setLoading(false)
      return
    }

    const redirectUrl = getRedirectUrl()

    try {
      // 1. Check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', cleanUsername)
        .maybeSingle()

      if (existingUser) {
        throw new Error(`ชื่อผู้ใช้ @${cleanUsername} มีผู้ใช้งานแล้ว กรุณาเลือกชื่ออื่น`)
      }

      // 2. Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: cleanUsername,
            full_name: cleanUsername
          }
        }
      })

      if (error) throw error

      if (data?.session) {
        router.push('/dashboard')
      } else {
        setIsEmailSent(true)
      }
    } catch (err: any) {
      let msg = err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
      if (msg.includes('User already registered')) {
        msg = 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ'
      } else if (msg.includes('Password should be at least')) {
        msg = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
      }
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      {/* LEFT 50%: Visual Showcase & Value Props (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-10 flex-col justify-between h-full min-h-[640px] text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>เริ่มต้นฟรี 100% • ไม่ต้องใช้บัตรเครดิต</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            สร้าง Bio Link <br />
            สไตล์แอปมือถือ <br />
            <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              เสร็จใน 1 นาที
            </span>
          </h1>

          <div className="space-y-3.5 text-xs text-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span>ตั้งชื่อลิงก์โปรไฟล์ของคุณเอง เช่น linktreethai.in.th/@ชื่อคุณ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span>รับเงินผ่าน PromptPay Dynamic QR ยอดตรง แนบสลิป ไม่หัก GP</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span>ปลดล็อกโฮสต์ index.html ส่วนตัว (/u/[slug]) และเซลเพจ Flash Sale</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span>ติดตั้ง Multi-Tracking Pixels (FB, TikTok, Google, LINE Tag)</span>
            </div>
          </div>
        </div>

        {/* Live Feature Highlights Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 relative z-10 mt-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300">★ ฟังก์ชันพร้อมใช้งานทันที</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              Active 2026
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            เชื่อมต่อ Facebook, TikTok, Instagram, Shopee, Lazada รวมครบทุกโซเชียลในหน้าเดียว พร้อมระบบ CRM เก็บข้อมูลลูกค้า
          </p>
        </div>
      </div>

      {/* RIGHT 50%: Registration Form (Mobile Focused Card) */}
      <div className="lg:col-span-6 p-6 sm:p-10 w-full max-w-md mx-auto">
        {isEmailSent ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              ยืนยันอีเมลของคุณ
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
              เราได้ส่งลิงก์ยืนยันการสมัครไปที่ <strong className="text-purple-600">{email}</strong> กรุณาเปิดกล่องข้อความและคลิกลิงก์เพื่อเริ่มต้นใช้งาน
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs transition shadow-md"
              >
                <span>ไปที่หน้าเข้าสู่ระบบ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                สร้างบัญชีใหม่
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                จองชื่อลิงก์ของคุณและเริ่มต้นสร้างหน้า Bio Link ฟรี
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs leading-relaxed flex items-start gap-2">
                <span className="font-bold">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google OAuth SignUp Button (Min height 48px for touch) */}
            <div className="space-y-4 mb-6">
              <button
                type="button"
                onClick={handleGoogleSignUp}
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
                    <span>สมัครสมาชิกด้วย Google</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-[#131B2A] px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                  หรือกรอกข้อมูลสมัครสมาชิก
                </span>
              </div>
            </div>

            {/* Email Form (Touch-Friendly >= 48px height) */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ชื่อผู้ใช้งาน (Username) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono font-bold text-purple-600 dark:text-purple-400 select-none">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="yourname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full min-h-[48px] pl-8 pr-3.5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono font-bold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-950 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  URL ของคุณ: linktreethai.in.th/{username || 'yourname'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  อีเมล (Email) <span className="text-rose-500">*</span>
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  รหัสผ่าน (Password) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="อย่างน้อย 6 ตัวอักษร"
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
                    <UserPlus className="w-4 h-4" />
                    <span>สร้างบัญชีผู้ใช้งาน</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              มีบัญชีผู้ใช้งานอยู่แล้ว?{' '}
              <Link
                href="/login"
                className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                เข้าสู่ระบบที่นี่
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <SiteLogo textClassName="text-xl font-black tracking-tight text-slate-900 dark:text-white" />
        </Link>
        <Link
          href="/login"
          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition"
        >
          มีบัญชีอยู่แล้ว? <span className="underline">เข้าสู่ระบบ ↗</span>
        </Link>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <Suspense fallback={
          <div className="text-center py-12 text-slate-400 text-sm font-bold">
            กำลังโหลดข้อมูลการลงทะเบียน...
          </div>
        }>
          <RegisterForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-400">
        © 2026 LinkTreeThai. All rights reserved. • ข้อมูลของคุณได้รับการปกป้องอย่างปลอดภัย
      </footer>
    </div>
  )
}
