'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Link2, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/80 border border-slate-700 p-8 rounded-3xl backdrop-blur">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500 p-3 rounded-2xl text-slate-950 font-bold">
            <Link2 className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">เข้าสู่ระบบ MyBioLink</h2>
        <p className="text-slate-400 text-sm text-center mb-6">จัดการลิ้งก์และร้านค้าของคุณ</p>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">อีเมล (Email)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">รหัสผ่าน (Password)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : <><LogIn className="w-4 h-4" /> เข้าสู่ระบบ</>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          ยังไม่มีบัญชี?{' '}
          <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
            สมัครสมาชิกฟรี
          </Link>
        </p>
      </div>
    </div>
  )
}
