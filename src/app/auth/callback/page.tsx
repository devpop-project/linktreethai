'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2, Link2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [status, setStatus] = useState('กำลังยืนยันตัวตน...')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Auth error:', error)
          setStatus('เกิดข้อผิดพลาดในการยืนยันตัวตน กำลังนำท่านกลับหน้าเข้าสู่ระบบ...')
          setTimeout(() => router.push('/login'), 2000)
          return
        }

        if (session) {
          setIsSuccess(true)
          setStatus('ยืนยันตัวตนสำเร็จ! กำลังนำท่านไปยังหน้าแดชบอร์ด...')
          setTimeout(() => {
            router.push('/dashboard')
          }, 1200)
        } else {
          // Listen for onAuthStateChange (handles hash token if present)
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
              setIsSuccess(true)
              setStatus('ยืนยันตัวตนสำเร็จ! กำลังนำท่านไปยังหน้าแดชบอร์ด...')
              setTimeout(() => {
                router.push('/dashboard')
              }, 1200)
            }
          })

          setTimeout(() => {
            router.push('/dashboard')
          }, 2500)

          return () => {
            subscription.unsubscribe()
          }
        }
      } catch (err) {
        console.error(err)
        router.push('/dashboard')
      }
    }

    handleAuth()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center gap-4 backdrop-blur-xl">
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          {isSuccess ? (
            <CheckCircle2 className="w-8 h-8 text-slate-950 animate-bounce" />
          ) : (
            <Loader2 className="w-8 h-8 animate-spin text-slate-950" />
          )}
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            LinkTreeThai
          </h2>
          <p className="text-slate-300 text-sm font-medium">{status}</p>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden mt-2">
          <div className="bg-emerald-400 h-full rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  )
}
