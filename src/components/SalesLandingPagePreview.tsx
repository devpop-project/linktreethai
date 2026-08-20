'use client'

import React, { useEffect, useState } from 'react'
import ImageLightboxModal from '@/components/ImageLightboxModal'
import { 
  ShoppingBag, Check, Flame, Clock, ShieldCheck, Truck, 
  Sparkles, ArrowRight, CheckCircle2, Send, AlertTriangle, 
  HelpCircle, Star, ChevronDown, ChevronUp, Lock, Palette, ImageIcon
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
    
    // SEO & Tracking
    seo_title?: string
    seo_description?: string
    og_image_url?: string
    fb_pixel_id?: string
    tiktok_pixel_id?: string
    google_pixel_id?: string
    line_tag_id?: string
  }
  profile: any
}

export default function SalesLandingPagePreview({ pageData, profile }: SalesLandingPagePreviewProps) {
  const [timeLeft, setTimeLeft] = useState((pageData.countdown_minutes || 15) * 60)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const themeColor = pageData.theme_color || '#EF4444'
  const bgColor = pageData.bg_color || '#0B0F17'
  const isLightBg = bgColor === '#FFFFFF' || bgColor === '#F9F9FF' || bgColor === '#F1F5F9'
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
  
  // Parse Lists & Image Albums
  const galleryImagesList = Array.isArray(pageData.gallery_images) && pageData.gallery_images.length > 0 
    ? pageData.gallery_images 
    : (pageData.gallery_images_text || '').split('\n').map(s => s.trim()).filter(s => s.length > 0)

  const reviewImagesList = Array.isArray(pageData.review_images) && pageData.review_images.length > 0 
    ? pageData.review_images 
    : (pageData.review_images_text || '').split('\n').map(s => s.trim()).filter(s => s.length > 0)

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

          {/* Primary CTA in Hero */}
          <button
            type="button"
            style={{ backgroundColor: themeColor }}
            className="w-full py-3.5 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 animate-pulse"
          >
            <span>{pageData.cta_text || 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

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
              <h3 className={`font-extrabold text-xs ${isLightBg ? 'text-slate-900' : 'text-white'}`}>
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
        {/* CUSTOMER REVIEW PHOTO ALBUM (อัลบั้มรูปรีวิวการันตีผลลัพธ์) */}
        {/* ========================================================================= */}
        {reviewImagesList.length > 0 && (
          <section className={`rounded-2xl p-4 space-y-3 border ${
            isLightBg ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <h3 className={`font-extrabold text-xs ${isLightBg ? 'text-slate-900' : 'text-white'}`}>
                  รูปภาพรีวิวและการใช้งานจริงจากลูกค้า ({reviewImagesList.length} รูป)
                </h3>
              </div>
              <span className="text-[9px] text-emerald-400 font-bold">แตะดูรูปขยาย</span>
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
                <h3 className={`font-extrabold text-xs ${isLightBg ? 'text-slate-900' : 'text-white'}`}>เสียงตอบรับจากลูกค้าจริง</h3>
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

          {/* Order Button */}
          <button
            type="button"
            style={{ backgroundColor: themeColor }}
            className="w-full py-3 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30"
          >
            <span>{pageData.cta_text || 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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
              <h3 className={`font-extrabold text-xs ${isLightBg ? 'text-slate-900' : 'text-white'}`}>คำถามที่พบบ่อย (FAQ)</h3>
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

        {/* COD Form Mockup (Shown only when enable_cod_form is true) */}
        {pageData.enable_cod_form !== false && (
          <div className={`rounded-2xl p-3.5 space-y-2.5 border shadow ${
            isLightBg ? 'bg-white border-slate-200' : 'bg-slate-900/95 border-slate-800'
          }`}>
            <div className="text-center pb-1 border-b border-slate-200 dark:border-slate-800">
              <h4 className={`font-black text-xs ${isLightBg ? 'text-slate-900' : 'text-white'}`}>กรอกข้อมูลสั่งซื้อ (เก็บเงินปลายทาง)</h4>
              <p className="text-[10px] text-slate-500">กรอกชื่อและเบอร์โทร เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันการจัดส่ง</p>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <input type="text" disabled placeholder="ชื่อ-นามสกุล ผู้รับสินค้า..." className="w-full px-3 py-2.5 bg-slate-900 border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-400 text-xs shadow-inner" />
              <input type="text" disabled placeholder="เบอร์โทรศัพท์สำหรับติดต่อ..." className="w-full px-3 py-2.5 bg-slate-900 border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-400 text-xs shadow-inner" />
              <textarea rows={1} disabled placeholder="ที่อยู่สำหรับจัดส่งสินค้า..." className="w-full px-3 py-2.5 bg-slate-900 border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-400 text-xs shadow-inner" />
              <div className="w-full py-2.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-center flex items-center justify-center gap-1 text-xs">
                <Send className="w-3 h-3" /> ยืนยันการสั่งซื้อโปรโมชั่นนี้
              </div>
            </div>
          </div>
        )}

      </div>

      {/* STICKY BOTTOM MOBILE BAR */}
      <div 
        className="sticky bottom-0 left-0 right-0 z-30 border-t p-2.5 px-3 flex items-center justify-between gap-2 shadow-2xl backdrop-blur-md"
        style={{ backgroundColor: isLightBg ? '#FFFFFFEE' : '#0B0F17EE', borderColor: isLightBg ? '#E2E8F0' : '#1E293B' }}
      >
        <div>
          <span className="text-[9px] text-slate-500 block leading-none">โปรโมชั่นพิเศษ</span>
          <span className="text-sm font-black font-mono" style={{ color: themeColor }}>
            ฿{pageData.offer_price ? parseFloat(String(pageData.offer_price)).toLocaleString() : '990'}
          </span>
        </div>
        <div 
          className="py-2 px-3.5 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-1 shadow"
          style={{ backgroundColor: themeColor }}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>สั่งซื้อด่วน</span>
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
