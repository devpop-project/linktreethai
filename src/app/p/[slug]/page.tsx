'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import TrackingPixels, { trackPixelEvent } from '@/components/TrackingPixels'
import { getPromptPayQRImageUrl } from '@/lib/promptpay'
import { appendUTMToUrl, captureUTMParams, getStoredUTMParams } from '@/lib/utm'
import ImageLightboxModal from '@/components/ImageLightboxModal'
import { 
  ShoppingBag, Check, Flame, Clock, ShieldCheck, Truck, MessageCircle, Globe, 
  Sparkles, ArrowRight, Phone, Send, CheckCircle2, Star, 
  Share2, AlertCircle, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, Lock, Upload
} from 'lucide-react'

function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null
  } catch (e) {
    return null
  }
}

export default function SalesLandingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase()
  const [loading, setLoading] = useState(true)
  const [pageData, setPageData] = useState<any>(null)
  const [ownerProfile, setOwnerProfile] = useState<any>(null)
  
  // Live Countdown Timer (default 15 minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  
  // Fullscreen Image Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Quick Order Form
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', line_id: '', address: '', note: '', payment_method: 'promptpay', slip_url: '' })
  const [customAmountInput, setCustomAmountInput] = useState<string>('')
  const [uploadingSlip, setUploadingSlip] = useState(false)
  const [localSlipPreview, setLocalSlipPreview] = useState<string | null>(null)
  const [ordering, setOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadLandingPage()
  }, [slug])

  // Countdown timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 15 * 60))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const loadLandingPage = async () => {
    setLoading(true)

    // 1. Fetch Landing Page by slug
    const { data: page } = await supabase
      .from('landing_pages')
      .select('*, profiles(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (page) {
      setPageData(page)
      setOwnerProfile(page.profiles)
      
      if (page.countdown_minutes) {
        setTimeLeft(page.countdown_minutes * 60)
      }

      // Record view count
      try {
        await supabase.rpc('increment_landing_page_views', { page_id: page.id })
      } catch (e) {}

      // Update Document Title for SEO
      if (typeof document !== 'undefined') {
        document.title = page.seo_title || page.headline || page.title || 'ข้อเสนอพิเศษ Flash Sale'
      }
    }

    setLoading(false)
  }

  const handleCtaClick = async (url?: string | null, eventName: 'PageView' | 'ViewContent' | 'ClickShopee' | 'ClickLazada' | 'ClickTikTokShop' | 'InitiateCheckout' | 'Lead' | 'Contact' | 'Purchase' = 'InitiateCheckout') => {
    if (!pageData) return
    let rawTarget = url || pageData.cta_url || `/${ownerProfile?.username || ''}`
    
    // Detect marketplace
    let targetEvent = eventName
    if (rawTarget.includes('shopee.co.th') || rawTarget.includes('shp.ee')) targetEvent = 'ClickShopee'
    else if (rawTarget.includes('lazada.co.th') || rawTarget.includes('laz.ee')) targetEvent = 'ClickLazada'
    else if (rawTarget.includes('tiktok.com') && (rawTarget.includes('shop') || rawTarget.includes('product'))) targetEvent = 'ClickTikTokShop'

    const targetUrl = appendUTMToUrl(rawTarget)

    // Track Pixel conversion event
    trackPixelEvent(eventName, {
      content_name: pageData.title,
      value: pageData.offer_price || 0,
      currency: 'THB'
    }, { userId: pageData.user_id, landingPageId: pageData.id, pixelId: pageData.fb_pixel_id || ownerProfile?.fb_pixel_id || null })

    // Record click count
    try {
      await supabase.rpc('increment_landing_page_clicks', { page_id: pageData.id })
    } catch (e) {}

    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      window.open(targetUrl, '_blank')
    } else {
      window.location.href = targetUrl
    }
  }

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingSlip(true)

    // 1. Show instant local preview on screen immediately
    const localUrl = URL.createObjectURL(file)
    setLocalSlipPreview(localUrl)

    try {
      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `slips/slip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `slips/${fileName}`

      // 2. Upload to Supabase 'media' bucket (Exact same bucket as Top-up system)
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: true })

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
        setOrderForm(prev => ({ ...prev, slip_url: publicUrl }))
      } else {
        // Fallback: Upload to 'linktree-assets' bucket
        const { data: d2, error: e2 } = await supabase.storage
          .from('linktree-assets')
          .upload(fileName, file, { upsert: true })

        if (!e2 && d2) {
          const { data: { publicUrl } } = supabase.storage.from('linktree-assets').getPublicUrl(fileName)
          setOrderForm(prev => ({ ...prev, slip_url: publicUrl }))
        } else {
          // If storage upload fails, use localUrl as temporary preview
          setOrderForm(prev => ({ ...prev, slip_url: localUrl }))
        }
      }
    } catch (err: any) {
      console.warn('Slip upload notice:', err)
      setOrderForm(prev => ({ ...prev, slip_url: localUrl }))
    } finally {
      setUploadingSlip(false)
    }
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderForm.name || !orderForm.phone || !pageData) return

    setOrdering(true)
    const isPP = orderForm.payment_method === 'promptpay'
    const orderRef = (isPP ? 'PP-' : 'COD-') + Date.now().toString().slice(-6)
    const defaultPrice = pageData.offer_price ? parseFloat(String(pageData.offer_price)) : 0
    const enteredAmount = parseFloat(customAmountInput)
    const orderAmount = !isNaN(enteredAmount) && enteredAmount > 0 ? enteredAmount : defaultPrice

    const formattedNote = `[${isPP ? '📱 พร้อมเพย์' : '🚚 COD'}: ${pageData.title}] ยอด: ฿${orderAmount.toLocaleString()} บาท${orderForm.line_id ? ` | LINE: ${orderForm.line_id}` : ''} | ที่อยู่จัดส่ง: ${orderForm.address || '-'}${orderForm.note ? ` | โน้ต: ${orderForm.note}` : ''}`

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: pageData.user_id,
          landing_page_id: pageData.id,
          name: orderForm.name.trim(),
          phone: orderForm.phone.trim(),
          line_id: orderForm.line_id.trim() || null,
          address: orderForm.address ? orderForm.address.trim() : null,
          amount: orderAmount || null,
          payment_method: orderForm.payment_method,
          slip_url: orderForm.slip_url || null,
          order_code: orderRef,
          note: formattedNote,
          utm: getStoredUTMParams(),
          line_channel_access_token: ownerProfile?.line_channel_access_token || pageData.profiles?.line_channel_access_token || null,
          line_user_id: ownerProfile?.line_user_id || pageData.profiles?.line_user_id || null,
          line_webhook_url: ownerProfile?.line_webhook_url || pageData.profiles?.line_webhook_url || null,
          line_notify_token: ownerProfile?.line_notify_token || pageData.profiles?.line_notify_token || null
        })
      })

      // Trigger tracking pixel event & CAPI
      trackPixelEvent('Purchase', {
        content_name: pageData.title,
        value: orderAmount,
        currency: 'THB',
        order_code: orderRef,
        payment_method: orderForm.payment_method
      }, { 
        userId: pageData.user_id, 
        landingPageId: pageData.id, 
        fbPixelId: pageData.fb_pixel_id || ownerProfile?.fb_pixel_id || null,
        tiktokPixelId: pageData.tiktok_pixel_id || ownerProfile?.tiktok_pixel_id || null,
        metaCapiToken: ownerProfile?.meta_capi_token || null,
        phone: orderForm.phone.trim()
      })

      setOrderSuccess(true)
      setLocalSlipPreview(null)
      setOrderForm({ name: '', phone: '', line_id: '', address: '', note: '', payment_method: 'promptpay', slip_url: '' })
    } catch (e) {
      // Fallback insert on client
      try {
        await supabase.from('leads').insert([{
          user_id: pageData.user_id,
          name: orderForm.name.trim(),
          phone: orderForm.phone.trim(),
          line_id: orderForm.line_id.trim() || null,
          address: orderForm.address ? orderForm.address.trim() : null,
          note: formattedNote
        }])
      } catch (err) {}
      setOrderSuccess(true)
      setOrderForm({ name: '', phone: '', line_id: '', address: '', note: '' })
    } finally {
      setOrdering(false)
    }
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-3xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
          <span className="text-xs font-bold text-slate-300">กำลังโหลดหน้าข้อเสนอพิเศษ...</span>
        </div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-4 text-center text-slate-400">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1.5">ไม่พบหน้า Landing Page นี้</h2>
        <p className="text-xs text-slate-400 max-w-xs">ลิงก์อาจยังไม่เปิดใช้งาน หรือ URL ไม่ถูกต้อง</p>
        <a href="/" className="mt-6 px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-2xl text-xs">
          กลับหน้าหลัก
        </a>
      </div>
    )
  }

  // 1-Month Expiration Enforcement (หน้าเซลเพจหมดอายุ 30 วันจะถูกล็อคการแสดงผล)
  const createdTime = pageData?.created_at ? new Date(pageData.created_at).getTime() : Date.now()
  const expiryTime = pageData?.expires_at ? new Date(pageData.expires_at).getTime() : (createdTime + 30 * 24 * 60 * 60 * 1000)
  const isPageExpired = expiryTime <= Date.now()

  if (isPageExpired) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
          <Lock className="w-10 h-10" />
        </div>
        <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
          LANDING PAGE EXPIRED (30 DAYS)
        </div>
        <h2 className="text-2xl font-black text-white mb-2">หน้าเซลเพจนี้หมดอายุการใช้งานชั่วคราว</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
          หน้าเซลเพจนี้ครบกำหนดระยะเวลาการแสดงผล 30 วันแล้ว เจ้าของร้านสามารถเข้าสู่ระบบ Dashboard เพื่อใช้ 350 แต้มต่ออายุการแสดงผลได้ทันทีครับ
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={`/${ownerProfile?.username || ''}`} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs transition">
            ดูหน้า Bio Link ร้านค้า
          </a>
          <a href="/login" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold rounded-2xl text-xs transition shadow-lg shadow-purple-600/25">
            เข้าสู่ระบบเพื่อต่ออายุ (Dashboard)
          </a>
        </div>
      </div>
    )
  }

  const resolvedImageUrl = pageData.hero_image_url || (pageData.hero_media_type !== 'youtube' ? pageData.hero_media_url : null)
  const resolvedVideoUrl = pageData.video_url || (pageData.hero_media_type === 'youtube' ? pageData.hero_media_url : null)
  const embedVideoUrl = getYouTubeEmbedUrl(resolvedVideoUrl)
  const featuresList = Array.isArray(pageData.features) ? pageData.features : []
  const rawGallery = Array.isArray(pageData.gallery_images) ? pageData.gallery_images : []
  const galleryImagesList = rawGallery
    .map((s: any) => String(s || '').trim())
    .filter((s: string) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:image'))

  const rawReviews = Array.isArray(pageData.review_images) ? pageData.review_images : []
  const reviewImagesList = rawReviews
    .map((s: any) => String(s || '').trim())
    .filter((s: string) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:image'))

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }
  const painPointsList = Array.isArray(pageData.pain_points) ? pageData.pain_points : []
  const benefitsList = Array.isArray(pageData.benefits) ? pageData.benefits : []
  const testimonialsList = Array.isArray(pageData.testimonials) ? pageData.testimonials : []
  const faqsList = Array.isArray(pageData.faqs) ? pageData.faqs : []

  const themeColor = pageData.theme_color || '#EF4444'
  const bgColor = pageData.bg_color || '#0B0F17'
  const isLightBg = Boolean(bgColor && ['#ffffff', '#f9f9ff', '#f1f5f9', 'white'].includes(bgColor.toLowerCase().trim()))
  const textColor = pageData.text_color || (isLightBg ? '#0F172A' : '#FFFFFF')
  const subtextColor = pageData.subtext_color || (isLightBg ? '#334155' : '#E2E8F0')

  return (
    <div 
      className={`min-h-screen font-sans antialiased pb-28 overflow-x-hidden relative transition-colors duration-300 ${
        isLightBg ? 'text-slate-900' : 'text-slate-100'
      }`}
      style={{
        backgroundColor: bgColor,
        ...(pageData.bg_image_url ? { 
          backgroundImage: `url(${pageData.bg_image_url})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        } : {})
      }}
    >
      {/* Background Image Overlay (Vibrant & Readable) */}
      {pageData.bg_image_url && (
        <div className={`absolute inset-0 pointer-events-none z-0 ${
          isLightBg 
            ? 'bg-white/80 backdrop-blur-[2px]' 
            : 'bg-black/70 backdrop-blur-[2px] bg-gradient-to-b from-black/60 via-[#0B0F17]/75 to-black/85'
        }`}></div>
      )}
      
      {/* 1. AUTO INJECT TRACKING PIXELS (Meta FB, TikTok, Google, LINE) */}
      <TrackingPixels
        userId={pageData.user_id || ownerProfile?.id || null}
        landingPageId={pageData.id || null}
        fbPixelId={pageData.fb_pixel_id || ownerProfile?.fb_pixel_id || null}
        tiktokPixelId={pageData.tiktok_pixel_id || ownerProfile?.tiktok_pixel_id || null}
        googlePixelId={pageData.google_pixel_id || ownerProfile?.google_pixel_id || null}
        lineTagId={pageData.line_tag_id || ownerProfile?.line_tag_id || null}
        metaCapiToken={pageData.meta_capi_token || ownerProfile?.meta_capi_token || null}
      />

      {/* 2. FLASH SALE COUNTDOWN HEADER BAR */}
      <header className="sticky top-0 z-40 text-white py-2.5 px-4 shadow-xl text-center" style={{ backgroundColor: themeColor }}>
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-black">
          <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
          <span>ข้อเสนอพิเศษ Flash Sale จำกัดเวลา!</span>
          <div className="bg-black/50 px-2.5 py-0.5 rounded-lg font-mono text-yellow-300 border border-yellow-300/30 flex items-center gap-1 shadow-inner">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* 3. MAIN DIRECT-RESPONSE 6-SECTION BODY */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
        
        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION (Above the Fold) */}
        {/* ========================================================================= */}
        <section className="space-y-5 text-center relative z-10">
          
          {/* Brand Pill */}
          {ownerProfile && (
            <div className="flex items-center justify-center gap-2">
              <img
                src={ownerProfile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${ownerProfile.username}`}
                alt={ownerProfile.username}
                className="w-7 h-7 rounded-full object-cover border border-slate-700 shadow"
              />
              <span className="text-xs font-bold text-slate-300">
                {ownerProfile.full_name || ownerProfile.username}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full font-bold">
                ✓ Verified Store
              </span>
            </div>
          )}

          {/* Headline & Subheadline */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {pageData.headline}
            </h1>
            {pageData.subheadline && (
              <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                {pageData.subheadline}
              </p>
            )}
          </div>

          {/* Hero Media: Supports BOTH Image Banner & YouTube Video */}
          <div className="space-y-4">
            {/* 1. Hero Product Image Banner */}
            {resolvedImageUrl && (
              <div className="rounded-[32px] overflow-hidden border-2 border-slate-800 shadow-2xl bg-black">
                <img src={resolvedImageUrl} alt={pageData.title} className="w-full h-auto object-cover max-h-[500px]" />
              </div>
            )}

            {/* 2. Featured YouTube / TikTok-style Video */}
            {embedVideoUrl && (
              <div className="rounded-[32px] overflow-hidden border-2 border-slate-800 shadow-2xl bg-black aspect-video w-full">
                <iframe src={embedVideoUrl} title="Sales Video" className="w-full h-full" allowFullScreen></iframe>
              </div>
            )}
          </div>

          {/* Product Gallery Album (รูปภาพสินค้าเพิ่มเติม) */}
          {galleryImagesList.length > 0 && (
            <div className="space-y-3 pt-2 text-left">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isLightBg ? 'text-slate-800' : 'text-slate-300'}`}>
                  📸 แกลเลอรีรูปภาพสินค้าเพิ่มเติม ({galleryImagesList.length} รูป)
                </span>
                <span className="text-xs text-purple-400 font-bold">แตะเพื่อดูรูปขยาย</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {galleryImagesList.map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(galleryImagesList, idx)}
                    className="aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-black cursor-pointer hover:opacity-90 hover:scale-102 transition shadow-md group relative"
                  >
                    <img src={imgUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3 Action Buttons in Hero Section */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => handleCtaClick(pageData.sticky_btn1_url || pageData.cta_url, 'InitiateCheckout')}
              style={{ backgroundColor: themeColor }}
              className="w-full py-4 hover:opacity-95 text-white font-black rounded-2xl text-base sm:text-lg transition shadow-xl flex items-center justify-center gap-2 active:scale-98 animate-pulse"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{pageData.sticky_btn1_text || pageData.cta_text || 'ติดต่อสั่งซื้อด่วน'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleCtaClick(pageData.sticky_btn2_url || pageData.cta_secondary_url || `/${ownerProfile?.username || ''}`, 'Contact')}
                className={`py-3 px-3.5 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 border transition active:scale-95 shadow-sm ${
                  isLightBg ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50' : 'bg-slate-900/90 text-slate-100 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="truncate">{pageData.sticky_btn2_text || pageData.cta_secondary_text || 'ช่องทางติดต่ออื่นๆ'}</span>
              </button>

              <button
                onClick={() => handleCtaClick(pageData.sticky_btn3_url || pageData.cta_shop_url || pageData.cta_url, 'InitiateCheckout')}
                className="py-3 px-3.5 bg-[#34D399] hover:bg-[#10B981] text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="truncate">{pageData.sticky_btn3_text || pageData.cta_shop_text || 'สั่งซื้อออนไลน์'}</span>
              </button>
            </div>
          </div>

          {/* Trust Badges (Fully Customizable per Shop) */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold pt-1">
            <div 
              style={{ color: textColor }} 
              className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 shadow-md ${
                isLightBg ? 'bg-white/95 border-slate-200 shadow-sm' : 'bg-slate-900/95 border-slate-800 shadow-lg'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>{pageData.trust_badge_1 || 'จัดส่งด่วนฟรี'}</span>
            </div>
            <div 
              style={{ color: textColor }} 
              className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 shadow-md ${
                isLightBg ? 'bg-white/95 border-slate-200 shadow-sm' : 'bg-slate-900/95 border-slate-800 shadow-lg'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{pageData.trust_badge_2 || 'รับประกันของแท้'}</span>
            </div>
            <div 
              style={{ color: textColor }} 
              className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 shadow-md ${
                isLightBg ? 'bg-white/95 border-slate-200 shadow-sm' : 'bg-slate-900/95 border-slate-800 shadow-lg'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{pageData.trust_badge_3 || 'ชำระเงินปลอดภัย'}</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: PAIN POINT & AGITATION (ขยี้ปัญหาที่ลูกค้าเจอ) */}
        {/* ========================================================================= */}
        {painPointsList.length > 0 && (
          <section className="bg-gradient-to-b from-rose-950/60 via-slate-900/90 to-slate-950/95 border-2 border-rose-500/30 rounded-[32px] p-6 sm:p-7 space-y-4 shadow-2xl backdrop-blur-md relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="font-extrabold text-base sm:text-lg text-rose-200">
                {pageData.pain_headline || 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?'}
              </h2>
            </div>

            <div className="space-y-2.5 pt-1">
              {painPointsList.map((pain: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-white font-bold leading-relaxed bg-rose-950/70 p-4 rounded-2xl border border-rose-800/80 shadow-md">
                  <span className="text-rose-400 font-bold shrink-0 text-base">❌</span>
                  <span>{pain}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: SOLUTION & BENEFITS (นำเสนอทางแก้และผลลัพธ์) */}
        {/* ========================================================================= */}
        {benefitsList.length > 0 && (
          <section className="bg-slate-900/90 border-2 border-emerald-500/30 rounded-[32px] p-6 sm:p-7 space-y-4 shadow-2xl backdrop-blur-md relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 style={{ color: textColor }} className="font-extrabold text-base sm:text-lg">
                {pageData.benefits_headline || 'ทางออกและผลลัพธ์ที่คุณจะได้รับ'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {benefitsList.map((benefit: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-white font-bold leading-relaxed bg-slate-900/90 p-4 rounded-2xl border border-slate-700 shadow-md">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* CUSTOMER REVIEW PHOTO ALBUM (แสดงเฉพาะเมื่อเปิดใช้งานและมีรูปภาพจริง) */}
        {/* ========================================================================= */}
        {reviewImagesList.length > 0 && (
          <section className={`rounded-[32px] p-6 sm:p-8 space-y-4 border shadow-xl ${
            isLightBg ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 
                  style={{ color: isLightBg ? '#0F172A' : '#FFFFFF' }}
                  className="font-black text-base sm:text-lg tracking-tight drop-shadow-sm"
                >
                  📸 รูปภาพรีวิวและการใช้งานจริงจากลูกค้า ({reviewImagesList.length} รูป)
                </h2>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                แตะดูรูปขยาย
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {reviewImagesList.map((imgUrl: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(reviewImagesList, idx)}
                  className="aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-black cursor-pointer hover:opacity-90 hover:scale-102 transition shadow-lg relative group"
                >
                  <img src={imgUrl} alt={`Customer Review ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                    🔍 แตะดูรูปขยาย
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: SOCIAL PROOF & TRUST (รีวิวและความมั่นใจ) */}
        {/* ========================================================================= */}
        {testimonialsList.length > 0 && (
          <section className="bg-slate-900/90 border-2 border-amber-500/30 rounded-[32px] p-6 sm:p-7 space-y-4 shadow-2xl backdrop-blur-md relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <h2 style={{ color: textColor }} className="font-extrabold text-base sm:text-lg">เสียงตอบรับจากลูกค้าจริง</h2>
              </div>
              <span className="text-xs text-amber-400 font-bold font-mono bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
                ★★★★★ 4.9/5
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {testimonialsList.map((rev: string, idx: number) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2 shadow-sm">
                  <div className="flex text-amber-400 text-xs font-mono">★★★★★ (ยืนยันการซื้อจริง)</div>
                  <p className="italic leading-relaxed">"{rev}"</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Guarantee Banner */}
        {pageData.guarantee_text && (
          <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/80 border-2 border-emerald-400/40 rounded-[28px] text-center flex items-center justify-center gap-3 text-xs sm:text-sm font-black text-emerald-300 shadow-2xl backdrop-blur-md relative z-10">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{pageData.guarantee_text}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: PRICING & THE OFFER (ยื่นข้อเสนอที่ปฏิเสธไม่ได้) */}
        {/* ========================================================================= */}
        <section style={{ borderColor: themeColor, backgroundColor: isLightBg ? "#FFFFFF" : "#0F172A" }} className="border-2 rounded-[32px] p-6 sm:p-8 shadow-2xl text-center space-y-5 relative overflow-hidden">
          <div style={{ backgroundColor: themeColor }} className="absolute top-0 right-0 text-white font-black text-xs px-4 py-1.5 rounded-bl-2xl shadow">
            🔥 SPECIAL DEAL
          </div>

          <div className="space-y-1 pt-2">
            <span className="text-xs sm:text-sm text-slate-400 font-bold">ราคาพิเศษเฉพาะช่วงโปรโมชั่น Flash Sale</span>
            <div className="flex items-center justify-center gap-3">
              {pageData.original_price && (
                <span className="text-lg sm:text-2xl text-slate-500 line-through font-mono">
                  ฿{parseFloat(pageData.original_price).toLocaleString()}
                </span>
              )}
              <span className="text-4xl sm:text-6xl font-black text-rose-400 font-mono drop-shadow">
                ฿{pageData.offer_price ? parseFloat(pageData.offer_price).toLocaleString() : '990'}
              </span>
            </div>
          </div>

          {/* Bullet Point Highlights */}
          {featuresList.length > 0 && (
            <div className="text-left space-y-2.5 py-2 max-w-md mx-auto">
              {featuresList.map((feat: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* 3 Order / Contact Action Buttons in Pricing Section */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleCtaClick(pageData.sticky_btn1_url || pageData.cta_url, 'InitiateCheckout')}
              style={{ backgroundColor: themeColor }}
              className="w-full py-4 sm:py-5 hover:opacity-95 text-white font-black rounded-2xl text-base sm:text-xl transition shadow-xl flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{pageData.sticky_btn1_text || pageData.cta_text || 'ติดต่อสั่งซื้อด่วน'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCtaClick(pageData.sticky_btn2_url || pageData.cta_secondary_url || `/${ownerProfile?.username || ''}`, 'Contact')}
                className={`py-3 px-3.5 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 border transition active:scale-95 shadow-sm ${
                  isLightBg ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200' : 'bg-slate-900 text-slate-100 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="truncate">{pageData.sticky_btn2_text || pageData.cta_secondary_text || 'ช่องทางติดต่ออื่นๆ'}</span>
              </button>

              <button
                onClick={() => handleCtaClick(pageData.sticky_btn3_url || pageData.cta_shop_url || pageData.cta_url, 'InitiateCheckout')}
                className="py-3 px-3.5 bg-[#34D399] hover:bg-[#10B981] text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="truncate">{pageData.sticky_btn3_text || pageData.cta_shop_text || 'สั่งซื้อออนไลน์'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Detailed Sales Body Copy */}
        {pageData.body_content && (
          <article className="bg-slate-900/90 border border-slate-800 rounded-[32px] p-6 sm:p-8 text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line shadow-lg">
            {pageData.body_content}
          </article>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: FAQ & FINAL CTA (เคลียร์ข้อสงสัย & ปิดการขาย) */}
        {/* ========================================================================= */}
        {faqsList.length > 0 && (
          <section className="bg-slate-900/90 border-2 border-purple-500/30 rounded-[32px] p-6 sm:p-7 space-y-4 shadow-2xl backdrop-blur-md relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 style={{ color: textColor }} className="font-extrabold text-base sm:text-lg">คำถามที่พบบ่อย (FAQ)</h2>
            </div>

            <div className="space-y-2.5 pt-1">
              {faqsList.map((faqLine: string, idx: number) => {
                const parts = faqLine.split('|')
                const q = parts[0] ? parts[0].trim() : faqLine
                const a = parts[1] ? parts[1].trim() : 'ติดต่อสอบถามข้อมูลเพิ่มเติมกับเจ้าหน้าที่ได้ตลอด 24 ชม.'
                const isOpen = openFaq === idx
                return (
                  <div key={idx} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs sm:text-sm">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-extrabold text-white dark:text-white flex items-center justify-between transition text-sm sm:text-base"
                    >
                      <span>Q: {q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-slate-100 dark:text-slate-100 border-t border-slate-800 pt-3 leading-relaxed text-xs sm:text-sm font-medium bg-slate-900/50">
                        A: {a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* INSTANT CHECKOUT FORM (พร้อมเพย์ QR ตามยอดของเจ้าของร้าน + เก็บเงินปลายทาง COD + แนบสลิป + แจ้งเตือนเข้า LINE) */}
        {Boolean(pageData.enable_cod_form) && (() => {
          const ownerPPPhone = pageData.promptpay_phone || ownerProfile?.promptpay_phone || '0909964514'
          const ownerPPName = pageData.promptpay_name || ownerProfile?.full_name || ownerProfile?.username || 'เจ้าของร้านค้า'
          const ownerPPBank = pageData.promptpay_bank || 'พร้อมเพย์ (PromptPay)'
          const defaultPrice = pageData.offer_price ? parseFloat(String(pageData.offer_price)) : 0
          const enteredAmt = parseFloat(customAmountInput)
          const currentPayAmount = !isNaN(enteredAmt) && enteredAmt > 0 ? enteredAmt : defaultPrice
          const isPromptPay = orderForm.payment_method === 'promptpay'
          const canSubmit = !ordering && !uploadingSlip && (!isPromptPay || Boolean(orderForm.slip_url || localSlipPreview))

          return (
            <section id="order-section" className={`border-2 rounded-[36px] p-6 sm:p-9 shadow-2xl space-y-6 backdrop-blur-2xl relative z-10 transition-all duration-300 ${
              isLightBg 
                ? 'bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/60' 
                : 'bg-gradient-to-b from-slate-900/95 via-[#0F172A]/95 to-[#0B0F17]/98 border-slate-700/80 text-white shadow-2xl ring-1 ring-white/10'
            }`}>
              {/* Header with verified badge */}
              <div className="text-center border-b border-slate-700/60 pb-4 space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ระบบสั่งซื้อปลอดภัย 100% • แจ้งเตือนเข้า LINE เจ้าหน้าที่</span>
                </div>
                <h3 className={`text-xl sm:text-3xl font-black tracking-tight ${isLightBg ? 'text-slate-950' : 'text-white'}`}>
                  🛒 กรอกข้อมูลสั่งซื้อสินค้า & ชำระเงิน
                </h3>
                <p className={`text-xs sm:text-sm font-medium ${isLightBg ? 'text-slate-600' : 'text-slate-300'}`}>
                  เลือกวิธีชำระเงิน กรอกที่อยู่จัดส่ง และกดยืนยันออเดอร์เพื่อรับโปรโมชั่นพิเศษ
                </p>
              </div>

              {orderSuccess ? (
                <div className="p-8 sm:p-10 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-3xl text-center space-y-3 shadow-xl animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="font-black text-xl sm:text-2xl text-white">บันทึกการสั่งซื้อเรียบร้อยแล้ว! 🎉</h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md mx-auto">
                    ระบบได้ส่งข้อมูลออเดอร์และสลิปโอนเงินแจ้งเตือนไปยังเจ้าหน้าที่เรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันการจัดส่งโดยเร็วที่สุดครับ
                  </p>
                  <button
                    type="button"
                    onClick={() => setOrderSuccess(false)}
                    className="mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition shadow"
                  >
                    + สั่งซื้อเพิ่มอีกรายการ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-5 text-xs sm:text-sm font-bold">
                  
                  {/* 1. PAYMENT METHOD SWITCHER CARDS */}
                  <div className="space-y-2">
                    <label className={`block font-black text-xs sm:text-sm ${isLightBg ? 'text-slate-800' : 'text-slate-200'}`}>
                      1. เลือกวิธีการชำระเงิน *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderForm({ ...orderForm, payment_method: 'promptpay' })}
                        className={`p-4 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center gap-3 transition-all active:scale-98 cursor-pointer relative overflow-hidden text-left ${
                          isPromptPay
                            ? 'border-emerald-500 bg-gradient-to-r from-emerald-500/25 to-teal-500/15 text-emerald-300 shadow-lg ring-2 ring-emerald-500/30'
                            : isLightBg ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${isPromptPay ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-white'}`}>
                          📱
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-white">โอนเงินพร้อมเพย์ QR</span>
                            {isPromptPay && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>}
                          </div>
                          <span className="text-[11px] font-medium text-emerald-400 block mt-0.5">สแกนจ่ายตามยอดทันที • มี QR</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderForm({ ...orderForm, payment_method: 'cod' })}
                        className={`p-4 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center gap-3 transition-all active:scale-98 cursor-pointer relative overflow-hidden text-left ${
                          !isPromptPay
                            ? 'border-emerald-500 bg-gradient-to-r from-emerald-500/25 to-teal-500/15 text-emerald-300 shadow-lg ring-2 ring-emerald-500/30'
                            : isLightBg ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${!isPromptPay ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-white'}`}>
                          🚚
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-white">เก็บเงินปลายทาง (COD)</span>
                            {!isPromptPay && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>}
                          </div>
                          <span className="text-[11px] font-medium text-slate-400 block mt-0.5">ชำระเงินเมื่อพนักงานส่งมอบสินค้า</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 2. DYNAMIC PROMPTPAY QR CODE & SLIP ATTACHMENT BOX */}
                  {isPromptPay && (
                    <div className={`p-5 sm:p-6 rounded-3xl border-2 border-emerald-500/40 space-y-5 text-center shadow-xl ${
                      isLightBg ? 'bg-emerald-50/70' : 'bg-gradient-to-b from-slate-900/95 to-slate-950/98'
                    }`}>
                      
                      {/* Merchant Account Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/20 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                            🏦
                          </div>
                          <div>
                            <div className="font-black text-sm text-emerald-400 flex items-center gap-1.5">
                              <span>บัญชีรับเงินพร้อมเพย์ของร้านค้า</span>
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">EMVCo</span>
                            </div>
                            <div className="text-xs text-slate-200 font-bold">{ownerPPName} • {ownerPPBank}</div>
                            <div className="text-xs font-mono text-emerald-300 font-black">{ownerPPPhone}</div>
                          </div>
                        </div>

                        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-2xl text-right sm:text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block">ยอดที่ต้องชำระ</span>
                          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                            ฿{currentPayAmount.toLocaleString()} บาท
                          </span>
                        </div>
                      </div>

                      {/* Custom Amount Input */}
                      <div className="space-y-1.5 text-left max-w-md mx-auto">
                        <label className="block text-xs font-black text-slate-200 flex items-center justify-between">
                          <span>💰 ยอดเงินที่ต้องการโอน (บาท)</span>
                          <span className="text-[10px] text-slate-400 font-medium">ราคาโปรโมชั่น: ฿{defaultPrice.toLocaleString()}</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-base">฿</span>
                          <input
                            type="number"
                            step="any"
                            placeholder={`ระบุยอดเงิน (หากไม่กรอกจะคิด ฿${defaultPrice.toLocaleString()})`}
                            value={customAmountInput}
                            onChange={(e) => setCustomAmountInput(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 bg-slate-950 border-2 border-slate-700 rounded-2xl text-sm font-mono font-black text-emerald-400 focus:outline-none focus:border-emerald-400 shadow-inner"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          💡 เมื่อพิมพ์เปลี่ยนยอดเงิน QR Code ด้านล่างจะคำนวณยอดใหม่ให้สแกนจ่ายทันทีแบบ Real-Time
                        </p>
                      </div>

                      {/* Dynamic PromptPay QR Code Image */}
                      <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl mx-auto border-2 border-slate-200">
                        <img
                          src={getPromptPayQRImageUrl(ownerPPPhone, currentPayAmount, 220)}
                          alt="PromptPay QR Code"
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto"
                        />
                        <div className="mt-2 text-slate-900 font-black text-sm font-mono">
                          สแกนจ่าย ฿{currentPayAmount.toLocaleString()} บาท
                        </div>
                        <div className="text-xs text-slate-600 font-bold">{ownerPPName}</div>
                      </div>

                      {/* Modern Slip Upload Dropzone Area */}
                      <div className="space-y-2 text-left max-w-md mx-auto pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                            <Upload className="w-4 h-4 text-emerald-400" />
                            <span>แนบรูปสลิปโอนเงิน *</span>
                          </label>
                          <span className="text-[10px] text-emerald-400 font-bold">
                            {(orderForm.slip_url || localSlipPreview) ? '✓ แนบสลิปเรียบร้อย' : '(จำเป็นสำหรับการโอนพร้อมเพย์)'}
                          </span>
                        </div>

                        {/* Upload trigger button / Dragzone */}
                        <label className={`w-full p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md group ${
                          (orderForm.slip_url || localSlipPreview) 
                            ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300' 
                            : 'bg-slate-950/80 hover:bg-slate-900 border-slate-700 hover:border-emerald-500/70 text-slate-300'
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition group-hover:scale-110 ${(orderForm.slip_url || localSlipPreview) ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'}`}>
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="text-center">
                            <span className="font-extrabold text-xs sm:text-sm block text-white">
                              {uploadingSlip ? 'กำลังอัปโหลดสลิป...' : ((orderForm.slip_url || localSlipPreview) ? '✓ เปลี่ยนรูปภาพสลิปโอนเงิน' : 'แตะเพื่อเลือกรูปสลิปโอนเงิน')}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                              รองรับไฟล์ JPG, PNG, สลิปจากแอปธนาคารทุกธนาคาร
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSlipUpload}
                            className="hidden"
                          />
                        </label>

                        {/* Uploaded Slip Preview Card */}
                        {(orderForm.slip_url || localSlipPreview) && (
                          <div className="p-3 bg-slate-950 rounded-2xl border border-emerald-500/50 flex items-center justify-between gap-3 shadow-lg animate-in fade-in">
                            <div className="flex items-center gap-3 truncate">
                              <img 
                                src={localSlipPreview || orderForm.slip_url || ''} 
                                alt="Slip Preview" 
                                className="w-14 h-14 object-cover rounded-xl border border-slate-700 shadow shrink-0" 
                              />
                              <div className="truncate">
                                <div className="text-emerald-400 font-black text-xs flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>แนบรูปสลิปสำเร็จ</span>
                                </div>
                                <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                                  สลิปจะถูกส่งแจ้งเตือนเข้า LINE เจ้าของร้านทันที
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => { setOrderForm(prev => ({ ...prev, slip_url: '' })); setLocalSlipPreview(null); }}
                              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                            >
                              ลบรูป
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. CUSTOMER INFORMATION INPUT FIELDS */}
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className={`block mb-1.5 font-black text-xs sm:text-sm ${isLightBg ? 'text-slate-800' : 'text-slate-200'}`}>
                        ชื่อ-นามสกุล ผู้รับสินค้า *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น สมชาย ใจดี"
                        value={orderForm.name}
                        onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-medium transition focus:outline-none border-2 shadow-sm ${
                          isLightBg 
                            ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white' 
                            : 'bg-[#1E293B] border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:bg-[#0F172A]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block mb-1.5 font-black text-xs sm:text-sm ${isLightBg ? 'text-slate-800' : 'text-slate-200'}`}>
                        เบอร์โทรศัพท์สำหรับติดต่อ *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="081-xxx-xxxx"
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-mono font-medium transition focus:outline-none border-2 shadow-sm ${
                          isLightBg 
                            ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white' 
                            : 'bg-[#1E293B] border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:bg-[#0F172A]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block mb-1.5 font-black text-xs sm:text-sm flex items-center justify-between ${isLightBg ? 'text-slate-800' : 'text-slate-200'}`}>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#06C755]"></span>
                          <span>LINE ID สำหรับติดต่อ (ถ้ามี)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">แอดเพื่อแจ้งสถานะจัดส่ง</span>
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น @yourshop หรือ line_id"
                        value={orderForm.line_id}
                        onChange={(e) => setOrderForm({ ...orderForm, line_id: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-medium transition focus:outline-none border-2 shadow-sm ${
                          isLightBg 
                            ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white' 
                            : 'bg-[#1E293B] border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:bg-[#0F172A]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block mb-1.5 font-black text-xs sm:text-sm ${isLightBg ? 'text-slate-800' : 'text-slate-200'}`}>
                        ที่อยู่สำหรับจัดส่งสินค้า *
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
                        value={orderForm.address}
                        onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-medium transition focus:outline-none border-2 shadow-sm leading-relaxed ${
                          isLightBg 
                            ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white' 
                            : 'bg-[#1E293B] border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:bg-[#0F172A]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block mb-1.5 font-black text-xs sm:text-sm ${isLightBg ? 'text-slate-800' : 'text-slate-200'}`}>
                        หมายเหตุเพิ่มเติม (ถ้ามี)
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น ฝากไว้หน้าบ้าน, โทรแจ้งก่อนส่ง"
                        value={orderForm.note}
                        onChange={(e) => setOrderForm({ ...orderForm, note: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-medium transition focus:outline-none border-2 shadow-sm ${
                          isLightBg 
                            ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white' 
                            : 'bg-[#1E293B] border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:bg-[#0F172A]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 4. LUXURIOUS HIGH-CONVERTING E-COMMERCE CTA BUTTON */}
                  <div className="pt-3">
                    {canSubmit ? (
                      <button
                        type="submit"
                        className="w-full py-4.5 sm:py-5 px-5 sm:px-7 bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-slate-950 font-black rounded-3xl text-sm sm:text-base transition-all duration-200 shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 ring-4 ring-emerald-400/30 flex items-center justify-between gap-3 active:scale-[0.98] cursor-pointer relative overflow-hidden group"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-11 h-11 rounded-2xl bg-slate-950/15 text-slate-950 flex items-center justify-center font-black shadow-inner shrink-0">
                            <ShoppingBag className="w-5 h-5 text-slate-950" />
                          </div>
                          <div>
                            <span className="block font-black text-sm sm:text-base leading-tight tracking-tight text-slate-950">
                              ยืนยันการสั่งซื้อโปรโมชั่นนี้
                            </span>
                            <span className="text-[11px] font-bold opacity-85 block text-slate-900 mt-0.5">
                              {isPromptPay ? '✓ ชำระเงินโอนพร้อมเพย์แนบสลิป' : '✓ เก็บเงินปลายทาง (COD) ชำระเมื่อรับของ'}
                            </span>
                          </div>
                        </div>

                        <div className="px-3.5 py-2 bg-slate-950 text-emerald-400 rounded-2xl font-mono font-black text-sm sm:text-base flex items-center gap-1.5 shadow-md shrink-0">
                          <span>฿{currentPayAmount.toLocaleString()}</span>
                          <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ) : (
                      <div className="w-full py-4.5 px-5 bg-amber-500/15 border-2 border-amber-500/40 text-amber-200 rounded-3xl text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2.5 shadow-lg">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <span className="text-left">กรุณาแตะแนบรูปสลิปโอนเงินด้านบน เพื่อปลดล็อกปุ่มยืนยันการสั่งซื้อ</span>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </section>
          )
        })()}

      </main>

      {/* 4. STICKY BOTTOM MOBILE 3 CONVERSION ACTION BUTTONS */}
      <aside 
        style={{ 
          backgroundColor: isLightBg ? "#FFFFFFFA" : "#0B0F17FA", 
          borderColor: isLightBg ? "#E2E8F0" : "#1E293B" 
        }} 
        className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-2xl p-2 px-3 shadow-2xl"
      >
        <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
          
          {/* Price Box */}
          <div className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center shrink-0 min-w-[58px]">
            <span className="text-[8px] text-slate-400 block leading-none">ราคาพิเศษ</span>
            <span className="text-xs sm:text-sm font-black font-mono" style={{ color: themeColor }}>
              ฿{pageData.offer_price ? parseFloat(pageData.offer_price).toLocaleString() : '990'}
            </span>
          </div>

          {/* Button 1: ติดต่อสั่งซื้อด่วน (Primary Theme Color) */}
          <button
            onClick={() => handleCtaClick(pageData.sticky_btn1_url || pageData.cta_url, 'InitiateCheckout')}
            style={{ backgroundColor: themeColor }}
            className="flex-1 py-2.5 px-2.5 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-md transition text-center truncate active:scale-95 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-yellow-300 animate-bounce shrink-0" />
            <span className="truncate">{pageData.sticky_btn1_text || pageData.cta_text || 'ติดต่อสั่งซื้อด่วน'}</span>
          </button>

          {/* Button 2: ช่องทางติดต่ออื่นๆ (Secondary Dark / Glass) */}
          <button
            onClick={() => handleCtaClick(pageData.sticky_btn2_url || pageData.cta_secondary_url || `/${ownerProfile?.username || ''}`, 'Contact')}
            className={`flex-1 py-2.5 px-2 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border transition text-center truncate active:scale-95 cursor-pointer ${
              isLightBg ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200' : 'bg-slate-900 text-slate-100 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{pageData.sticky_btn2_text || pageData.cta_secondary_text || 'ช่องทางติดต่ออื่นๆ'}</span>
          </button>

          {/* Button 3: สั่งซื้อออนไลน์ (Green) */}
          <button
            onClick={() => handleCtaClick(pageData.sticky_btn3_url || pageData.cta_shop_url || pageData.cta_url, 'InitiateCheckout')}
            className="flex-1 py-2.5 px-2.5 bg-[#34D399] hover:bg-[#10B981] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow transition text-center truncate active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{pageData.sticky_btn3_text || pageData.cta_shop_text || 'สั่งซื้อออนไลน์'}</span>
          </button>

        </div>
      </aside>

      {/* Fullscreen Interactive Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  )
}
