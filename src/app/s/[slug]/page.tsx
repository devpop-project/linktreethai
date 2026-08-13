'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Link2, AlertCircle, ArrowRight, ExternalLink, Loader2 } from 'lucide-react'

export default function ShortLinkRedirectPage({ params }: { params: { slug: string } }) {
  const rawSlug = params?.slug || ''
  const slug = decodeURIComponent(rawSlug).toLowerCase().trim()
  
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [destination, setDestination] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  
  const supabase = createClient()

  useEffect(() => {
    if (!slug) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const processRedirect = async () => {
      try {
        // Query short_links
        const { data, error } = await supabase
          .from('short_links')
          .select('*')
          .ilike('slug', slug)
          .eq('is_active', true)
          .single()

        if (error || !data || !data.original_url) {
          setNotFound(true)
          setLoading(false)
          return
        }

        let targetUrl = data.original_url.trim()
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
          targetUrl = 'https://' + targetUrl
        }

        setDestination(targetUrl)
        setTitle(data.title || slug)

        // Increment clicks
        try {
          fetch('/api/short-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: data.slug, shortLinkId: data.id })
          }).catch(() => {})
        } catch (e) {}

        // Fast redirect
        window.location.replace(targetUrl)
      } catch (err) {
        setNotFound(true)
        setLoading(false)
      }
    }

    processRedirect()
  }, [slug])

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-2xl">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">ไม่พบลิงก์ย่อนี้</h2>
          <p className="text-xs text-slate-400">
            ลิงก์ <code className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded">/s/{slug}</code> อาจไม่มีอยู่ในระบบ หรือถูกปิดการใช้งานชั่วคราว
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              กลับสู่หน้าหลัก <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-sm w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-2xl">
        <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
          <Link2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">กำลังนำคุณไปยังปลายทาง...</h3>
          {title && <p className="text-xs text-purple-300 font-semibold truncate">{title}</p>}
          <p className="text-[11px] text-slate-500 mt-2 font-mono truncate">{destination || slug}</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>รอสักครู่ ระบบกำลังเปลี่ยนเส้นทาง</span>
        </div>
        {destination && (
          <div className="pt-2">
            <a
              href={destination}
              className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              คลิกที่นี่หากไม่เปลี่ยนเส้นทางอัตโนมัติ <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
