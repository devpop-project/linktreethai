'use client'

import React, { useEffect, useState } from 'react'
import ImageLightboxModal from '@/components/ImageLightboxModal'
import { getPromptPayQRImageUrl } from '@/lib/promptpay'
import { 
  ShoppingBag, Check, Flame, Clock, ShieldCheck, Truck, MessageCircle, Globe, 
  Sparkles, ArrowRight, CheckCircle2, Send, AlertTriangle, 
  HelpCircle, Star, ChevronDown, ChevronUp, Lock, Palette, ImageIcon, Upload
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

interface SalesLandingPagePreviewProps {
  pageData: {
    title?: string
    headline: string
    subheadline?: string
    hero_image_url?: string
    video_url?: string
    hero_media_url?: string
    hero_media_type?: string
    offer_price?: string | number
    original_price?: string | number
    countdown_minutes?: number
    features_text?: string
    body_content?: string
    cta_text?: string
    cta_url?: string
    cta_secondary_text?: string
    cta_secondary_url?: string
    cta_shop_text?: string
    cta_shop_url?: string
    
    // Pro Styling & Background
    theme_color?: string
    bg_color?: string
    bg_image_url?: string
    card_style?: string
    text_color?: string
    subtext_color?: string
    
    slug?: string
    
    gallery_images?: string[]
    review_images?: string[]
    gallery_images_text?: string
    review_images_text?: string

    // 6-Section Fields
    pain_headline?: string
    pain_points_text?: string
    benefits_headline?: string
    benefits_text?: string
    testimonials_text?: string
    faqs_text?: string
    guarantee_text?: string
    trust_badge_1?: string
    trust_badge_2?: string
    trust_badge_3?: string
    enable_cod_form?: boolean
    sticky_btn1_text?: string
    sticky_btn1_url?: string
    sticky_btn2_text?: string
    sticky_btn2_url?: string
    sticky_btn3_text?: string
    sticky_btn3_url?: string
    enable_review_album?: boolean
    
    // SEO & Tracking
    seo_title?: string
    seo_description?: string
    og_image_url?: string
    fb_pixel_id?: string
    tiktok_pixel_id?: string
    google_pixel_id?: string
    line_tag_id?: string
    promptpay_phone?: string
    promptpay_name?: string
    promptpay_bank?: string
  }
  profile: any
}

export default function SalesLandingPagePreview({ pageData, profile }: SalesLandingPagePreviewProps) {
  const [timeLeft, setTimeLeft] = useState((pageData.countdown_minutes || 15) * 60)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [previewPaymentMethod, setPreviewPaymentMethod] = useState<'promptpay' | 'cod'>('promptpay')
  const [previewCustomAmount, setPreviewCustomAmount] = useState<string>('')

  const themeColor = pageData.theme_color || '#EF4444'
  const bgColor = pageData.bg_color || '#0B0F17'
  const isLightBg = Boolean(bgColor && ['#ffffff', '#f9f9ff', '#f1f5f9', 'white'].includes(bgColor.toLowerCase().trim()))
  const textColor = pageData.text_color || (isLightBg ? '#0F172A' : '#FFFFFF')
  const subtextColor = pageData.subtext_color || (isLightBg ? '#334155' : '#E2E8F0')

  useEffect(() => {
    setTimeLeft((pageData.countdown_minutes || 15) * 60)
  }, [pageData.countdown_minutes])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : (pageData.countdown_minutes || 15) * 60))
    }, 1000)
    return () => clearInterval(timer)
  }, [pageData.countdown_minutes])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resolvedImageUrl = pageData.hero_image_url || (pageData.hero_media_type !== 'youtube' ? pageData.hero_media_url : null)
  const resolvedVideoUrl = pageData.video_url || (pageData.hero_media_type === 'youtube' ? pageData.hero_media_url : null)
  const embedVideoUrl = getYouTubeEmbedUrl(resolvedVideoUrl || null)
  
  // Parse Lists & Image Albums (Strict URL Validation)
  const rawGallery = Array.isArray(pageData.gallery_images) && pageData.gallery_images.length > 0
    ? pageData.gallery_images
    : (pageData.gallery_images_text || '').split('\n')

  const galleryImagesList = rawGallery
    .map(s => String(s || '').trim())
    .filter(s => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:image'))

  const rawReviews = Array.isArray(pageData.review_images) && pageData.review_images.length > 0
    ? pageData.review_images
    : (pageData.review_images_text || '').split('\n')

  const reviewImagesList = rawReviews
    .map(s => String(s || '').trim())
    .filter(s => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:image'))

  const openImageInLightbox = (images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // Parse Lists
  const featuresList = (pageData.features_text || '')
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const painPointsList = (pageData.pain_points_text || '')
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const benefitsList = (pageData.benefits_text || '')
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const testimonialsList = (pageData.testimonials_text || '')
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const faqsList = (pageData.faqs_text || '')
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  return (
    <div 
      className={`w-full font-sans antialiased pb-20 select-none relative transition-colors duration-300 ${
        isLightBg ? 'text-slate-900' : 'text-slate-100'
      }`}
      style={{
        backgroundColor: bgColor,
        ...(pageData.bg_image_url ? { 
          backgroundImage: `url(${pageData.bg_image_url})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        } : {})
      }}
    >
      {/* Background Image Overlay */}
      {pageData.bg_image_url && (
        <div className={`absolute inset-0 pointer-events-none z-0 ${isLightBg ? 'bg-white/85 backdrop-blur-[1px]' : 'bg-gradient-to-b from-black/85 via-[#0B0F17]/90 to-black/95 backdrop-blur-[1px]'}`}></div>
      )}

      {/* 1. FLASH SALE COUNTDOWN HEADER BAR (Uses Custom Theme Color) */}
      <div 
        className="sticky top-0 z-30 text-white py-2 px-3 shadow-md text-center"
        style={{ backgroundColor: themeColor }}
      >
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-black">
          <Flame className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
          <span>Flash Sale จำกัดเวลา!</span>
          <div className="bg-black/50 px-2 py-0.5 rounded font-mono text-yellow-300 border border-yellow-300/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 relative z-10">
        
        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION (Above the Fold) */}
        {/* ========================================================================= */}
        <section className="space-y-3.5 text-center">
          
          {/* Brand Pill & Active Pixel Indicator */}
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center justify-center gap-1.5">
              <img
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile?.username || 'admin'}`}
                alt={profile?.username || 'Brand'}
                className="w-6 h-6 rounded-full object-cover border border-slate-700 shadow"
              />
              <span className={`text-[11px] font-bold ${isLightBg ? 'text-slate-800' : 'text-slate-300'}`}>
                {profile?.full_name || profile?.username || 'Your Brand'}
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-bold">
                ✓ Verified
              </span>
            </div>

            {(pageData.fb_pixel_id || profile?.fb_pixel_id) && (
              <div className="text-[9px] text-purple-300 bg-purple-950/70 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Pixel: {pageData.fb_pixel_id ? `FB (${pageData.fb_pixel_id})` : `FB Global (${profile?.fb_pixel_id})`}</span>
              </div>
            )}
          </div>

          {/* Main Headline & Sub-headline */}
          <div className="space-y-1.5">
            <h1 
              style={{ color: textColor }}
              className="text-base sm:text-xl font-black leading-snug break-words drop-shadow-md"
            >
              {pageData.headline || 'หัวข้อพาดหัวขายของโปรโมชั่นพิเศษของคุณ (ดึงดูดใน 3 วินาทีแรก)'}
            </h1>
            {pageData.subheadline && (
              <p 
                style={{ color: subtextColor }}
                className="text-[11px] leading-relaxed break-words drop-shadow-sm font-medium"
              >
                {pageData.subheadline}
              </p>
            )}
          </div>

          {/* Hero Media: Both Image Banner and YouTube Video */}
          <div className="space-y-3">
            {resolvedImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-800/80 bg-black shadow-lg">
                <img src={resolvedImageUrl} alt="Product Banner" className="w-full h-auto object-cover max-h-56" />
              </div>
            )}

            {embedVideoUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-800/80 bg-black shadow-lg aspect-video w-full">
                <iframe src={embedVideoUrl} title="Sales Video" className="w-full h-full" allowFullScreen></iframe>
              </div>
            )}

            {!resolvedImageUrl && !embedVideoUrl && (
              <div className={`rounded-2xl overflow-hidden border py-8 text-center text-xs font-bold flex flex-col items-center gap-1 ${
                isLightBg ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
                <ShoppingBag className="w-8 h-8 opacity-40" />
                <span>ภาพสินค้า หรือ วิดีโอ YouTube</span>
              </div>
            )}
          </div>

          {/* Product Gallery Album (รูปภาพสินค้าเพิ่มเติม) */}
          {galleryImagesList.length > 0 && (
            <div className="space-y-2 pt-1 text-left">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold ${isLightBg ? 'text-slate-700' : 'text-slate-300'}`}>
                  📸 แกลเลอรีรูปภาพสินค้าเพิ่มเติม ({galleryImagesList.length} รูป)
                </span>
                <span className="text-[9px] text-purple-400 font-bold">แตะเพื่อดูรูปขยาย</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {galleryImagesList.map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => openImageInLightbox(galleryImagesList, idx)}
                    className="aspect-square rounded-xl overflow-hidden border border-slate-800 bg-black cursor-pointer hover:opacity-90 hover:scale-102 transition shadow-sm relative group"
                  >
                    <img src={imgUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3 Action Buttons in Hero */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              style={{ backgroundColor: themeColor }}
              className="w-full py-3.5 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 animate-pulse"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{pageData.sticky_btn1_text || pageData.cta_text || 'ติดต่อสั่งซื้อด่วน'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`py-2.5 px-3 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border transition ${
                  isLightBg ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-900 text-slate-200 border-slate-700'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate">{pageData.sticky_btn2_text || pageData.cta_secondary_text || 'ช่องทางติดต่ออื่นๆ'}</span>
              </button>

              <button
                type="button"
                className="py-2.5 px-3 bg-[#34D399] hover:bg-[#10B981] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="truncate">{pageData.sticky_btn3_text || pageData.cta_shop_text || 'สั่งซื้อออนไลน์'}</span>
              </button>
            </div>
          </div>

          {/* Trust Badges (Fully Customizable) */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-bold pt-1">
            <div className={`p-1.5 rounded-xl border flex flex-col items-center gap-0.5 ${
              isLightBg ? 'bg-white border-slate-200 text-slate-700 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{pageData.trust_badge_1 || 'ส่งฟรีด่วน'}</span>
            </div>
            <div className={`p-1.5 rounded-xl border flex flex-col items-center gap-0.5 ${
              isLightBg ? 'bg-white border-slate-200 text-slate-700 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{pageData.trust_badge_2 || 'ของแท้ 100%'}</span>
            </div>
            <div className={`p-1.5 rounded-xl border flex flex-col items-center gap-0.5 ${
              isLightBg ? 'bg-white border-slate-200 text-slate-700 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{pageData.trust_badge_3 || 'ชำระเงินปลอดภัย'}</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: PAIN POINT & AGITATION (ขยี้ปัญหาที่ลูกค้าเจอ) */}
        {/* ========================================================================= */}
        {painPointsList.length > 0 && (
          <section className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <h3 className="font-extrabold text-xs text-rose-300">
                {pageData.pain_headline || 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?'}
              </h3>
            </div>
            <div className="space-y-2">
              {painPointsList.map((pain, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-white font-bold leading-snug bg-rose-950/70 p-3 rounded-xl border border-rose-800/80 shadow">
                  <span className="text-rose-400 font-bold shrink-0">❌</span>
                  <span>{pain}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: SOLUTION & BENEFITS (นำเสนอทางแก้และผลลัพธ์ที่ได้) */}
        {/* ========================================================================= */}
        {benefitsList.length > 0 && (
          <section className={`rounded-2xl p-4 space-y-3 border ${
            isLightBg ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <h3 style={{ color: isLightBg ? '#0F172A' : '#FFFFFF' }} className="font-black text-xs sm:text-sm drop-shadow-sm">
                {pageData.benefits_headline || 'ทางออกและผลลัพธ์ที่คุณจะได้รับ'}
              </h3>
            </div>
            <div className="space-y-2">
              {benefitsList.map((benefit, idx) => (
                <div key={idx} className={`flex items-start gap-2 text-[11px] font-bold text-white leading-snug p-3 rounded-xl border ${
                  isLightBg ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}>
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
          <section className={`rounded-2xl p-4 space-y-3 border ${
            isLightBg ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h3 
                  style={{ color: isLightBg ? '#0F172A' : '#FFFFFF' }}
                  className="font-black text-xs sm:text-sm tracking-tight drop-shadow-sm"
                >
                  📸 รูปภาพรีวิวและการใช้งานจริงจากลูกค้า ({reviewImagesList.length} รูป)
                </h3>
              </div>
              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                แตะดูรูปขยาย
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {reviewImagesList.map((imgUrl: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => openImageInLightbox(reviewImagesList, idx)}
                  className="aspect-square rounded-xl overflow-hidden border border-slate-800 bg-black cursor-pointer hover:opacity-90 hover:scale-102 transition shadow relative group"
                >
                  <img src={imgUrl} alt={`Review ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
                    🔍 ขยาย
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
          <section className={`rounded-2xl p-4 space-y-3 border ${
            isLightBg ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <h3 style={{ color: isLightBg ? '#0F172A' : '#FFFFFF' }} className="font-black text-xs sm:text-sm drop-shadow-sm">เสียงตอบรับจากลูกค้าจริง</h3>
              </div>
              <span className="text-[10px] text-amber-500 font-bold font-mono">★★★★★ 4.9/5</span>
            </div>
            <div className="space-y-2">
              {testimonialsList.map((rev, idx) => (
                <div key={idx} className={`p-3 rounded-xl border text-[10px] space-y-1 ${
                  isLightBg ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex text-amber-400 text-[10px]">★★★★★</div>
                  <p className="italic leading-relaxed">"{rev}"</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Guarantee Banner */}
        {pageData.guarantee_text && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-center flex items-center justify-center gap-2 text-[11px] font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{pageData.guarantee_text}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: PRICING & THE OFFER (ยื่นข้อเสนอที่ปฏิเสธไม่ได้) */}
        {/* ========================================================================= */}
        <section 
          className="rounded-2xl p-4 shadow-xl text-center space-y-3 relative overflow-hidden border-2"
          style={{ borderColor: themeColor, backgroundColor: isLightBg ? '#FFFFFF' : '#0F172A' }}
        >
          <div 
            className="absolute top-0 right-0 text-white font-black text-[9px] px-2.5 py-0.5 rounded-bl-xl"
            style={{ backgroundColor: themeColor }}
          >
            🔥 SPECIAL OFFER
          </div>

          <div className="space-y-0.5">
            <span className={`text-[10px] font-bold ${isLightBg ? 'text-slate-500' : 'text-slate-400'}`}>ราคาพิเศษเฉพาะวันนี้เท่านั้น</span>
            <div className="flex items-center justify-center gap-2">
              {pageData.original_price && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  ฿{parseFloat(String(pageData.original_price)).toLocaleString()}
                </span>
              )}
              <span className="text-2xl font-black font-mono" style={{ color: themeColor }}>
                ฿{pageData.offer_price ? parseFloat(String(pageData.offer_price)).toLocaleString() : '990'}
              </span>
            </div>
          </div>

          {/* Bullet Highlights */}
          {featuresList.length > 0 && (
            <div className="text-left space-y-1 pt-1">
              {featuresList.map((feat, idx) => (
                <div key={idx} className={`flex items-start gap-1.5 text-[10px] ${isLightBg ? 'text-slate-700' : 'text-slate-200'}`}>
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* 3 Order / Contact Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              style={{ backgroundColor: themeColor }}
              className="w-full py-3 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{pageData.sticky_btn1_text || pageData.cta_text || 'ติดต่อสั่งซื้อด่วน'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`py-2 px-2 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border ${
                  isLightBg ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-900 text-slate-200 border-slate-700'
                }`}
              >
                <Globe className="w-3 h-3 text-purple-400" />
                <span className="truncate">{pageData.cta_secondary_text || 'ช่องทางติดต่ออื่นๆ'}</span>
              </button>

              <button
                type="button"
                className="py-2 px-2 bg-[#34D399] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow"
              >
                <ShoppingBag className="w-3 h-3" />
                <span className="truncate">{pageData.cta_shop_text || 'สั่งซื้อออนไลน์'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Sales Copy Body */}
        {pageData.body_content && (
          <div className={`rounded-2xl p-3.5 text-[11px] leading-relaxed whitespace-pre-line border ${
            isLightBg ? 'bg-white border-slate-200 text-slate-700 shadow-sm' : 'bg-slate-900/90 border-slate-800 text-slate-200'
          }`}>
            {pageData.body_content}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: FAQ & FINAL CTA (เคลียร์ข้อสงสัย & ปิดการขาย) */}
        {/* ========================================================================= */}
        {faqsList.length > 0 && (
          <section className={`rounded-2xl p-4 space-y-3 border ${
            isLightBg ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
              <h3 style={{ color: isLightBg ? '#0F172A' : '#FFFFFF' }} className="font-black text-xs sm:text-sm drop-shadow-sm">คำถามที่พบบ่อย (FAQ)</h3>
            </div>
            <div className="space-y-2">
              {faqsList.map((faqLine, idx) => {
                const parts = faqLine.split('|')
                const q = parts[0] ? parts[0].trim() : faqLine
                const a = parts[1] ? parts[1].trim() : 'คำตอบสำหรับคำถามนี้ สามารถติดต่อสอบถามเพิ่มเติมได้ตลอด 24 ชม.'
                const isOpen = openFaq === idx
                return (
                  <div key={idx} className={`rounded-xl border overflow-hidden text-[10px] ${
                    isLightBg ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3 text-left font-extrabold text-white flex items-center justify-between transition text-xs"
                    >
                      <span>Q: {q}</span>
                      {isOpen ? <ChevronUp className="w-3 h-3 opacity-60" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 text-slate-100 border-t border-slate-800 pt-2 leading-relaxed text-[11px] font-medium bg-slate-900/50">
                        A: {a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* FULL CHECKOUT FORM PREVIEW (พร้อมเพย์ QR ตามยอด + COD + แนบสลิป) */}
        {Boolean(pageData.enable_cod_form) && (() => {
          const ownerPPPhone = pageData.promptpay_phone || profile?.promptpay_phone || '0909964514'
          const ownerPPName = pageData.promptpay_name || profile?.full_name || profile?.username || 'เจ้าของร้านค้า'
          const ownerPPBank = pageData.promptpay_bank || 'พร้อมเพย์ (PromptPay)'
          const defaultPrice = pageData.offer_price ? parseFloat(String(pageData.offer_price)) : 0
          const enteredAmt = parseFloat(previewCustomAmount)
          const currentPayAmount = !isNaN(enteredAmt) && enteredAmt > 0 ? enteredAmt : defaultPrice
          const isPromptPay = previewPaymentMethod === 'promptpay'

          return (
            <div className="bg-gradient-to-b from-slate-900/95 via-[#0F172A]/95 to-[#0B0F17]/98 border-2 border-slate-700/80 rounded-[32px] p-5 sm:p-7 shadow-2xl space-y-5 text-white ring-1 ring-white/10">
              <div className="text-center pb-3 border-b border-slate-700/60 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ระบบสั่งซื้อปลอดภัย 100% • แจ้งเตือนเข้า LINE เจ้าหน้าที่</span>
                </div>
                <h3 className="font-black text-lg sm:text-xl text-white flex items-center justify-center gap-2">
                  <span>🛒 กรอกข้อมูลสั่งซื้อสินค้า & ชำระเงิน</span>
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  เลือกวิธีชำระเงิน กรอกที่อยู่จัดส่ง และกดยืนยันออเดอร์
                </p>
              </div>

              <div className="space-y-4 text-xs font-bold">
                {/* 1. Payment Method Switcher in Preview */}
                <div className="space-y-1.5">
                  <label className="block text-slate-200">1. เลือกวิธีการชำระเงิน *</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPreviewPaymentMethod('promptpay')}
                      className={`p-3.5 rounded-2xl border-2 font-black text-xs flex items-center gap-2.5 transition active:scale-98 cursor-pointer ${
                        isPromptPay
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-500/25 to-teal-500/15 text-emerald-300 shadow-md ring-2 ring-emerald-500/30'
                          : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg">📱</span>
                      <div className="text-left min-w-0 flex-1">
                        <span className="block font-black text-xs text-white">โอนพร้อมเพย์</span>
                        <span className="text-[9px] font-medium text-emerald-400 block">สแกน QR Code</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewPaymentMethod('cod')}
                      className={`p-3.5 rounded-2xl border-2 font-black text-xs flex items-center gap-2.5 transition active:scale-98 cursor-pointer ${
                        !isPromptPay
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-500/25 to-teal-500/15 text-emerald-300 shadow-md ring-2 ring-emerald-500/30'
                          : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg">🚚</span>
                      <div className="text-left min-w-0 flex-1">
                        <span className="block font-black text-xs text-white">เก็บเงินปลายทาง</span>
                        <span className="text-[9px] font-medium text-slate-400 block">ชำระเมื่อรับของ</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. PromptPay QR Code Box in Preview */}
                {isPromptPay && (
                  <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border-2 border-emerald-500/40 space-y-3.5 text-center shadow-inner">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏦</span>
                        <div>
                          <div className="font-black text-xs text-emerald-400">บัญชีรับเงินพร้อมเพย์ร้านค้า</div>
                          <div className="text-[10px] text-slate-300">{ownerPPName} • {ownerPPBank}</div>
                          <div className="text-[10px] font-mono text-emerald-400 font-bold">{ownerPPPhone}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block">ยอดชำระ</span>
                        <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                          ฿{currentPayAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Custom Amount Input in Preview */}
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-extrabold text-slate-200 flex items-center justify-between">
                        <span>💰 ยอดเงินที่ต้องการโอน (บาท)</span>
                        <span className="text-[9px] text-slate-400">ราคาตั้งต้น: ฿{defaultPrice.toLocaleString()}</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">฿</span>
                        <input
                          type="number"
                          placeholder={`ระบุยอดเงิน (หากไม่กรอกจะคิด ฿${defaultPrice.toLocaleString()})`}
                          value={previewCustomAmount}
                          onChange={(e) => setPreviewCustomAmount(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-black text-emerald-400 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    {/* Dynamic QR Code Image */}
                    <div className="p-3 bg-white rounded-2xl inline-block shadow-lg mx-auto border border-slate-200">
                      <img
                        src={getPromptPayQRImageUrl(ownerPPPhone, currentPayAmount, 160)}
                        alt="PromptPay QR Code"
                        className="w-36 h-36 object-contain mx-auto"
                      />
                      <div className="mt-1 text-slate-900 font-black text-[11px] font-mono">
                        สแกนจ่าย ฿{currentPayAmount.toLocaleString()} บาท
                      </div>
                      <div className="text-[9px] text-slate-600 font-bold">{ownerPPName}</div>
                    </div>

                    {/* Slip Upload Dropzone Preview */}
                    <div className="space-y-1.5 text-left pt-0.5">
                      <label className="block text-[11px] font-extrabold text-slate-200 flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        <span>แนบรูปสลิปโอนเงิน</span>
                        <span className="text-[9px] text-emerald-400">(ส่งเข้า LINE เจ้าของร้านทันที)</span>
                      </label>
                      <div className="w-full p-3 bg-slate-900/90 border-2 border-dashed border-emerald-500/50 hover:bg-slate-850 text-slate-200 rounded-2xl text-xs flex flex-col items-center justify-center gap-1 shadow cursor-pointer">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-[11px]">แตะเพื่อเลือกรูปสลิปโอนเงิน</span>
                        <span className="text-[9px] text-slate-400">รองรับไฟล์ภาพ JPG, PNG</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Information Input Fields */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block mb-1 text-slate-200 text-xs font-bold">ชื่อ-นามสกุล ผู้รับสินค้า *</label>
                    <input
                      type="text"
                      disabled
                      placeholder="เช่น สมชาย ใจดี"
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-400 text-xs shadow-inner font-medium"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-200 text-xs font-bold">เบอร์โทรศัพท์สำหรับติดต่อ *</label>
                    <input
                      type="tel"
                      disabled
                      placeholder="081-xxx-xxxx"
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-400 font-mono text-xs shadow-inner font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-200 flex items-center gap-1 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#06C755]"></span>
                        <span>LINE ID สำหรับติดต่อ (ถ้ามี)</span>
                      </label>
                      <span className="text-[9px] text-slate-400 font-normal">แอดเพื่อแจ้งสถานะจัดส่ง</span>
                    </div>
                    <input
                      type="text"
                      disabled
                      placeholder="เช่น @yourshop หรือ line_id"
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-400 font-mono text-xs shadow-inner font-medium"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-200 text-xs font-bold">ที่อยู่สำหรับจัดส่งสินค้า</label>
                    <textarea
                      rows={2}
                      disabled
                      placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-400 text-xs shadow-inner leading-relaxed font-medium"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-200 text-xs font-bold">หมายเหตุเพิ่มเติม (ถ้ามี)</label>
                    <input
                      type="text"
                      disabled
                      placeholder="เช่น ฝากไว้หน้าบ้าน, โทรแจ้งก่อนส่ง"
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-400 text-xs shadow-inner font-medium"
                    />
                  </div>
                </div>

                {/* Luxurious High-Converting CTA Button Preview */}
                <div className="pt-2">
                  <div className="w-full py-4 px-5 bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#059669] text-slate-950 font-black rounded-3xl text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 ring-4 ring-emerald-400/30 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="w-9 h-9 rounded-xl bg-slate-950/15 text-slate-950 flex items-center justify-center font-black shadow-inner shrink-0">
                        <ShoppingBag className="w-4 h-4 text-slate-950" />
                      </div>
                      <div>
                        <span className="block font-black text-xs sm:text-sm leading-tight text-slate-950">
                          ยืนยันการสั่งซื้อโปรโมชั่นนี้
                        </span>
                        <span className="text-[10px] font-bold opacity-85 block text-slate-900 mt-0.5">
                          {isPromptPay ? '✓ ชำระเงินโอนพร้อมเพย์แนบสลิป' : '✓ เก็บเงินปลายทาง (COD)'}
                        </span>
                      </div>
                    </div>

                    <div className="px-3 py-1.5 bg-slate-950 text-emerald-400 rounded-xl font-mono font-black text-xs flex items-center gap-1 shadow shrink-0">
                      <span>฿{currentPayAmount.toLocaleString()}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

      </div>

      {/* 3 STICKY BOTTOM MOBILE ACTION BUTTONS (แถบ 3 ปุ่มสั่งซื้อและติดต่อด่วน) */}
      <div 
        className="sticky bottom-0 left-0 right-0 z-30 border-t p-2 px-2.5 shadow-2xl backdrop-blur-xl"
        style={{ backgroundColor: isLightBg ? '#FFFFFFEE' : '#0B0F17EE', borderColor: isLightBg ? '#E2E8F0' : '#1E293B' }}
      >
        <div className="flex items-center justify-between gap-1.5 max-w-lg mx-auto">
          
          {/* Price Tag Box */}
          <div className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center shrink-0 min-w-[58px]">
            <span className="text-[8px] text-slate-400 block leading-none">ราคาพิเศษ</span>
            <span className="text-xs font-black font-mono" style={{ color: themeColor }}>
              ฿{pageData.offer_price ? parseFloat(String(pageData.offer_price)).toLocaleString() : '990'}
            </span>
          </div>

          {/* Button 1: ติดต่อสั่งซื้อด่วน (Primary Accent / Theme Color) */}
          <div 
            className="flex-1 py-2 px-2 text-white font-black rounded-xl text-[10px] sm:text-xs flex items-center justify-center gap-1 shadow-md transition text-center truncate cursor-pointer"
            style={{ backgroundColor: themeColor }}
          >
            <Flame className="w-3 h-3 text-yellow-300 animate-bounce shrink-0" />
            <span className="truncate">{pageData.sticky_btn1_text || 'ติดต่อสั่งซื้อด่วน'}</span>
          </div>

          {/* Button 2: ช่องทางติดต่ออื่นๆ (Secondary Dark / Glass) */}
          <div 
            className="flex-1 py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold rounded-xl text-[10px] sm:text-xs flex items-center justify-center gap-1 border border-slate-700 shadow transition text-center truncate cursor-pointer"
          >
            <Send className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="truncate">{pageData.sticky_btn2_text || 'ช่องทางติดต่ออื่นๆ'}</span>
          </div>

          {/* Button 3: สั่งซื้อออนไลน์ (E-Commerce Accent / Green) */}
          <div 
            className="flex-1 py-2 px-2 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold rounded-xl text-[10px] sm:text-xs flex items-center justify-center gap-1 shadow transition text-center truncate cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3 shrink-0" />
            <span className="truncate">{pageData.sticky_btn3_text || 'สั่งซื้อออนไลน์'}</span>
          </div>

        </div>
      </div>

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
