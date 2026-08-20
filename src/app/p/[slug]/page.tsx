'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import TrackingPixels, { trackPixelEvent } from '@/components/TrackingPixels'
import ImageLightboxModal from '@/components/ImageLightboxModal'
import { 
  ShoppingBag, Check, Flame, Clock, ShieldCheck, Truck, 
  Sparkles, ArrowRight, Phone, Send, CheckCircle2, Star, 
  Share2, AlertCircle, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, Lock
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
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', note: '' })
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

  const handleCtaClick = async (url: string) => {
    if (!pageData) return

    // Track Pixel conversion event
    trackPixelEvent('InitiateCheckout', {
      content_name: pageData.title,
      value: pageData.offer_price || 0,
      currency: 'THB'
    }, { userId: pageData.user_id, landingPageId: pageData.id, pixelId: pageData.fb_pixel_id || ownerProfile?.fb_pixel_id || null })

    // Record click count
    try {
      await supabase.rpc('increment_landing_page_clicks', { page_id: pageData.id })
    } catch (e) {}

    window.open(url, '_blank')
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderForm.name || !orderForm.phone || !pageData) return

    setOrdering(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: pageData.user_id,
          name: orderForm.name,
          phone: orderForm.phone,
          note: `[สั่งซื้อจากหน้าเซลเพจ: ${pageData.title}] ที่อยู่: ${orderForm.address || '-'} ข้อความ: ${orderForm.note || '-'}`
        })
      })

      if (res.ok) {
        // Track Pixel Purchase / Lead event
        trackPixelEvent('Purchase', {
          content_name: pageData.title,
          value: pageData.offer_price || 0,
          currency: 'THB'
        }, { userId: pageData.user_id, landingPageId: pageData.id, pixelId: pageData.fb_pixel_id || ownerProfile?.fb_pixel_id || null })

        setOrderSuccess(true)
        setOrderForm({ name: '', phone: '', address: '', note: '' })
      }
    } catch (e) {}
    setOrdering(false)
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
  const isLightBg = bgColor === '#FFFFFF' || bgColor === '#F9F9FF' || bgColor === '#F1F5F9'
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
        fbPixelId={pageData.fb_pixel_id || ownerProfile?.fb_pixel_id || null}
        tiktokPixelId={pageData.tiktok_pixel_id || ownerProfile?.tiktok_pixel_id || null}
        googlePixelId={pageData.google_pixel_id || ownerProfile?.google_pixel_id || null}
        lineTagId={pageData.line_tag_id || ownerProfile?.line_tag_id || null}
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

          {/* Primary CTA Button */}
          <button
            onClick={() => handleCtaClick(pageData.cta_url)}
            style={{ backgroundColor: themeColor }} className="w-full py-4 hover:opacity-90 text-white font-black rounded-2xl text-base sm:text-lg transition shadow-xl flex items-center justify-center gap-2 active:scale-98 animate-pulse"
          >
            <span>{pageData.cta_text || 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

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
        {Boolean(pageData.enable_review_album) && reviewImagesList.length > 0 && (
          <section className={`rounded-[32px] p-6 sm:p-8 space-y-4 border shadow-xl ${
            isLightBg ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  📸 รูปภาพรีวิวและการใช้งานจริงจากลูกค้า ({reviewImagesList.length} รูป)
                </h2>
              </div>
              <span className="text-xs text-emerald-400 font-bold">แตะดูรูปขยาย</span>
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

          {/* Big Order Button */}
          <button
            onClick={() => handleCtaClick(pageData.cta_url)}
            style={{ backgroundColor: themeColor }} className="w-full py-4 sm:py-5 hover:opacity-90 text-white font-black rounded-2xl text-base sm:text-xl transition shadow-xl flex items-center justify-center gap-2 active:scale-98"
          >
            <span>{pageData.cta_text || 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที'}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
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

        {/* INSTANT COD ORDER FORM (แสดงเฉพาะเมื่อเปิดใช้งานฟอร์มเก็บเงินปลายทาง) */}
        {Boolean(pageData.enable_cod_form) && (
        <section className={`border-2 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-5 backdrop-blur-xl relative z-10 ${
          isLightBg 
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50' 
            : 'bg-[#111827]/95 border-slate-600/80 text-white shadow-2xl'
        }`}>
          <div className="text-center border-b border-slate-700/80 pb-3">
            <h3 className={`text-xl sm:text-2xl font-black flex items-center justify-center gap-2 ${
              isLightBg ? 'text-slate-950' : 'text-white'
            }`}>
              📦 กรอกข้อมูลสั่งซื้อ (เก็บเงินปลายทาง)
            </h3>
            <p className={`text-xs sm:text-sm mt-1 font-medium ${
              isLightBg ? 'text-slate-600' : 'text-slate-200'
            }`}>
              กรอกชื่อ เบอร์โทร และที่อยู่จัดส่ง เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันออเดอร์
            </p>
          </div>

          {orderSuccess ? (
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/40 rounded-3xl text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="font-extrabold text-lg text-white">บันทึกการสั่งซื้อเรียบร้อยแล้ว!</h4>
              <p className="text-xs sm:text-sm text-slate-200">เจ้าหน้าที่จะติดต่อกลับไปยังเบอร์ที่ระบุโดยเร็วที่สุดครับ</p>
            </div>
          ) : (
            <form onSubmit={handleOrderSubmit} className="space-y-4 text-xs sm:text-sm font-bold">
              <div>
                <label className={`block mb-1.5 font-extrabold text-xs sm:text-sm ${
                  isLightBg ? 'text-slate-800' : 'text-white'
                }`}>
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
                <label className={`block mb-1.5 font-extrabold text-xs sm:text-sm ${
                  isLightBg ? 'text-slate-800' : 'text-white'
                }`}>
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
                <label className={`block mb-1.5 font-extrabold text-xs sm:text-sm ${
                  isLightBg ? 'text-slate-800' : 'text-white'
                }`}>
                  ที่อยู่สำหรับจัดส่งสินค้า
                </label>
                <textarea
                  rows={2}
                  placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                  className={`w-full px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-medium transition focus:outline-none border-2 shadow-sm ${
                    isLightBg 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white' 
                      : 'bg-[#1E293B] border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:bg-[#0F172A]'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 font-extrabold text-xs sm:text-sm ${
                  isLightBg ? 'text-slate-800' : 'text-white'
                }`}>
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

              <button
                type="submit"
                disabled={ordering}
                className="w-full py-4 sm:py-4.5 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-2xl text-sm sm:text-base transition shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-98 cursor-pointer border border-emerald-400/40 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{ordering ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการสั่งซื้อโปรโมชั่นนี้'}</span>
              </button>
            </form>
          )}
        </section>
        )}

      </main>

      {/* 4. STICKY BOTTOM MOBILE CONVERSION ACTION BAR */}
      <aside style={{ backgroundColor: isLightBg ? "#FFFFFFEE" : "#0B0F17EE", borderColor: isLightBg ? "#E2E8F0" : "#1E293B" }} className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-2xl p-3 px-4 shadow-2xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block leading-none">ราคาโปรโมชั่น</span>
            <span className="text-lg sm:text-xl font-black text-rose-400 font-mono">
              ฿{pageData.offer_price ? parseFloat(pageData.offer_price).toLocaleString() : '990'}
            </span>
          </div>

          <button
            onClick={() => handleCtaClick(pageData.cta_url)}
            style={{ backgroundColor: themeColor }}
            className="flex-1 py-3 px-5 hover:opacity-90 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>สั่งซื้อด่วนทันที</span>
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
