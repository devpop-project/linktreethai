'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { createClient } from '@/lib/supabase/client'
import { Link2, LogIn, Sparkles, ArrowRight, Mail, Lock, CheckCircle2, ShieldCheck, KeyRound, X, Eye, EyeOff } from 'lucide-react'

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

  const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/auth/callback`
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'https://linktreethai.com')
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
            prompt: 'consent',
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือยังไม่ได้ยืนยันอีเมล')
      setLoading(false)
    } else if (data?.user) {
      router.push('/dashboard')
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    setResetLoading(true)
    setResetMsg('')

    const redirectUrl = getRedirectUrl()

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: redirectUrl,
    })

    if (error) {
      setResetMsg('❌ เกิดข้อผิดพลาด: ' + error.message)
    } else {
      setResetMsg('✅ ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลเรียบร้อยแล้ว กรุณาตรวจสอบกล่องจดหมาย')
    }
    setResetLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F9F9FF] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6 flex flex-col items-center">
          <SiteLogo className="mb-2 justify-center" textClassName="text-2xl font-black tracking-tight text-[#1E1B4B]" />
          <p className="text-slate-500 text-xs mt-1">เข้าสู่ระบบเพื่อจัดการ Bio Link ของคุณ</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-black text-[#1E1B4B]">เข้าสู่ระบบ</h2>
            <p className="text-slate-500 text-xs mt-0.5">กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่แดชบอร์ด</p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google OAuth Login Button */}
          <div className="space-y-4 mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition shadow-sm flex items-center justify-center gap-3 text-sm disabled:opacity-50 active:scale-98 cursor-pointer"
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
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                หรือเข้าสู่ระบบด้วยอีเมล
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">อีเมล (Email)</label>
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
                  className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-2xl text-[#1E1B4B] placeholder-slate-400 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#1E1B4B]">รหัสผ่าน (Password)</label>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-[11px] text-purple-600 font-bold hover:underline"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-[#1E1B4B] placeholder-slate-400 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition cursor-pointer p-1"
                  title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-2xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2 active:scale-98"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> เข้าสู่ระบบแดชบอร์ด
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              ยังไม่มีบัญชีผู้ใช้งาน?{' '}
              <Link href="/register" className="text-purple-600 font-bold hover:underline">
                สร้างบัญชีฟรีที่นี่
              </Link>
            </p>
          </div>
        </div>

        {/* Reset Password Modal */}
        {resetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-[#1E1B4B] text-sm">รีเซ็ตรหัสผ่าน</h3>
                </div>
                <button
                  onClick={() => setResetModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-[#1E1B4B] flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {resetMsg ? (
                <div className="p-4 bg-purple-50 rounded-2xl text-xs text-purple-900 border border-purple-200">
                  {resetMsg}
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1E1B4B] mb-1">กรอกอีเมลของคุณ</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-[#1E1B4B] focus:outline-none focus:border-purple-400 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-xl text-xs transition disabled:opacity-50"
                  >
                    {resetLoading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                  </button>
                </form>
              )}

              <button
                onClick={() => setResetModalOpen(false)}
                className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
              >
                ปิด
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-6 text-[11px] text-slate-400">
          © 2026 LinkTreeThai. All rights reserved.
        </div>
      </div>
    </div>
  )
}
