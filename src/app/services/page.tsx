'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, LayoutTemplate } from 'lucide-react'

export default function ServicesRedirectPage() {
  const router = useRouter()
  const [status, setStatus] = useState('กำลังตรวจสอบสิทธิ์การใช้งาน...')

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          // If not logged in, redirect to login page with return url
          setStatus('กรุณาเข้าสู่ระบบเพื่อเข้าใช้งานบริการอื่นๆ...')
          router.replace('/login?next=/dashboard?tab=services')
        } else {
          // If logged in, seamlessly redirect to the Services tab in Dashboard
          setStatus('กำลังเปิดหน้าบริการอื่นๆ ในแดชบอร์ด...')
          router.replace('/dashboard?tab=services')
        }
      } catch (err) {
        console.error('Auth redirect error:', err)
        router.replace('/login?next=/dashboard?tab=services')
      }
    }

    checkAuthAndRedirect()
  }, [router])

  return (
    <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] text-[#1E1B4B] dark:text-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-[#131B2A] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
          <LayoutTemplate className="w-7 h-7 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            บริการอื่นๆ (Services Hub)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600 dark:text-purple-400" />
            <span>{status}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
