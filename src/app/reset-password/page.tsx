'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { createClient } from '@/lib/supabase/client'
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RotateCcw
} from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [validSession, setValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    const checkRecoverySession = async () => {
      try {
        // Check if there is an active session (Supabase sets session automatically when user clicks recovery link)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session && isMounted) {
          setValidSession(true)
          return
        }

        // Also check URL hash for recovery tokens
        if (typeof window !== 'undefined') {
          const hash = window.location.hash
          if (hash.includes('type=recovery') || hash.includes('access_token')) {
            if (isMounted) setValidSession(true)
            return
          }
        }

        // Listen to auth state change for PASSWORD_RECOVERY event
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY' || (session && isMounted)) {
            if (isMounted) setValidSession(true)
          }
        })

        // Wait slightly to let Supabase process tokens
        setTimeout(async () => {
          const { data: { session: secondCheck } } = await supabase.auth.getSession()
          if (isMounted) {
            setValidSession(!!secondCheck || (typeof window !== 'undefined' && window.location.hash.includes('access_token')))
          }
        }, 1500)

        return () => {
          subscription?.unsubscribe()
        }
      } catch (err) {
        console.warn('Recovery session check error:', err)
        if (isMounted) setValidSession(false)
      }
    }

    checkRecoverySession()

    return () => {
      isMounted = false
    }
  }, [supabase])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!password) {
      setErrorMsg('กรุณาระบุรหัสผ่านใหม่')
      return
    }

    if (password.length < 6) {
      setErrorMsg('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      setSuccessMsg('✅ ตั้งรหัสผ่านใหม่สำเร็จแล้ว! กำลังนำคุณเข้าสู่แดชบอร์ด...')
      
      // Auto redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.replace('/dashboard')
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

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
          กลับไปหน้าเข้าสู่ระบบ ↗
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Form Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                ตั้งรหัสผ่านใหม่
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                กำหนดรหัสผ่านใหม่สำหรับเข้าสู่ระบบ LinkTreeThai
              </p>
            </div>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs leading-relaxed flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black">สำเร็จเรียบร้อย!</h3>
                <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-400">
                  {successMsg}
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.replace('/dashboard')}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>เข้าสู่แดชบอร์ดทันที</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  รหัสผ่านใหม่ (New Password) *
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

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ยืนยันรหัสผ่านใหม่อีกครั้ง (Confirm Password) *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full min-h-[48px] pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-950 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Match / Strength Indicator */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] ${password.length >= 6 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    ✓
                  </div>
                  <span>ความยาวอย่างน้อย 6 ตัวอักษร</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] ${password && confirmPassword && password === confirmPassword ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    ✓
                  </div>
                  <span>รหัสผ่านทั้งสองช่องตรงกัน</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || password.length < 6 || password !== confirmPassword}
                className="w-full min-h-[48px] py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-2xl text-sm transition shadow-lg shadow-purple-600/25 active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>บันทึกรหัสผ่านใหม่</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Expired / Invalid Warning Notice if checked and no session */}
          {validSession === false && !successMsg && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                ⚠️ หากลิงก์หมดอายุ หรือกดแล้วไม่สามารถบันทึกได้ กรุณาขอลิงก์รีเซ็ตใหม่อีกครั้ง
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline mt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ขอลิงก์รีเซ็ตรหัสผ่านใหม่ที่หน้าเข้าสู่ระบบ</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-400">
        © 2026 LinkTreeThai. All rights reserved. • ปลอดภัยด้วยระบบ Supabase Auth
      </footer>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] flex items-center justify-center p-4 font-sans">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
