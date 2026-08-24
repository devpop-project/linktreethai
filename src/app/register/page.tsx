'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'
import { createClient } from '@/lib/supabase/client'
import { Link2, UserPlus, Sparkles, ArrowRight, Mail, Lock, AtSign, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react'

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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'https://linktreethai.com')
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
            prompt: 'consent',
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: cleanUsername,
          full_name: cleanUsername,
        },
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      if (data?.session) {
        router.push('/dashboard')
      } else {
        setIsEmailSent(true)
        setLoading(false)
      }
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl">
      {isEmailSent ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Mail className="w-8 h-8 animate-bounce" />
          </div>
          
          <h2 className="text-xl font-extrabold text-[#1E1B4B]">ส่งอีเมลยืนยันแล้ว! ✉️</h2>
          
          <p className="text-slate-600 text-sm leading-relaxed">
            ระบบได้ส่งลิงก์ยืนยันตัวตนไปยัง <span className="text-purple-700 font-bold">{email}</span> แล้ว กรุณาเปิดกล่องจดหมายแล้วกดยืนยันเพื่อเข้าสู่ระบบ
          </p>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 text-left">
            <span className="font-bold">💡 คำแนะนำ:</span> เมื่อกดยืนยันในอีเมล ลิงก์จะพาท่านกลับมายังหน้า <strong>LinkTreeThai</strong> บนโดเมนจริงโดยอัตโนมัติ
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full py-3.5 px-4 bg-[#34D399] hover:bg-[#10B981] text-white font-extrabold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-md"
            >
              ไปยังหน้าเข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-black text-[#1E1B4B]">สร้างบัญชีใหม่</h2>
            <p className="text-slate-500 text-xs mt-0.5">จองชื่อลิงก์โปรไฟล์ของคุณก่อนใคร</p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google OAuth Register Button */}
          <div className="space-y-4 mb-5">
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
                  <span>สมัครสมาชิกด้วย Google</span>
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                หรือกรอกข้อมูลสมัครสมาชิก
              </span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5 flex items-center justify-between">
                <span>ชื่อผู้ใช้ (Username)</span>
                <span className="text-[10px] text-purple-600">ลิงก์ของคุณ</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-2xl text-[#1E1B4B] placeholder-slate-400 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition font-mono font-bold"
                />
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
                <span>พรีวิว:</span>
                <span className="text-purple-600 font-mono font-bold">linktreethai.com/{username || 'yourname'}</span>
              </div>
            </div>

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
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">รหัสผ่าน (Password)</label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="•••••••• (อย่างน้อย 6 ตัวอักษร)"
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
                  <UserPlus className="w-4 h-4" /> สมัครสมาชิกและเริ่มสร้าง Bio Link
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              มีบัญชีผู้ใช้งานอยู่แล้ว?{' '}
              <Link href="/login" className="text-purple-600 font-bold hover:underline">
                เข้าสู่ระบบที่นี่
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F9F9FF] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6 flex flex-col items-center">
          <SiteLogo className="mb-2 justify-center" textClassName="text-2xl font-black tracking-tight text-[#1E1B4B]" />
          <p className="text-slate-500 text-xs mt-1">แอปสร้าง Bio Link & หน้าร้านค้าดิจิทัลฟรี</p>
        </div>

        <Suspense fallback={
          <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center text-xs text-slate-400">
            กำลังโหลด...
          </div>
        }>
          <RegisterForm />
        </Suspense>

        <div className="text-center mt-6 text-[11px] text-slate-400">
          © 2026 LinkTreeThai. All rights reserved.
        </div>
      </div>
    </div>
  )
}
