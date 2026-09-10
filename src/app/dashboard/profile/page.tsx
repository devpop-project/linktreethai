'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function DashboardProfileRedirect() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleRedirect = async () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash || ''
        const search = window.location.search || ''

        // If recovery token or reset password flag is present in hash or search, direct to reset-password
        if (hash.includes('type=recovery') || hash.includes('access_token') || search.includes('type=recovery')) {
          router.replace('/reset-password' + search + hash)
          return
        }
      }

      // If user has a recovery session
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session && typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
          router.replace('/reset-password')
          return
        }
      } catch (e) {}

      // Default: Redirect to dashboard appearance / profile settings tab
      router.replace('/dashboard?tab=appearance')
    }

    handleRedirect()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-[#F9F9FF] dark:bg-[#0B0F17] flex items-center justify-center p-4 font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">กำลังนำคุณไปยังหน้าตั้งค่าโปรไฟล์...</p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardProfileRedirect />
    </Suspense>
  )
}
