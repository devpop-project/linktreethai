'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import TrackingPixels, { trackPixelEvent } from '@/components/TrackingPixels'
import { appendUTMToUrl, captureUTMParams, getStoredUTMParams } from '@/lib/utm'
import { Link2, Share2, QrCode, X, Check, ArrowLeft } from 'lucide-react'

export default function UserBioPage({ params }: { params: { username: string } }) {
  const username = params.username.toLowerCase()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [shareModal, setShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    captureUTMParams()
    loadPublicData()
  }, [username])

  const loadPublicData = async () => {
    setLoading(true)

    // 1. Fetch Profile
    const { data: profData } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (!profData) {
      setLoading(false)
      return
    }

    setProfile(profData)

    // 2. Fetch Active Links
    const { data: linkData } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', profData.id)
      .eq('is_active', true)
      .order('position', { ascending: true })

    if (linkData) setLinks(linkData)

    // 3. Fetch Active Products
    const { data: prodData } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', profData.id)
      .eq('is_active', true)
      .order('position', { ascending: true })

    if (prodData) setProducts(prodData)

    // Set Document Title and Favicon dynamically for this Bio Page
    if (typeof document !== 'undefined' && profData) {
      const bioTitle = `${profData.full_name || profData.username} (@${profData.username})`
      document.title = bioTitle

      if (profData.avatar_url) {
        let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement
        if (!iconLink) {
          iconLink = document.createElement('link')
          iconLink.rel = 'icon'
          document.head.appendChild(iconLink)
        }
        iconLink.href = profData.avatar_url
      }
    }

    setLoading(false)

    // Trigger ViewContent event on profile view
    if (profData?.id) {
      trackPixelEvent('ViewContent', {
        content_name: profData.full_name || profData.username,
        content_type: 'profile',
        content_category: 'bio_link'
      }, {
        userId: profData.id,
        fbPixelId: profData.fb_pixel_id,
        tiktokPixelId: profData.tiktok_pixel_id,
        metaCapiToken: profData.meta_capi_token
      })
    }
  }

  // Handle Link Click tracking + ClickShopee / ClickLazada + UTM Forwarding
  const handleLinkClick = async (linkId: string, url: string, linkTitle?: string) => {
    const isShopee = url.includes('shopee.co.th') || url.includes('shp.ee')
    const isLazada = url.includes('lazada.co.th') || url.includes('laz.ee')
    const isTikTokShop = url.includes('tiktok.com') && (url.includes('shop') || url.includes('product') || url.includes('view/product'))

    let eventName: 'ClickShopee' | 'ClickLazada' | 'ClickTikTokShop' | 'InitiateCheckout' = 'InitiateCheckout'
    if (isShopee) eventName = 'ClickShopee'
    else if (isLazada) eventName = 'ClickLazada'
    else if (isTikTokShop) eventName = 'ClickTikTokShop'

    // Forward UTM tracking parameters to destination URL
    const destinationUrl = appendUTMToUrl(url)

    // Trigger Pixel + CAPI Event
    trackPixelEvent(eventName, { 
      link_id: linkId, 
      content_name: linkTitle || 'Outbound Link',
      url: destinationUrl,
      platform: isShopee ? 'Shopee' : isLazada ? 'Lazada' : isTikTokShop ? 'TikTokShop' : 'External'
    }, {
      userId: profile?.id,
      fbPixelId: profile?.fb_pixel_id,
      tiktokPixelId: profile?.tiktok_pixel_id,
      metaCapiToken: profile?.meta_capi_token
    })

    try {
      fetch('/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          linkId,
          url: destinationUrl,
          utm: getStoredUTMParams()
        })
      }).catch(() => {})
    } catch (e) {}

    window.open(destinationUrl, '_blank')
  }

  const handleCopyProfileUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!loading && !profile) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex flex-col items-center justify-center text-slate-400 p-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
          <Link2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1.5">ไม่พบหน้าโปรไฟล์นี้</h2>
        <p className="text-xs text-slate-400 max-w-xs">ผู้ใช้ @{username} อาจยังไม่ได้ลงทะเบียนหรือเปลี่ยนชื่อผู้ใช้แล้ว</p>
        <a 
          href="/" 
          className="mt-6 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold rounded-2xl text-xs hover:opacity-90 transition shadow-lg shadow-emerald-500/20"
        >
          กลับสู่หน้าหลัก LinkTreeThai
        </a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full"></div>
          <div className="w-32 h-4 bg-slate-900 rounded-full"></div>
        </div>
      </div>
    )
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://linktreethai.in.th/${username}`
  const isLightBg = profile?.bg_color === '#FFFFFF' || profile?.bg_color === '#F9F9FF' || profile?.bg_color === '#F1F5F9'

  return (
    <div 
      className="min-h-screen bg-[#0b0f17] text-slate-100 relative flex flex-col items-center justify-between bg-cover bg-center bg-no-repeat transition-all duration-300 overflow-x-hidden"
      style={{
        backgroundColor: '#0B0F17',
        ...(profile.bg_image_url ? { backgroundImage: `url(${profile.bg_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {})
      }}
    >
      {/* 1. AUTO INJECT TRACKING PIXELS (Meta FB, TikTok, Google, LINE) */}
      <TrackingPixels
        userId={profile.id}
        fbPixelId={profile.fb_pixel_id}
        tiktokPixelId={profile.tiktok_pixel_id}
        googlePixelId={profile.google_pixel_id}
        lineTagId={profile.line_tag_id}
        metaCapiToken={profile.meta_capi_token}
      />

      {/* Background Overlay */}
      {profile.bg_image_url && (
        <div className={`absolute inset-0 z-0 pointer-events-none ${isLightBg ? "bg-white/80" : "bg-[#0b0f17]/75"} backdrop-blur-xs`}></div>
      )}

      {/* Floating Top App Action Bar */}
      <div className="w-full max-w-md mx-auto px-4 pt-3.5 pb-1 flex items-center justify-between relative z-20">
        <a 
          href="/"
          className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95 shadow"
          title="หน้าหลัก LinkTreeThai"
        >
          <Link2 className="w-4 h-4" />
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShareModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5 active:scale-95 shadow"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>แชร์</span>
          </button>
        </div>
      </div>

      {/* Render Selected Bio Link Template */}
      <TemplateRenderer
        profile={profile}
        links={links}
        products={products}
        handleLinkClick={handleLinkClick}
      />

      {/* Conditional Branding Footer */}
      {!profile.hide_branding ? (
        <footer className="py-6 text-center text-xs opacity-60 flex items-center justify-center gap-1 relative z-10 hover:opacity-100 transition">
          <span className="text-slate-400 text-[11px]">สร้าง Bio Link ฟรีที่</span>
          <a href="/" className="font-bold underline text-emerald-400 text-[11px]">
            LinkTreeThai
          </a>
        </footer>
      ) : (
        <div className="py-4"></div>
      )}

      {/* Mobile Share & QR Sheet Modal */}
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">แชร์โปรไฟล์ @{username}</h3>
              </div>
              <button
                onClick={() => setShareModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner mx-auto w-48 h-48">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(currentUrl)}`}
                alt="Profile QR Code"
                className="w-36 h-36 object-contain"
              />
            </div>

            {/* URL Display & Copy Button */}
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="bg-transparent text-xs text-slate-300 flex-1 px-2 focus:outline-none font-mono truncate"
              />
              <button
                onClick={handleCopyProfileUrl}
                className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 hover:bg-emerald-400 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : 'คัดลอก'}
              </button>
            </div>

            <button
              onClick={() => setShareModal(false)}
              className="w-full py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
